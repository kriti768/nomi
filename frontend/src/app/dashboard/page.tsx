'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FormSchema } from '@/types/form';
import { useToast } from '@/context/ToastContext';
import { NomiLogo } from '@/components/brand/NomiLogo';

type Filter = 'all' | 'published' | 'draft';
type Sort = 'updated' | 'created' | 'name';

const formatDate = (date: string) => {
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
  } catch {
    return 'Recent';
  }
};

export default function DashboardPage() {
  const { showToast } = useToast();
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renameForm, setRenameForm] = useState<FormSchema | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('updated');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const menuRef = useRef<HTMLDivElement | null>(null);

  const loadForms = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getForms();
      setForms(data);
      const countEntries = await Promise.all(
        data.map(async (form) => [form.id, (await api.getResponses(form.id)).length] as const)
      );
      setCounts(Object.fromEntries(countEntries));
    } catch {
      showToast('Failed to load forms. Check that the local backend is running.', 'warning');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createForm = async () => {
    try {
      setCreating(true);
      const form = await api.createForm({ title: 'My Conversational Form' });
      window.location.assign(`/builder/${form.id}`);
    } catch {
      showToast('Failed to create form. Check that the local backend is running.', 'warning');
      setCreating(false);
    }
  };

  const handleAction = async (form: FormSchema, action: 'publish' | 'delete' | 'copy' | 'duplicate' | 'rename' | 'export') => {
    setMenuId(null);

    if (action === 'rename') {
      setRenameForm(form);
      setRenameTitle(form.title);
      return;
    }

    if (action === 'export') {
      try {
        const fullForm = await api.getForm(form.id);
        const responses = await api.getResponses(form.id);
        if (!responses || responses.length === 0) {
          showToast('No responses submitted to export yet', 'warning');
          return;
        }
        const questions = fullForm.questions || [];
        const headers = ['Response ID', 'Submitted At', ...questions.map((q) => `"${(q.title || 'Untitled').replace(/"/g, '""')}"`)];
        const rows = responses.map((r) => {
          const answersMap = (r.answers || []).reduce<Record<string, any>>((acc, a) => {
            acc[a.question_id] = a.value;
            return acc;
          }, {});
          const dateStr = new Date(r.submitted_at).toISOString();
          const cols = questions.map((q) => {
            const val = answersMap[q.id];
            if (val === undefined || val === null) return '""';
            const strVal = Array.isArray(val) ? val.join('; ') : String(val);
            return `"${strVal.replace(/"/g, '""')}"`;
          });
          return [r.id || '', `"${dateStr}"`, ...cols].join(',');
        });
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${form.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_responses.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV export downloaded');
      } catch {
        showToast('Failed to export responses', 'warning');
      }
      return;
    }

    if (action === 'copy') {
      if (form.status !== 'published') {
        showToast('Publish this form before copying its public link.', 'warning');
        return;
      }
      try {
        const publicUrl = `${window.location.origin}/f/${form.id}`;
        await navigator.clipboard.writeText(publicUrl);
        showToast('Public link copied to clipboard');
      } catch {
        showToast('Could not copy the public link', 'warning');
      }
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Delete “${form.title}”? All questions and responses will be permanently removed.`)) {
        return;
      }
    }

    try {
      setActionId(form.id);
      if (action === 'delete') {
        await api.deleteForm(form.id);
        setForms((items) => items.filter((item) => item.id !== form.id));
        showToast('Form deleted successfully');
      } else if (action === 'duplicate') {
        const duplicated = await api.duplicateForm(form.id);
        setForms((items) => [duplicated, ...items]);
        setCounts((items) => ({ ...items, [duplicated.id]: 0 }));
        showToast('Form duplicated successfully');
      } else {
        const updated = form.status === 'published'
          ? await api.unpublishForm(form.id)
          : await api.publishForm(form.id);
        setForms((items) => items.map((item) => item.id === form.id ? updated : item));
        showToast(updated.status === 'published' ? 'Form published' : 'Form unpublished');
      }
    } catch {
      showToast('That action could not be completed', 'warning');
    } finally {
      setActionId(null);
    }
  };

  const handleSaveRename = async () => {
    if (!renameForm || !renameTitle.trim()) return;
    try {
      const updated = await api.updateForm(renameForm.id, { title: renameTitle.trim() });
      setForms((items) => items.map((f) => (f.id === renameForm.id ? updated : f)));
      showToast('Form renamed');
      setRenameForm(null);
    } catch {
      showToast('Failed to rename form', 'warning');
    }
  };

  const visibleForms = useMemo(() => {
    return forms
      .filter((form) => {
        const matchesFilter = filter === 'all' || form.status === filter;
        const matchesQuery = `${form.title} ${form.description || ''}`.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === 'name') return a.title.localeCompare(b.title);
        const timeA = new Date(sort === 'updated' ? a.updated_at : a.created_at).getTime();
        const timeB = new Date(sort === 'updated' ? b.updated_at : b.created_at).getTime();
        return timeB - timeA;
      });
  }, [forms, filter, query, sort]);

  return (
    <main className="nomi-dashboard">
      <div className="nomi-dashboard-grid" aria-hidden="true" />
      <div className="nomi-dashboard-orb nomi-dashboard-orb-one" aria-hidden="true" />
      <div className="nomi-dashboard-orb nomi-dashboard-orb-two" aria-hidden="true" />
      <div className="nomi-dashboard-orb nomi-dashboard-orb-three" aria-hidden="true" />

      {/* Header */}
      <header className="nomi-dashboard-header">
        <Link href="/" className="nomi-dashboard-brand" aria-label="Nomi home">
          <NomiLogo size="md" withWordmark={true} />
        </Link>
        <button
          type="button"
          onClick={createForm}
          disabled={creating}
          className="nomi-dashboard-create"
        >
          <span>{creating ? 'Creating...' : 'Create form'}</span>
          <b aria-hidden="true">+</b>
        </button>
      </header>

      {/* Main Workspace Content */}
      <section className="nomi-dashboard-content">
        <div className="nomi-dashboard-intro">
          <div>
            <p>WORKSPACE</p>
            <h1>My <em>Forms</em></h1>
            <span className="nomi-intro-sub">Questions worth answering. Craft, share, and understand conversations.</span>
          </div>
          <div className="nomi-dashboard-summary">
            <strong>{forms.length}</strong>
            <span>Active forms in<br />your workspace</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="nomi-dashboard-controls">
          <label className="nomi-dashboard-search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search forms by title or topic..."
              aria-label="Search forms"
            />
          </label>

          <div className="nomi-dashboard-segment">
            {(['all', 'published', 'draft'] as Filter[]).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setFilter(item)}
                className={filter === item ? 'is-active' : ''}
              >
                {item === 'all' ? 'All forms' : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <label className="nomi-dashboard-sort">
            Sort:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort forms"
            >
              <option value="updated">Recently updated</option>
              <option value="created">Recently created</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </label>

          <div className="nomi-dashboard-view">
            <button
              type="button"
              className={view === 'grid' ? 'is-active' : ''}
              onClick={() => setView('grid')}
              aria-label="Grid view"
            >
              ▦
            </button>
            <button
              type="button"
              className={view === 'list' ? 'is-active' : ''}
              onClick={() => setView('list')}
              aria-label="List view"
            >
              ☷
            </button>
          </div>
        </div>

        {/* Form Grid / List / Empty State */}
        {loading ? (
          <div className="nomi-dashboard-empty">
            <p>Loading your forms from database...</p>
          </div>
        ) : visibleForms.length === 0 ? (
          <div className="nomi-dashboard-empty">
            <p>
              {forms.length > 0
                ? 'No forms match those search filters.'
                : 'Your next conversation starts here.'}
            </p>
            <button type="button" onClick={createForm}>
              Create a form <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <div className={`nomi-form-grid nomi-form-grid-${view}`} ref={menuRef}>
            {visibleForms.map((form) => {
              const firstQuestion = form.questions[0];
              const responseCount = counts[form.id] ?? 0;

              return (
                <article className="nomi-form-card" key={form.id}>
                  <div className="nomi-form-card-top">
                    <span className={`nomi-status nomi-status-${form.status}`}>
                      {form.status}
                    </span>

                    <div className="nomi-form-menu">
                      <button
                        type="button"
                        onClick={() => setMenuId(menuId === form.id ? null : form.id)}
                        aria-label={`Actions for ${form.title}`}
                      >
                        •••
                      </button>

                      {menuId === form.id && (
                        <div role="menu">
                          <Link href={`/builder/${form.id}`}>Edit form</Link>
                          <button type="button" onClick={() => handleAction(form, 'rename')}>
                            Rename form
                          </button>
                          <button type="button" onClick={() => handleAction(form, 'duplicate')}>
                            Duplicate form
                          </button>
                          <button type="button" onClick={() => handleAction(form, 'export')}>
                            Export to CSV
                          </button>
                          <button type="button" onClick={() => handleAction(form, 'copy')}>
                            Copy public link
                          </button>
                          <button type="button" onClick={() => handleAction(form, 'publish')}>
                            {form.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            type="button"
                            className="is-danger"
                            onClick={() => handleAction(form, 'delete')}
                          >
                            Delete form
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/builder/${form.id}`} className="nomi-form-card-main">
                    <h2>{form.title}</h2>
                    <p className="nomi-form-card-desc">
                      {form.description || 'A conversational form ready to collect structured responses.'}
                    </p>

                    {/* Miniature Real Form Preview */}
                    <div className="nomi-form-mini-preview">
                      {firstQuestion ? (
                        <>
                          <div className="nomi-mini-q-badge">
                            <span>01</span>
                            <span>•</span>
                            <span>{firstQuestion.type.replace('_', ' ')}</span>
                          </div>
                          <div className="nomi-mini-q-title">
                            {firstQuestion.title || 'Untitled question'}
                          </div>
                          {firstQuestion.choices && firstQuestion.choices.length > 0 ? (
                            <div className="nomi-mini-choices">
                              {firstQuestion.choices.slice(0, 2).map((choice, i) => (
                                <div key={choice.id || i} className="nomi-mini-choice-pill">
                                  <span>{String.fromCharCode(65 + i)}</span>
                                  <span>{choice.label}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="nomi-mini-choices">
                              <div className="nomi-mini-choice-pill">
                                <span>↵</span>
                                <span>{firstQuestion.settings?.placeholder || 'Type your answer...'}</span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="nomi-mini-q-badge"><span>01</span> • <span>Draft</span></div>
                          <div className="nomi-mini-q-title">Add your first question</div>
                          <div className="nomi-mini-choices">
                            <div className="nomi-mini-choice-pill"><span>+</span> Click to start building</div>
                          </div>
                        </>
                      )}
                    </div>
                  </Link>

                  <div className="nomi-form-card-meta">
                    <span><b>{form.questions.length}</b> questions</span>
                    <span><b>{responseCount}</b> responses</span>
                    <span>{formatDate(form.updated_at)}</span>
                  </div>

                  <div className="nomi-form-card-actions">
                    <Link href={`/builder/${form.id}`} className="nomi-edit-link">
                      Open builder <span>→</span>
                    </Link>
                    <button
                      type="button"
                      className="nomi-copy-link-btn"
                      disabled={actionId === form.id}
                      onClick={() => handleAction(form, 'publish')}
                    >
                      {actionId === form.id
                        ? 'Saving...'
                        : form.status === 'published'
                        ? 'Unpublish'
                        : 'Publish'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Rename Dialog Modal */}
      {renameForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Rename Form
            </h3>
            <input
              type="text"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
              placeholder="Form title..."
              className="w-full min-h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenameForm(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRename}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormSchema, Question, QuestionType, FormTheme, FormSettings } from '@/types/form';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { getEffectiveTheme } from '@/lib/theme';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { BuilderToolbar } from '@/components/builder/toolbar/BuilderToolbar';
import { DesignPanel } from '@/components/builder/toolbar/DesignPanel';
import { AccessibilityPanel } from '@/components/builder/toolbar/AccessibilityPanel';
import { LanguagePanel } from '@/components/builder/toolbar/LanguagePanel';
import { FormSettingsPanel } from '@/components/builder/toolbar/FormSettingsPanel';
import { ContentSidebar } from '@/components/builder/ContentSidebar';
import { AddContentModal } from '@/components/builder/AddContentModal';
import { CanvasStage } from '@/components/builder/CanvasStage';
import { QuestionInspector } from '@/components/builder/QuestionInspector';
import { FormPlayer } from '@/components/respondent/FormPlayer';
import { ResultsView } from '@/components/results/ResultsView';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const { showToast } = useToast();

  const [form, setForm] = useState<FormSchema | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'results'>('create');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'design' | 'accessibility' | 'language' | 'settings' | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadForm = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getForm(formId);
      setForm(data);
      if (data.questions && data.questions.length > 0) {
        setSelectedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load form');
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isPreviewMode) {
          setIsPreviewMode(false);
        } else if (activeDrawer !== null) {
          setActiveDrawer(null);
        } else if (isAddModalOpen) {
          setIsAddModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPreviewMode, activeDrawer, isAddModalOpen]);

  const questions = form?.questions || [];
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) || null;
  const selectedQuestionIndex = questions.findIndex((q) => q.id === selectedQuestionId);

  // Add Question
  const handleAddQuestion = async (type: QuestionType) => {
    if (!form) return;
    try {
      setIsSaving(true);
      const newQuestion = await api.createQuestion(form.id, {
        type,
        title: `Untitled ${type.replace('_', ' ')}`,
        position: questions.length,
        required: false,
        choices:
          type === 'multiple_choice' || type === 'dropdown'
            ? [{ label: 'Option 1' }, { label: 'Option 2' }]
            : [],
      });

      const updatedForm = {
        ...form,
        questions: [...questions, newQuestion],
      };
      setForm(updatedForm);
      setSelectedQuestionId(newQuestion.id);
      showToast('Question added');
    } catch (err) {
      console.error(err);
      showToast('Failed to add question', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  // Update Selected Question
  const handleUpdateQuestion = async (updatedData: Partial<Question>) => {
    if (!selectedQuestion) return;

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id ? { ...q, ...updatedData } : q
    );

    if (form) {
      setForm({ ...form, questions: updatedQuestions });
    }

    try {
      setIsSaving(true);
      await api.updateQuestion(selectedQuestion.id, updatedData);
    } catch (err) {
      console.error('Failed to update question:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Update Theme
  const handleUpdateTheme = async (themeUpdate: Partial<FormTheme>) => {
    if (!form) return;
    const current = getEffectiveTheme(form.theme);
    const mergedTheme: FormTheme = {
      ...current,
      ...themeUpdate,
    };

    setForm({ ...form, theme: mergedTheme });

    try {
      setIsSaving(true);
      await api.updateForm(form.id, { theme: mergedTheme });
    } catch (err) {
      console.error('Failed to update theme:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Update Settings
  const handleUpdateSettings = async (settingsUpdate: Partial<FormSettings>) => {
    if (!form) return;
    const mergedSettings: FormSettings = {
      ...(form.settings || {}),
      ...settingsUpdate,
    };

    setForm({ ...form, settings: mergedSettings });

    try {
      setIsSaving(true);
      await api.updateForm(form.id, { settings: mergedSettings });
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Update Language
  const handleUpdateLanguage = async (lang: string) => {
    if (!form) return;
    setForm({ ...form, language: lang });
    try {
      setIsSaving(true);
      await api.updateForm(form.id, { language: lang });
      showToast(`Language set to ${lang.toUpperCase()}`);
    } catch (err) {
      console.error('Failed to update language:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Update Form Metadata
  const handleUpdateForm = async (data: Partial<FormSchema>) => {
    if (!form) return;
    setForm({ ...form, ...data });
    try {
      setIsSaving(true);
      await api.updateForm(form.id, data);
    } catch (err) {
      console.error('Failed to update form:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async () => {
    if (!form) return;
    try {
      setIsSaving(true);
      const updated = form.status === 'published'
        ? await api.unpublishForm(form.id)
        : await api.publishForm(form.id);
      setForm(updated);
      showToast(updated.status === 'published' ? 'Form published' : 'Form unpublished');
    } catch (err) {
      console.error('Failed to update publication status:', err);
      showToast('Failed to update publication status', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearResponses = async () => {
    if (!form) return;
    if (!confirm('Clear all submitted responses? This cannot be undone.')) return;
    try {
      setIsSaving(true);
      await api.clearResponses(form.id);
      showToast('All responses cleared');
      setActiveDrawer(null);
    } catch (err) {
      console.error('Failed to clear responses:', err);
      showToast('Failed to clear responses', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder Questions
  const handleReorder = async (draggedIndex: number, targetIndex: number) => {
    if (!form) return;
    const reordered = [...questions];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const itemsWithPositions = reordered.map((q, idx) => ({
      ...q,
      position: idx,
    }));

    setForm({ ...form, questions: itemsWithPositions });

    try {
      setIsSaving(true);
      const payload = itemsWithPositions.map((q) => ({ id: q.id, position: q.position }));
      const serverOrdered = await api.reorderQuestions(form.id, payload);
      setForm({ ...form, questions: serverOrdered });
    } catch (err) {
      console.error('Failed to persist question order:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveQuestion = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    await handleReorder(index, targetIndex);
  };

  // Delete Question
  const handleDeleteQuestion = async (id: string) => {
    if (!form) return;
    const remaining = questions.filter((q) => q.id !== id);
    setForm({ ...form, questions: remaining });

    if (selectedQuestionId === id) {
      setSelectedQuestionId(remaining.length > 0 ? remaining[0].id : null);
    }

    try {
      setIsSaving(true);
      await api.deleteQuestion(id);
      showToast('Question deleted');
    } catch (err) {
      console.error('Failed to delete question:', err);
      showToast('Failed to delete question', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  // Duplicate Question
  const handleDuplicateQuestion = async (q: Question) => {
    if (!form) return;
    try {
      setIsSaving(true);
      const duplicated = await api.createQuestion(form.id, {
        type: q.type,
        title: `${q.title} (Copy)`,
        description: q.description,
        required: q.required,
        settings: q.settings,
        choices: q.choices ? q.choices.map((c) => ({ label: c.label })) : [],
        position: questions.length,
      });

      const updatedForm = {
        ...form,
        questions: [...questions, duplicated],
      };
      setForm(updatedForm);
      setSelectedQuestionId(duplicated.id);
      showToast('Question duplicated');
    } catch (err) {
      console.error('Failed to duplicate question:', err);
      showToast('Failed to duplicate question', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Form permanently
  const handleDeleteForm = async () => {
    if (!form) return;
    if (!confirm('Are you absolutely sure? This will delete this form and all responses permanently.')) return;
    try {
      await api.deleteForm(form.id);
      showToast('Form deleted');
      router.push('/');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete form', 'warning');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center font-medium text-sm">
        Loading Nomi Builder...
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-slate-950 text-rose-400 flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-lg font-bold">{error || 'Form not found'}</div>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Fullscreen Respondent Preview Mode
  if (isPreviewMode) {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsPreviewMode(false)}
            aria-label="Exit preview mode"
            className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-bold text-xs shadow-2xl border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Exit Preview Mode</span>
            <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">ESC</span>
          </button>
        </div>
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8">
          {viewportMode === 'mobile' ? (
            <div className="respondent-preview-phone relative overflow-hidden rounded-[32px] border-[10px] border-slate-900 bg-white shadow-2xl">
              <div className="absolute top-0 left-1/2 z-50 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
              <FormPlayer form={form} isPreviewMode={true} previewViewport="mobile" />
            </div>
          ) : (
            <div className="w-full max-w-[1440px] min-h-[720px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <FormPlayer form={form} isPreviewMode={true} previewViewport="desktop" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <BuilderHeader
        form={form}
        activeTab={activeTab}
        isPreviewMode={isPreviewMode}
        isSaving={isSaving}
        onTabChange={(tab) => setActiveTab(tab)}
        onTogglePreview={() => setIsPreviewMode(true)}
        onFormUpdated={(updated) => setForm(updated)}
      />

      {/* Editor Sub-Toolbar */}
      {activeTab === 'create' && (
        <BuilderToolbar
          activeDrawer={activeDrawer}
          viewportMode={viewportMode}
          onToggleDrawer={(drawer) =>
            setActiveDrawer((prev) => (prev === drawer ? null : drawer))
          }
          onChangeViewport={(mode) => setViewportMode(mode)}
          onOpenAddContent={() => setIsAddModalOpen(true)}
          onLaunchPreview={() => setIsPreviewMode(true)}
        />
      )}

      {/* Main Tab Content */}
      {activeTab === 'results' ? (
        <ResultsView form={form} />
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Content Sidebar */}
          <ContentSidebar
            questions={questions}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={(id) => setSelectedQuestionId(id)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onReorder={handleReorder}
            onMoveQuestion={handleMoveQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onDuplicateQuestion={handleDuplicateQuestion}
          />

          {/* Center WYSIWYG Editing Canvas */}
          <CanvasStage
            question={selectedQuestion}
            questionIndex={selectedQuestionIndex >= 0 ? selectedQuestionIndex : 0}
            totalQuestions={questions.length}
            viewportMode={viewportMode}
            theme={form.theme}
            settings={form.settings}
            onUpdateTitle={(title) => handleUpdateQuestion({ title })}
            onUpdateDescription={(description) => handleUpdateQuestion({ description })}
          />

          {/* Right Question Settings Inspector */}
          <QuestionInspector
            question={selectedQuestion}
            onUpdateQuestion={handleUpdateQuestion}
          />

          {/* Utility Drawers */}
          <DesignPanel
            isOpen={activeDrawer === 'design'}
            theme={getEffectiveTheme(form.theme)}
            onClose={() => setActiveDrawer(null)}
            onUpdateTheme={handleUpdateTheme}
          />

          <AccessibilityPanel
            isOpen={activeDrawer === 'accessibility'}
            form={form}
            onClose={() => setActiveDrawer(null)}
          />

          <LanguagePanel
            isOpen={activeDrawer === 'language'}
            language={form.language || 'en'}
            onClose={() => setActiveDrawer(null)}
            onUpdateLanguage={handleUpdateLanguage}
          />

          <FormSettingsPanel
            isOpen={activeDrawer === 'settings'}
            form={form}
            onClose={() => setActiveDrawer(null)}
            onUpdateForm={handleUpdateForm}
            onUpdateSettings={handleUpdateSettings}
            onTogglePublished={handleTogglePublished}
            onDeleteForm={handleDeleteForm}
            onClearResponses={handleClearResponses}
          />
        </div>
      )}

      {/* "+ Add Content" Question Type Picker Modal */}
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectType={handleAddQuestion}
      />
    </div>
  );
}

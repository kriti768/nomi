'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FormSchema, FormResponse, Question } from '@/types/form';
import { api } from '@/lib/api';
import { StatsCards } from './StatsCards';
import { ResponseTable } from './ResponseTable';
import { ResponseDetail } from './ResponseDetail';

interface Props {
  form: FormSchema;
}

export const ResultsView: React.FC<Props> = ({ form }) => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'table'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  const loadResponses = React.useCallback(async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) setIsRefreshing(true);
      else setLoading(true);
      const data = await api.getResponses(form.id);
      setResponses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load responses');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [form.id]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  const questions = form.questions || [];

  // Filter responses by search query across any answer or submission date
  const filteredResponses = useMemo(() => {
    if (!searchQuery.trim()) return responses;
    const qLower = searchQuery.toLowerCase();

    return responses.filter((r) => {
      const dateMatch = new Date(r.submitted_at).toLocaleString().toLowerCase().includes(qLower);
      const answerMatch = (r.answers || []).some((ans) => {
        if (ans.value === undefined || ans.value === null) return false;
        return String(ans.value).toLowerCase().includes(qLower);
      });
      return dateMatch || answerMatch;
    });
  }, [responses, searchQuery]);

  // CSV Export utility
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    // Headers: Response ID, Submitted At, followed by all Question Titles
    const headers = ['Response ID', 'Submitted At', ...questions.map((q) => `"${(q.title || 'Untitled').replace(/"/g, '""')}"`)];

    // Data rows
    const rows = responses.map((r) => {
      const answersMap = (r.answers || []).reduce<Record<string, any>>((acc, a) => {
        acc[a.question_id] = a.value;
        return acc;
      }, {});

      const dateStr = new Date(r.submitted_at).toISOString();
      const questionCols = questions.map((q) => {
        const val = answersMap[q.id];
        if (val === undefined || val === null) return '""';
        const strVal = Array.isArray(val) ? val.join('; ') : String(val);
        return `"${strVal.replace(/"/g, '""')}"`;
      });

      return [r.id || '', `"${dateStr}"`, ...questionCols].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `${form.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_responses.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 font-medium text-sm space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p>Loading analytics from backend database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-rose-500 font-semibold text-sm space-y-3">
        <p>Error loading analytics: {error}</p>
        <button
          onClick={() => loadResponses()}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8 select-none">
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-slate-800/70">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Results & Insights
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time conversational responses for <span className="font-semibold text-slate-700 dark:text-slate-300">{form.title}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Public Link CTA */}
          <a
            href={`/f/${form.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Open respondent view"
          >
            <span>Open live form</span>
            <span className="text-slate-400">↗</span>
          </a>

          {/* Export CSV CTA */}
          <button
            onClick={handleExportCSV}
            disabled={responses.length === 0}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download CSV spreadsheet"
          >
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>Export CSV</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadResponses(true)}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <StatsCards responses={responses} />

      {/* View Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Question Breakdown
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>All Submissions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">
              {responses.length}
            </span>
          </button>
        </div>

        {/* Real-time search filter */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search answers, names, emails..."
            className="w-full text-xs font-medium pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <svg className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: QUESTION-LEVEL BREAKDOWN */}
      {activeTab === 'analytics' && (
        <div className="space-y-4 animate-fadeIn">
          {responses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
                No question responses recorded yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Share your published link to collect answers. Each question type automatically generates tailored charts, ratings distribution, and response feeds.
              </p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">No questions in this form.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {questions.map((q, idx) => {
                const answersForQ = filteredResponses
                  .flatMap((r) => r.answers || [])
                  .filter((a) => a.question_id === q.id && a.value !== undefined && a.value !== null && a.value !== '');

                return (
                  <QuestionInsightCard
                    key={q.id}
                    index={idx}
                    question={q}
                    answers={answersForQ}
                    totalResponses={filteredResponses.length}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBMISSIONS TABLE */}
      {activeTab === 'table' && (
        <div className="space-y-3 animate-fadeIn">
          <ResponseTable
            responses={filteredResponses}
            questions={questions}
            onSelectResponse={(resp) => setSelectedResponse(resp)}
          />
        </div>
      )}

      {/* MODAL DETAIL DRAWER */}
      <ResponseDetail
        response={selectedResponse}
        questions={questions}
        onClose={() => setSelectedResponse(null)}
      />
    </div>
  );
};

// Sub-component for rendering rich question-level stats based on real DB answers
interface QuestionInsightProps {
  index: number;
  question: Question;
  answers: any[];
  totalResponses: number;
}

const QuestionInsightCard: React.FC<QuestionInsightProps> = ({ index, question, answers, totalResponses }) => {
  const stepNum = String(index + 1).padStart(2, '0');
  const count = answers.length;

  // 1. Multiple Choice & Dropdown Analytics
  if (question.type === 'multiple_choice' || question.type === 'dropdown') {
    const choices = question.choices || [];
    const countsMap: Record<string, number> = {};

    answers.forEach((ans) => {
      const val = ans.value;
      if (Array.isArray(val)) {
        val.forEach((item) => {
          countsMap[item] = (countsMap[item] || 0) + 1;
        });
      } else if (val) {
        countsMap[val] = (countsMap[val] || 0) + 1;
      }
    });

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-[11px] font-extrabold uppercase font-mono">
            {stepNum} • {question.type.replace('_', ' ')}
          </span>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {count} / {totalResponses} answered
          </span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug break-words">
          {question.title}
        </h4>

        <div className="space-y-2.5 pt-1">
          {choices.map((c, cIdx) => {
            const optCount = countsMap[c.label] || 0;
            const pct = count > 0 ? Math.round((optCount / count) * 100) : 0;
            return (
              <div key={c.label || cIdx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300 truncate">{c.label}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{pct}% ({optCount})</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Yes / No Analytics
  if (question.type === 'yes_no') {
    const yesCount = answers.filter((a) => a.value === 'Yes').length;
    const noCount = answers.filter((a) => a.value === 'No').length;
    const yesPct = count > 0 ? Math.round((yesCount / count) * 100) : 0;
    const noPct = count > 0 ? Math.round((noCount / count) * 100) : 0;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-400 text-[11px] font-extrabold uppercase font-mono">
            {stepNum} • YES / NO
          </span>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {count} / {totalResponses} answered
          </span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug break-words">
          {question.title}
        </h4>

        <div className="space-y-2.5 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Yes
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{yesPct}% ({yesCount})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${yesPct}%` }} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> No
              </span>
              <span className="text-rose-500 font-mono">{noPct}% ({noCount})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${noPct}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Rating Field Analytics with 5-Star Distribution
  if (question.type === 'rating') {
    const numVals = answers.map((a) => Number(a.value)).filter((n) => !isNaN(n));
    const avg = numVals.length > 0 ? (numVals.reduce((sum, n) => sum + n, 0) / numVals.length).toFixed(1) : '—';
    const maxScale = question.settings?.ratingMax || 5;

    // Distribution across scores 1 to maxScale
    const distMap: Record<number, number> = {};
    for (let i = 1; i <= maxScale; i++) distMap[i] = 0;
    numVals.forEach((val) => {
      const rounded = Math.round(val);
      if (distMap[rounded] !== undefined) distMap[rounded]++;
    });

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 text-[11px] font-extrabold uppercase font-mono">
            {stepNum} • RATING BREAKDOWN
          </span>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {count} / {totalResponses} answered
          </span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug break-words">
          {question.title}
        </h4>

        <div className="flex items-center gap-4 pt-1">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-center shrink-0">
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {avg}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-300 font-extrabold mt-0.5">
              / {maxScale} ★ Score
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            {Array.from({ length: maxScale }, (_, i) => maxScale - i).map((starVal) => {
              const starCount = distMap[starVal] || 0;
              const starPct = count > 0 ? Math.round((starCount / count) * 100) : 0;
              return (
                <div key={starVal} className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="w-6 text-slate-500 font-mono">{starVal}★</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${starPct}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-slate-400 font-mono">{starCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 4. Number Field Analytics
  if (question.type === 'number') {
    const numVals = answers.map((a) => Number(a.value)).filter((n) => !isNaN(n));
    const avg = numVals.length > 0 ? (numVals.reduce((sum, n) => sum + n, 0) / numVals.length).toFixed(1) : '—';
    const min = numVals.length > 0 ? Math.min(...numVals) : '—';
    const max = numVals.length > 0 ? Math.max(...numVals) : '—';
    const sum = numVals.length > 0 ? numVals.reduce((s, n) => s + n, 0) : '—';

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-[11px] font-extrabold uppercase font-mono">
            {stepNum} • NUMBER STATS
          </span>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {count} / {totalResponses} answered
          </span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug break-words">
          {question.title}
        </h4>

        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-extrabold">Average</div>
            <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{avg}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-extrabold">Min</div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono mt-0.5">{min}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-extrabold">Max</div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono mt-0.5">{max}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-extrabold">Total Sum</div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono mt-0.5">{sum}</div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Short Text, Long Text & Email Response Stream
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 text-[11px] font-extrabold uppercase font-mono">
          {stepNum} • {question.type.replace('_', ' ')}
        </span>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {count} / {totalResponses} answered
        </span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug break-words">
        {question.title}
      </h4>

      <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1">
        {count === 0 ? (
          <div className="text-xs text-slate-400 italic py-2">No text answers submitted yet</div>
        ) : (
          answers.slice(0, 4).map((ans, aIdx) => (
            <div
              key={aIdx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-start gap-2"
            >
              <span className="text-indigo-500 dark:text-indigo-400 font-bold shrink-0">“</span>
              <span className="flex-1 break-words">{String(ans.value)}</span>
            </div>
          ))
        )}
        {count > 4 && (
          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 pt-1">
            + {count - 4} more answers (switch to Submissions Table to view all)
          </div>
        )}
      </div>
    </div>
  );
};

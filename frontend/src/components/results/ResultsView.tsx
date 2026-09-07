'use client';

import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  useEffect(() => {
    async function loadResponses() {
      try {
        setLoading(true);
        const data = await api.getResponses(form.id);
        setResponses(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load responses');
      } finally {
        setLoading(false);
      }
    }
    loadResponses();
  }, [form.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400 font-medium text-sm">
        Loading analytics workspace from backend database...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-rose-500 font-semibold text-sm">
        {error}
      </div>
    );
  }

  const questions = form.questions || [];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Results & Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics for <span className="font-semibold text-slate-700 dark:text-slate-300">{form.title}</span>
          </p>
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            const data = await api.getResponses(form.id);
            setResponses(data);
            setLoading(false);
          }}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Metric Cards */}
      <StatsCards responses={responses} />

      {/* QUESTION-LEVEL INSIGHTS SECTION */}
      {responses.length > 0 && questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            QUESTION-LEVEL BREAKDOWN
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q, idx) => {
              const answersForQ = responses
                .flatMap((r) => r.answers || [])
                .filter((a) => a.question_id === q.id && a.value !== undefined && a.value !== null && a.value !== '');

              return (
                <QuestionInsightCard key={q.id} index={idx} question={q} answers={answersForQ} totalResponses={responses.length} />
              );
            })}
          </div>
        </div>
      )}

      {/* SUBMISSIONS TABLE */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          ALL SUBMISSIONS ({responses.length})
        </h3>
        <ResponseTable
          responses={responses}
          questions={questions}
          onSelectResponse={(resp) => setSelectedResponse(resp)}
        />
      </div>

      {/* MODAL DETAIL DRAWER */}
      <ResponseDetail
        response={selectedResponse}
        questions={questions}
        onClose={() => setSelectedResponse(null)}
      />
    </div>
  );
};

// Sub-component for rendering dynamic question-level stats based on real DB answers
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            {stepNum} • {question.type.replace('_', ' ').toUpperCase()}
          </span>
          <span className="text-xs font-semibold text-slate-500">{count} answers</span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{question.title}</h4>

        <div className="space-y-2 pt-1">
          {choices.map((c) => {
            const optCount = countsMap[c.label] || 0;
            const pct = totalResponses > 0 ? Math.round((optCount / totalResponses) * 100) : 0;
            return (
              <div key={c.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300 truncate">{c.label}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{pct}% ({optCount})</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{stepNum} • YES / NO</span>
          <span className="text-xs font-semibold text-slate-500">{count} answers</span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{question.title}</h4>

        <div className="space-y-2 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Yes</span>
              <span className="text-emerald-600 dark:text-emerald-400">{yesPct}% ({yesCount})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${yesPct}%` }} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">No</span>
              <span className="text-rose-500">{noPct}% ({noCount})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${noPct}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Rating Field Analytics
  if (question.type === 'rating') {
    const numVals = answers.map((a) => Number(a.value)).filter((n) => !isNaN(n));
    const avg = numVals.length > 0 ? (numVals.reduce((sum, n) => sum + n, 0) / numVals.length).toFixed(1) : '—';
    const maxScale = question.settings?.ratingMax || 5;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{stepNum} • RATING</span>
          <span className="text-xs font-semibold text-slate-500">{count} answers</span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{question.title}</h4>

        <div className="flex items-center gap-4 pt-2">
          <div className="text-3xl font-extrabold text-amber-500">
            {avg} <span className="text-xs text-slate-400 font-semibold">/ {maxScale} ★</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Average score calculated from real database submissions
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

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{stepNum} • NUMBER STATS</span>
          <span className="text-xs font-semibold text-slate-500">{count} answers</span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{question.title}</h4>

        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Average</div>
            <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{avg}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Min</div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-200">{min}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Max</div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-200">{max}</div>
          </div>
        </div>
      </div>
    );
  }

  // Generic Text / Email field summary
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">{stepNum} • {question.type.replace('_', ' ').toUpperCase()}</span>
        <span className="text-xs font-semibold text-slate-500">{count} responses</span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{question.title}</h4>
      <div className="text-xs text-slate-500 dark:text-slate-400 italic pt-1">
        {count > 0 ? `Latest: "${answers[0]?.value}"` : 'No answers submitted yet'}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Question, QuestionType } from '@/types/form';

interface Props {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onOpenAddModal: () => void;
  onReorder: (draggedIndex: number, targetIndex: number) => void;
  onMoveQuestion: (index: number, direction: 'up' | 'down') => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (question: Question) => void;
}

interface TypeMeta {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: React.ReactNode;
}

const TYPE_CONFIG: Record<QuestionType, TypeMeta> = {
  short_text: {
    label: 'Short Text',
    bgClass: 'bg-sky-50 dark:bg-sky-950/60',
    textClass: 'text-sky-600 dark:text-sky-400',
    borderClass: 'border-sky-200 dark:border-sky-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h10M4 18h7" />
      </svg>
    ),
  },
  long_text: {
    label: 'Long Text',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/60',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h10" />
      </svg>
    ),
  },
  multiple_choice: {
    label: 'Multiple Choice',
    bgClass: 'bg-purple-50 dark:bg-purple-950/60',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-200 dark:border-purple-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  dropdown: {
    label: 'Dropdown',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    ),
  },
  email: {
    label: 'Email',
    bgClass: 'bg-amber-50 dark:bg-amber-950/60',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-200 dark:border-amber-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  number: {
    label: 'Number',
    bgClass: 'bg-rose-50 dark:bg-rose-950/60',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-200 dark:border-rose-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  yes_no: {
    label: 'Yes / No',
    bgClass: 'bg-fuchsia-50 dark:bg-fuchsia-950/60',
    textClass: 'text-fuchsia-600 dark:text-fuchsia-400',
    borderClass: 'border-fuchsia-200 dark:border-fuchsia-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  rating: {
    label: 'Rating',
    bgClass: 'bg-yellow-50 dark:bg-yellow-950/60',
    textClass: 'text-yellow-600 dark:text-yellow-400',
    borderClass: 'border-yellow-200 dark:border-yellow-800',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
};

export const ContentSidebar: React.FC<Props> = ({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onOpenAddModal,
  onReorder,
  onMoveQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <aside className="hidden lg:flex w-[340px] xl:w-[360px] border-r border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70 flex-col h-[calc(100vh-4rem)] shrink-0 select-none">
      {/* Sidebar Section Title */}
      <div className="px-5 py-3.5 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-[12px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Questions & Content</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            {questions.length}
          </span>
        </span>
      </div>

      {/* Questions Sequenced List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {questions.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400 dark:text-slate-600 text-xs font-medium space-y-2">
            <p>No questions yet.</p>
            <p className="text-[11px] text-slate-500">Click &quot;Add content&quot; below to insert your first field.</p>
          </div>
        ) : (
          questions.map((q, index) => {
            const isSelected = q.id === selectedQuestionId;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            const stepNum = String(index + 1).padStart(2, '0');
            const meta = TYPE_CONFIG[q.type] || TYPE_CONFIG.short_text;

            return (
              <div
                key={q.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectQuestion(q.id)}
                className={`group relative flex items-start gap-3 p-3 rounded-xl text-left transition-all border min-h-[72px] ${
                  isDragging
                    ? 'dragging-item opacity-40 bg-slate-200 border-dashed border-indigo-400'
                    : isDragOver
                    ? 'border-t-2 border-t-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : isSelected
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs'
                } cursor-pointer`}
              >
                {/* Drag Handle + Step Index + Type Icon Badge */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <div
                    className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 dark:hover:text-slate-400 text-xs font-mono select-none"
                    title="Drag to reorder"
                  >
                    ⋮⋮
                  </div>
                  <span className="text-[11px] font-extrabold font-mono text-slate-400 group-hover:text-indigo-600">
                    {stepNum}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-lg ${meta.bgClass} ${meta.textClass} border ${meta.borderClass} flex items-center justify-center shadow-2xs`}
                    title={meta.label}
                  >
                    {meta.icon}
                  </span>
                </div>

                {/* Question Info & Subtitle */}
                <div className="flex-1 min-w-0 pr-1">
                  <div
                    className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 break-words"
                    title={q.title || 'Untitled Question'}
                  >
                    {q.title || 'Untitled Question'}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium leading-tight mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>{meta.label}</span>
                    {q.required && (
                      <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-[10px] bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded">
                        • req
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions overlay on hover */}
                <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 dark:bg-slate-800/95 rounded-lg p-0.5 shadow-md border border-slate-200 dark:border-slate-700 z-10">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveQuestion(index, 'up');
                    }}
                    className="w-6 h-6 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded"
                    title="Move up"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 14 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                  </button>
                  <button
                    type="button"
                    disabled={index === questions.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveQuestion(index, 'down');
                    }}
                    className="w-6 h-6 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded"
                    title="Move down"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 10 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateQuestion(q);
                    }}
                    className="w-6 h-6 inline-flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded"
                    title="Duplicate"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2" strokeWidth="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" strokeWidth="2"/></svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuestion(q.id);
                    }}
                    className="w-6 h-6 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeWidth="2.5"/></svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Content Primary Trigger Button */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
        <button
          onClick={onOpenAddModal}
          className="w-full min-h-11 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add content</span>
        </button>
      </div>
    </aside>
  );
};

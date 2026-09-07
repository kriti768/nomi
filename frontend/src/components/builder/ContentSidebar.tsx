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

const TYPE_BADGES: Record<QuestionType, { label: string; icon: string }> = {
  short_text: { label: 'Short text', icon: 'Aa' },
  long_text: { label: 'Long text', icon: '¶' },
  multiple_choice: { label: 'Multiple choice', icon: '◉' },
  dropdown: { label: 'Dropdown', icon: '▼' },
  email: { label: 'Email', icon: '@' },
  number: { label: 'Number', icon: '#' },
  yes_no: { label: 'Yes/No', icon: 'Y/N' },
  rating: { label: 'Rating', icon: '★' },
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
    <aside className="hidden lg:flex w-[288px] border-r border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 flex-col h-[calc(100vh-4rem)] shrink-0 select-none">
      {/* Sidebar Section Title */}
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-[13px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          CONTENT ({questions.length})
        </span>
      </div>

      {/* Questions Sequenced List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {questions.length === 0 ? (
          <div className="text-center py-10 px-3 text-slate-400 dark:text-slate-600 text-xs font-medium">
            No questions yet. Click "+ Add content" to begin.
          </div>
        ) : (
          questions.map((q, index) => {
            const isSelected = q.id === selectedQuestionId;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            const stepNum = String(index + 1).padStart(2, '0');
            const badge = TYPE_BADGES[q.type] || { label: q.type, icon: 'Q' };

            return (
              <div
                key={q.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectQuestion(q.id)}
                className={`group relative flex items-start gap-2.5 px-3 py-3 rounded-lg text-left transition-all border min-h-[68px] ${
                  isDragging
                    ? 'dragging-item opacity-40 bg-slate-200 border-dashed border-indigo-400'
                    : isDragOver
                    ? 'border-t-2 border-t-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold border-l-4 border-l-indigo-600 border-transparent shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                } cursor-pointer`}
              >
                {/* Drag Handle (Visible on hover) */}
                <div
                  className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 text-[18px] leading-none font-mono px-0.5 mt-1 shrink-0"
                  title="Drag to reorder"
                >
                  ::
                </div>

                {/* Step Number */}
                <span className="text-[12px] font-extrabold text-slate-400 group-hover:text-indigo-600 mt-1 shrink-0 w-5">
                  {stepNum}
                </span>

                {/* Type Icon Badge */}
                <span className="w-6 h-6 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-black flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5 shadow-2xs">
                  {badge.icon}
                </span>

                {/* Question Info & Subtitle */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate leading-snug" title={q.title || 'Untitled Question'}>
                    {q.title || 'Untitled Question'}
                  </div>
                  <div className="text-[12px] text-slate-400 font-medium leading-tight mt-1">
                    {badge.label}
                  </div>
                </div>

                {/* Actions overlay on hover */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 rounded px-1 shadow-sm mt-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveQuestion(index, 'up');
                    }}
                    className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 14 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </button>
                  <button
                    type="button"
                    disabled={index === questions.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveQuestion(index, 'down');
                    }}
                    className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 10 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateQuestion(q);
                    }}
                    className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Duplicate"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2" strokeWidth="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" strokeWidth="2"/></svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuestion(q.id);
                    }}
                    className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeWidth="2"/></svg>
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
          className="w-full min-h-11 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
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

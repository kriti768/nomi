'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FormSchema } from '@/types/form';
import { api } from '@/lib/api';
import { FormPlayer } from '@/components/respondent/FormPlayer';

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicForm() {
      try {
        setLoading(true);
        const data = await api.getPublicForm(formId);
        setForm(data);
      } catch (err: any) {
        setError(err.message || 'Form is not available');
      } finally {
        setLoading(false);
      }
    }
    loadPublicForm();
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center font-medium text-sm">
        Loading conversational form...
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl font-black">
            !
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            Form Not Available
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {error || 'This form is currently private or not accepting responses.'}
          </p>
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
            Powered by <span className="text-indigo-400 font-bold">Nomi</span>
          </div>
        </div>
      </div>
    );
  }

  return <FormPlayer form={form} isPreviewMode={false} />;
}

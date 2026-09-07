import { FormSchema, Question, FormResponse } from '@/types/form';

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').trim();
const cleanUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const errData = await res.json();
      errorDetail = errData.detail || errorDetail;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // Forms
  async getForms(): Promise<FormSchema[]> {
    const res = await fetch(`${API_BASE}/forms`, { cache: 'no-store' });
    return handleResponse<FormSchema[]>(res);
  },

  async createForm(data: { title?: string; description?: string } = {}): Promise<FormSchema> {
    const res = await fetch(`${API_BASE}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title || 'Untitled Form',
        description: data.description || '',
      }),
    });
    return handleResponse<FormSchema>(res);
  },

  async getForm(id: string): Promise<FormSchema> {
    const res = await fetch(`${API_BASE}/forms/${id}`, { cache: 'no-store' });
    return handleResponse<FormSchema>(res);
  },

  async updateForm(id: string, data: Partial<FormSchema>): Promise<FormSchema> {
    const res = await fetch(`${API_BASE}/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<FormSchema>(res);
  },

  async duplicateForm(id: string): Promise<FormSchema> {
    const res = await fetch(`${API_BASE}/forms/${id}/duplicate`, {
      method: 'POST',
    });
    return handleResponse<FormSchema>(res);
  },

  async publishForm(id: string): Promise<FormSchema> {
    const res = await fetch(`${API_BASE}/forms/${id}/publish`, {
      method: 'POST',
    });
    return handleResponse<FormSchema>(res);
  },

  async unpublishForm(id: string): Promise<FormSchema> {
    const res = await fetch(`${API_BASE}/forms/${id}/unpublish`, {
      method: 'POST',
    });
    return handleResponse<FormSchema>(res);
  },

  async deleteForm(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/forms/${id}`, {
      method: 'DELETE',
    });
    await handleResponse<{ message: string }>(res);
  },

  // Questions
  async createQuestion(formId: string, question: Partial<Question>): Promise<Question> {
    const res = await fetch(`${API_BASE}/forms/${formId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    return handleResponse<Question>(res);
  },

  async updateQuestion(questionId: string, data: Partial<Question>): Promise<Question> {
    const res = await fetch(`${API_BASE}/questions/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Question>(res);
  },

  async reorderQuestions(formId: string, items: { id: string; position: number }[]): Promise<Question[]> {
    const res = await fetch(`${API_BASE}/forms/${formId}/questions/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    return handleResponse<Question[]>(res);
  },

  async deleteQuestion(questionId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/questions/${questionId}`, {
      method: 'DELETE',
    });
    await handleResponse<{ message: string }>(res);
  },

  // Public Respondent & Responses
  async getPublicForm(formId: string): Promise<FormSchema> {
    const res = await fetch(`${API_BASE}/forms/${formId}/public`, { cache: 'no-store' });
    return handleResponse<FormSchema>(res);
  },

  async submitResponse(formId: string, answers: { question_id: string; value: unknown }[]): Promise<FormResponse> {
    const res = await fetch(`${API_BASE}/forms/${formId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    return handleResponse<FormResponse>(res);
  },

  async getResponses(formId: string): Promise<FormResponse[]> {
    const res = await fetch(`${API_BASE}/forms/${formId}/responses`, { cache: 'no-store' });
    return handleResponse<FormResponse[]>(res);
  },

  async clearResponses(formId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/forms/${formId}/responses`, {
      method: 'DELETE',
    });
    await handleResponse<{ message: string }>(res);
  },
};


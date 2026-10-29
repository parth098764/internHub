import { User, Internship, Application, SavedInternship, AdminStats } from '../types/index.ts';

const TOKEN_KEY = 'internhub_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    register: async (payload: {
      name: string;
      email: string;
      password: string;
      role: 'student' | 'company';
      college?: string;
      course?: string;
      skills?: string[];
      companyName?: string;
      industry?: string;
      description?: string;
    }): Promise<{ token: string; user: User }> => {
      const res = await request<{ token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setStoredToken(res.token);
      return res;
    },

    login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
      const res = await request<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setStoredToken(res.token);
      return res;
    },

    me: async (): Promise<{ user: User }> => {
      return request<{ user: User }>('/api/auth/me');
    },

    logout: (): void => {
      removeStoredToken();
    },
  },

  // Internships
  internships: {
    list: async (params?: {
      q?: string;
      category?: string;
      workMode?: string;
      paid?: boolean;
      location?: string;
      sort?: string;
    }): Promise<{ internships: Internship[]; total: number }> => {
      const query = new URLSearchParams();
      if (params?.q) query.set('q', params.q);
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.workMode && params.workMode !== 'All') query.set('workMode', params.workMode);
      if (params?.paid !== undefined) query.set('paid', String(params.paid));
      if (params?.location) query.set('location', params.location);
      if (params?.sort) query.set('sort', params.sort);

      const qs = query.toString();
      return request<{ internships: Internship[]; total: number }>(`/api/internships${qs ? `?${qs}` : ''}`);
    },

    get: async (id: string): Promise<{ internship: Internship }> => {
      return request<{ internship: Internship }>(`/api/internships/${id}`);
    },

    create: async (payload: Partial<Internship>): Promise<{ internship: Internship }> => {
      return request<{ internship: Internship }>('/api/internships', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    update: async (id: string, payload: Partial<Internship>): Promise<{ internship: Internship }> => {
      return request<{ internship: Internship }>(`/api/internships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      return request<{ success: boolean }>(`/api/internships/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Applications
  applications: {
    list: async (): Promise<{ applications: Application[]; total: number }> => {
      return request<{ applications: Application[]; total: number }>('/api/applications');
    },

    submit: async (payload: {
      internshipId: string;
      coverLetter: string;
      resumeUrl: string;
    }): Promise<{ application: Application }> => {
      return request<{ application: Application }>('/api/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    updateStatus: async (
      id: string,
      status: string,
      statusNotes?: string
    ): Promise<{ application: Application }> => {
      return request<{ application: Application }>(`/api/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, statusNotes }),
      });
    },
  },

  // Saved Internships
  saved: {
    list: async (): Promise<{ savedIds: string[]; total: number }> => {
      return request<{ savedIds: string[]; total: number }>('/api/saved-internships');
    },

    toggle: async (internshipId: string): Promise<{ isSaved: boolean; internshipId: string }> => {
      return request<{ isSaved: boolean; internshipId: string }>('/api/saved-internships/toggle', {
        method: 'POST',
        body: JSON.stringify({ internshipId }),
      });
    },
  },

  // Admin
  admin: {
    stats: async (): Promise<AdminStats> => {
      return request<AdminStats>('/api/admin/stats');
    },

    users: async (): Promise<{ users: User[]; total: number }> => {
      return request<{ users: User[]; total: number }>('/api/admin/users');
    },

    deleteUser: async (id: string): Promise<{ success: boolean }> => {
      return request<{ success: boolean }>(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Seed Reset
  seed: {
    reset: async (): Promise<{ success: boolean; message: string }> => {
      return request<{ success: boolean; message: string }>('/api/seed/reset', {
        method: 'POST',
      });
    },
  },
};

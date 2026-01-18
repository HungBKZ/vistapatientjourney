const API_BASE = import.meta.env.VITE_API_URL || 'https://vistapatientjourney-production.up.railway.app/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
  }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request('/auth/me'),

  // Doctors
  getDoctors: (params?: { specialization?: string; active?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.specialization) searchParams.set('specialization', params.specialization);
    if (params?.active !== undefined) searchParams.set('active', String(params.active));
    return request(`/doctors?${searchParams}`);
  },

  getDoctor: (id: number) => request(`/doctors/${id}`),

  getDoctorSlots: (id: number, date?: string) => {
    const searchParams = date ? `?date=${date}` : '';
    return request(`/doctors/${id}/slots${searchParams}`);
  },

  // Services
  getServices: (active?: boolean) => {
    const searchParams = active !== undefined ? `?active=${active}` : '';
    return request(`/services${searchParams}`);
  },

  getService: (idOrSlug: string | number) => request(`/services/${idOrSlug}`),

  // Appointments
  createAppointment: (data: {
    doctor_id: number;
    service_id: number;
    time_slot_id?: number;
    appointment_date: string;
    appointment_time: string;
    symptoms?: string;
    notes?: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
  }) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyAppointments: (status?: string) => {
    const searchParams = status ? `?status=${status}` : '';
    return request(`/appointments/my${searchParams}`);
  },

  cancelAppointment: (id: number) =>
    request(`/appointments/${id}/cancel`, { method: 'PUT' }),

  // Articles
  getArticles: (params?: { category?: string; limit?: number; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.page) searchParams.set('page', String(params.page));
    return request(`/articles?${searchParams}`);
  },

  getArticle: (slug: string) => request(`/articles/${slug}`),

  // Quiz
  getQuizQuestions: (params?: { category?: string; difficulty?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    return request(`/quiz/questions?${searchParams}`);
  },

  checkQuizAnswers: (answers: { questionId: number; answer: string }[]) =>
    request('/quiz/check', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  // Contact
  sendContact: (data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Podcasts
  getPodcasts: (params?: { category?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    return request(`/podcasts?${searchParams}`);
  },

  getPodcast: (slug: string) => request(`/podcasts/${slug}`),

  // Eye Care Tips
  getTips: (category?: string) => {
    const searchParams = category ? `?category=${category}` : '';
    return request(`/tips${searchParams}`);
  },
};

export default api;

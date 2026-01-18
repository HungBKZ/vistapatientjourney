export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Doctor {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience_years: number;
  bio?: string;
  avatar_url?: string;
  consultation_fee: number;
  is_active: boolean;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  duration_minutes: number;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
}

export interface TimeSlot {
  id: number;
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Appointment {
  id: number;
  user_id: number;
  doctor_id: number;
  service_id: number;
  time_slot_id?: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms?: string;
  notes?: string;
  total_price: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  doctor_name?: string;
  service_name?: string;
  specialization?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  category?: string;
  thumbnail_url?: string;
  author_name?: string;
  view_count: number;
  published_at: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

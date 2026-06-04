export type ContactStatus = 'lead' | 'active' | 'inactive';

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  status: ContactStatus;
  notes?: string;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export type InteractionType = 'call' | 'email' | 'meeting' | 'other';

export interface Interaction {
  id: string;
  contact_id: string;
  user_id: string;
  type: InteractionType;
  description: string;
  notes?: string;
  date: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  contact_id: string;
  user_id: string;
  title: string;
  due_date: string;
  completed: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalContacts: number;
  upcomingFollowUps: number;
  overdueFollowUps: number;
  recentInteractions: number;
}

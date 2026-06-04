export type ContactStatus = 'lead' | 'active' | 'inactive';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  status: ContactStatus;
  notes?: string;
  lastContactedAt?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export type InteractionType = 'call' | 'email' | 'meeting' | 'other';

export interface Interaction {
  id: string;
  contactId: string;
  type: InteractionType;
  description: string;
  date: string; // ISO date string
  notes?: string;
}

export interface Reminder {
  id: string;
  contactId: string;
  title: string;
  dueDate: string; // ISO date string
  completed: boolean;
}

export interface DashboardStats {
  totalContacts: number;
  upcomingFollowUps: number;
  overdueFollowUps: number;
  recentInteractions: number;
}

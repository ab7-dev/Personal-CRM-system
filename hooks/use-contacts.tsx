'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact, Interaction, Reminder, DashboardStats } from '@/types';

interface CRMContextType {
  contacts: Contact[];
  interactions: Interaction[];
  reminders: Reminder[];
  addContact: (contact: Omit<Contact, "id" | "created_at" | "updated_at" | "user_id">) => void;
  updateContact: (id: string, contact: Partial<Omit<Contact, "id" | "created_at" | "updated_at" | "user_id">>) => void;
  deleteContact: (id: string) => void;
  addInteraction: (interaction: Omit<Interaction, 'id' | 'user_id' | 'created_at'>) => void;
  deleteInteraction: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed' | 'user_id' | 'created_at'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  stats: DashboardStats;
  loading: boolean;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    user_id: 'local',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.io',
    phone: '+1 (555) 019-2831',
    company: 'Cyberdyne Systems',
    role: 'Lead Architect',
    status: 'active',
    notes: 'Key contact for the automated data scraping integration. Interested in scaling up APIs.',
    last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    user_id: 'local',
    name: 'Alex Rivera',
    email: 'alex@linear.app',
    phone: '+1 (555) 234-5678',
    company: 'Linear',
    role: 'Product Designer',
    status: 'active',
    notes: 'Met at Design Systems Conference. Discussed Attio-like layouts and micro-interactions.',
    last_contacted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3',
    user_id: 'local',
    name: 'Emma Watson',
    email: 'emma@attio.com',
    phone: '+44 20 7946 0958',
    company: 'Attio',
    role: 'Growth Lead',
    status: 'lead',
    notes: 'Potential advisor for personal relationship CRM. Follow up in June.',
    last_contacted_at: undefined,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c4',
    user_id: 'local',
    name: 'John Doe',
    email: 'john.doe@acme.org',
    phone: '+1 (555) 987-6543',
    company: 'Acme Corp',
    role: 'VP Sales',
    status: 'inactive',
    notes: 'Account on hold due to budget restrictions. Re-engage in Q4.',
    last_contacted_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_INTERACTIONS: Interaction[] = [
  {
    id: 'i1',
    contact_id: 'c1',
    user_id: 'local',
    type: 'meeting',
    description: 'Detailed API migration strategy session.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Agreed to test the new Node SDK. Showed deep interest in parallel scraping options.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'i2',
    contact_id: 'c2',
    user_id: 'local',
    type: 'email',
    description: 'Sent follow-up on dashboard layout aesthetics.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Shared screenshots of the Firecrawl-inspired dashboard. He loved the minimal grid lines.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'i3',
    contact_id: 'c4',
    user_id: 'local',
    type: 'call',
    description: 'Quarterly review call regarding sales pipelines.',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    contact_id: 'c1',
    user_id: 'local',
    title: 'Send updated pricing sheet for Cyberdyne scaling',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r2',
    contact_id: 'c3',
    user_id: 'local',
    title: 'Introductory call with Emma Watson',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r3',
    contact_id: 'c2',
    user_id: 'local',
    title: 'Ask for feedback on design prototype',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r4',
    contact_id: 'c1',
    user_id: 'local',
    title: 'Set up playground credentials',
    due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed: true,
    created_at: new Date().toISOString(),
  },
];

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const localContacts = localStorage.getItem('crm_contacts');
      const localInteractions = localStorage.getItem('crm_interactions');
      const localReminders = localStorage.getItem('crm_reminders');

      if (localContacts) setContacts(JSON.parse(localContacts));
      else {
        setContacts(MOCK_CONTACTS);
        localStorage.setItem('crm_contacts', JSON.stringify(MOCK_CONTACTS));
      }

      if (localInteractions) setInteractions(JSON.parse(localInteractions));
      else {
        setInteractions(MOCK_INTERACTIONS);
        localStorage.setItem('crm_interactions', JSON.stringify(MOCK_INTERACTIONS));
      }

      if (localReminders) setReminders(JSON.parse(localReminders));
      else {
        setReminders(MOCK_REMINDERS);
        localStorage.setItem('crm_reminders', JSON.stringify(MOCK_REMINDERS));
      }
    } catch (e) {
      console.error('Failed to load CRM data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  const saveContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem('crm_contacts', JSON.stringify(updated));
  };

  const saveInteractions = (updated: Interaction[]) => {
    setInteractions(updated);
    localStorage.setItem('crm_interactions', JSON.stringify(updated));
  };

  const saveReminders = (updated: Reminder[]) => {
    setReminders(updated);
    localStorage.setItem('crm_reminders', JSON.stringify(updated));
  };

  const addContact = (contactInput: Omit<Contact, "id" | "created_at" | "updated_at" | "user_id">) => {
    const newContact: Contact = {
      ...contactInput,
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      user_id: 'local',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveContacts([newContact, ...contacts]);
  };

  const updateContact = (id: string, contactInput: Partial<Omit<Contact, "id" | "created_at" | "updated_at" | "user_id">>) => {
    const updated = contacts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...contactInput,
          updated_at: new Date().toISOString(),
        };
      }
      return c;
    });
    saveContacts(updated);
  };

  const deleteContact = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id));
    // Cascade delete interactions & reminders
    saveInteractions(interactions.filter(i => i.contact_id !== id));
    saveReminders(reminders.filter(r => r.contact_id !== id));
  };

  const addInteraction = (interactionInput: Omit<Interaction, 'id' | 'user_id' | 'created_at'>) => {
    const newInteraction: Interaction = {
      ...interactionInput,
      id: 'i_' + Math.random().toString(36).substr(2, 9),
      user_id: 'local',
      created_at: new Date().toISOString(),
    };
    saveInteractions([newInteraction, ...interactions]);

    // Update the contact last_contacted_at field
    updateContact(interactionInput.contact_id, {
      last_contacted_at: interactionInput.date,
    });
  };

  const deleteInteraction = (id: string) => {
    saveInteractions(interactions.filter(i => i.id !== id));
  };

  const addReminder = (reminderInput: Omit<Reminder, 'id' | 'completed' | 'user_id' | 'created_at'>) => {
    const newReminder: Reminder = {
      ...reminderInput,
      id: 'r_' + Math.random().toString(36).substr(2, 9),
      user_id: 'local',
      created_at: new Date().toISOString(),
      completed: false,
    };
    saveReminders([newReminder, ...reminders]);
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    saveReminders(updated);
  };

  const deleteReminder = (id: string) => {
    saveReminders(reminders.filter(r => r.id !== id));
  };

  // Derive dashboard statistics
  const now = new Date();
  const stats: DashboardStats = {
    totalContacts: contacts.length,
    upcomingFollowUps: reminders.filter(r => !r.completed && new Date(r.due_date) >= now).length,
    overdueFollowUps: reminders.filter(r => !r.completed && new Date(r.due_date) < now).length,
    recentInteractions: interactions.filter(i => {
      const diffTime = Math.abs(now.getTime() - new Date(i.date).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
  };

  return (
    <CRMContext.Provider value={{
      contacts,
      interactions,
      reminders,
      addContact,
      updateContact,
      deleteContact,
      addInteraction,
      deleteInteraction,
      addReminder,
      toggleReminder,
      deleteReminder,
      stats,
      loading,
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}

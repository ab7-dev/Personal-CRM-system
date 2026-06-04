'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact, Interaction, Reminder, DashboardStats } from '@/types';

interface CRMContextType {
  contacts: Contact[];
  interactions: Interaction[];
  reminders: Reminder[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, contact: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteContact: (id: string) => void;
  addInteraction: (interaction: Omit<Interaction, 'id'>) => void;
  deleteInteraction: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  stats: DashboardStats;
  loading: boolean;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.io',
    phone: '+1 (555) 019-2831',
    company: 'Cyberdyne Systems',
    role: 'Lead Architect',
    status: 'active',
    notes: 'Key contact for the automated data scraping integration. Interested in scaling up APIs.',
    lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    name: 'Alex Rivera',
    email: 'alex@linear.app',
    phone: '+1 (555) 234-5678',
    company: 'Linear',
    role: 'Product Designer',
    status: 'active',
    notes: 'Met at Design Systems Conference. Discussed Attio-like layouts and micro-interactions.',
    lastContactedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3',
    name: 'Emma Watson',
    email: 'emma@attio.com',
    phone: '+44 20 7946 0958',
    company: 'Attio',
    role: 'Growth Lead',
    status: 'lead',
    notes: 'Potential advisor for personal relationship CRM. Follow up in June.',
    lastContactedAt: undefined,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c4',
    name: 'John Doe',
    email: 'john.doe@acme.org',
    phone: '+1 (555) 987-6543',
    company: 'Acme Corp',
    role: 'VP Sales',
    status: 'inactive',
    notes: 'Account on hold due to budget restrictions. Re-engage in Q4.',
    lastContactedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_INTERACTIONS: Interaction[] = [
  {
    id: 'i1',
    contactId: 'c1',
    type: 'meeting',
    description: 'Detailed API migration strategy session.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Agreed to test the new Node SDK. Showed deep interest in parallel scraping options.',
  },
  {
    id: 'i2',
    contactId: 'c2',
    type: 'email',
    description: 'Sent follow-up on dashboard layout aesthetics.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Shared screenshots of the Firecrawl-inspired dashboard. He loved the minimal grid lines.',
  },
  {
    id: 'i3',
    contactId: 'c4',
    type: 'call',
    description: 'Quarterly review call regarding sales pipelines.',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    contactId: 'c1',
    title: 'Send updated pricing sheet for Cyberdyne scaling',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days in future
    completed: false,
  },
  {
    id: 'r2',
    contactId: 'c3',
    title: 'Introductory call with Emma Watson',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days in future
    completed: false,
  },
  {
    id: 'r3',
    contactId: 'c2',
    title: 'Ask for feedback on design prototype',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day overdue
    completed: false,
  },
  {
    id: 'r4',
    contactId: 'c1',
    title: 'Set up playground credentials',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // completed
    completed: true,
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

  const addContact = (contactInput: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: Contact = {
      ...contactInput,
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveContacts([newContact, ...contacts]);
  };

  const updateContact = (id: string, contactInput: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updated = contacts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...contactInput,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    saveContacts(updated);
  };

  const deleteContact = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id));
    // Cascade delete interactions & reminders
    saveInteractions(interactions.filter(i => i.contactId !== id));
    saveReminders(reminders.filter(r => r.contactId !== id));
  };

  const addInteraction = (interactionInput: Omit<Interaction, 'id'>) => {
    const newInteraction: Interaction = {
      ...interactionInput,
      id: 'i_' + Math.random().toString(36).substr(2, 9),
    };
    saveInteractions([newInteraction, ...interactions]);

    // Update the contact lastContactedAt field
    updateContact(interactionInput.contactId, {
      lastContactedAt: interactionInput.date,
    });
  };

  const deleteInteraction = (id: string) => {
    saveInteractions(interactions.filter(i => i.id !== id));
  };

  const addReminder = (reminderInput: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminder: Reminder = {
      ...reminderInput,
      id: 'r_' + Math.random().toString(36).substr(2, 9),
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
    upcomingFollowUps: reminders.filter(r => !r.completed && new Date(r.dueDate) >= now).length,
    overdueFollowUps: reminders.filter(r => !r.completed && new Date(r.dueDate) < now).length,
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

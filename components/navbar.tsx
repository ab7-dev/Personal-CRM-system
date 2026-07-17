'use client';

import React from 'react';
import { Bell, HelpCircle, Plus, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { Reminder, Contact } from '@/types';

interface NavbarProps {
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface DueReminder extends Reminder {
  contactName?: string;
}

export default function Navbar({ title, actionButton }: NavbarProps) {
  const [dueReminders, setDueReminders] = React.useState<DueReminder[]>([]);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const loadDueReminders = React.useCallback(async () => {
    const supabase = createClient();
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const [{ data: reminders }, { data: contacts }] = await Promise.all([
      supabase
        .from('reminders')
        .select('*')
        .eq('completed', false)
        .lte('due_date', threeDaysFromNow)
        .order('due_date', { ascending: true })
        .limit(8),
      supabase.from('contacts').select('id, name'),
    ]);

    const contactMap = new Map((contacts as Pick<Contact, 'id' | 'name'>[] || []).map(c => [c.id, c.name]));
    const withNames: DueReminder[] = ((reminders as Reminder[]) || []).map(r => ({
      ...r,
      contactName: contactMap.get(r.contact_id),
    }));
    setDueReminders(withNames);
  }, []);

  React.useEffect(() => {
    loadDueReminders();
    // Re-check periodically in case reminders shift into the "due soon" window while the tab is open
    const interval = setInterval(loadDueReminders, 60_000);
    return () => clearInterval(interval);
  }, [loadDueReminders]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const overdueCount = dueReminders.filter(r => new Date(r.due_date) < new Date()).length;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      {/* Page Title & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">CRM</span>
        <span className="text-xs text-slate-300">/</span>
        <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Help, Notifications */}
        <div className="flex items-center gap-2">
          {/* Notifications bell */}
          <div className="relative" ref={containerRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="btn-press p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 relative"
            >
              <Bell className="w-4 h-4" />
              {dueReminders.length > 0 && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${overdueCount > 0 ? 'bg-red-500' : 'bg-purple-600'}`} />
              )}
            </button>

            {notifOpen && (
              <div className="animate-dropdown-in absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-30">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Reminders due soon</span>
                  {dueReminders.length > 0 && (
                    <span className="text-[10px] font-semibold text-slate-400">{dueReminders.length}</span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {dueReminders.length === 0 ? (
                    <div className="py-8 px-4 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-slate-300" />
                      <span>Nothing due in the next 3 days.</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {dueReminders.map(reminder => {
                        const isOverdue = new Date(reminder.due_date) < new Date();
                        return (
                          <Link
                            key={reminder.id}
                            href={`/contacts/${reminder.contact_id}`}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start gap-2.5 px-4 py-3 hover:bg-slate-50 transition"
                          >
                            <Clock className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isOverdue ? 'text-red-500' : 'text-purple-500'}`} />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-900 truncate">{reminder.title}</p>
                              <p className={`text-[10px] mt-0.5 ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
                                {isOverdue ? 'Overdue' : 'Due'}: {formatDate(reminder.due_date)}
                                {reminder.contactName ? ` · ${reminder.contactName}` : ''}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
                <Link
                  href="/dashboard?tab=reminders"
                  onClick={() => setNotifOpen(false)}
                  className="block text-center text-[11px] font-semibold text-purple-600 hover:text-purple-700 py-2.5 border-t border-slate-100 bg-slate-50/50"
                >
                  View all reminders
                </Link>
              </div>
            )}
          </div>
          
          <Link 
            href="#" 
            className="btn-press flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md font-medium border border-transparent"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-slate-200" />

        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="btn-press flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md shadow-sm shadow-purple-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{actionButton.label}</span>
          </button>
        )}
      </div>
    </header>
  );
}

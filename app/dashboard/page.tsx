'use client';

import React from 'react';
import { useCRM } from '@/hooks/use-contacts';
import Navbar from '@/components/navbar';
import DashboardCards from '@/components/dashboard-cards';
import ContactForm from '@/components/contact-form';
import { formatDate } from '@/lib/utils';
import { 
  Calendar, 
  MessageSquare, 
  Square, 
  Clock, 
  ArrowRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { ContactFormValues } from '@/validations';

export default function DashboardPage() {
  const { 
    contacts, 
    interactions, 
    reminders, 
    stats, 
    toggleReminder, 
    addContact 
  } = useCRM();

  const [contactFormOpen, setContactFormOpen] = React.useState(false);

  // Filter reminders
  const now = new Date();
  const activeReminders = reminders.filter(r => !r.completed);
  
  const upcomingReminders = activeReminders
    .filter(r => new Date(r.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const overdueReminders = activeReminders
    .filter(r => new Date(r.dueDate) < now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Recent interactions
  const sortedInteractions = [...interactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleContactSubmit = (data: ContactFormValues) => {
    addContact(data);
    setContactFormOpen(false);
  };

  return (
    <div className="flex-1 pb-10">
      {/* Top Navbar */}
      <Navbar 
        title="Dashboard" 
        actionButton={{
          label: 'Add Contact',
          onClick: () => setContactFormOpen(true),
        }}
      />

      {/* Main Grid View */}
      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp className="w-48 h-48 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Welcome back, Alex!</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Here is an overview of your personal network. You have {stats.upcomingFollowUps} upcoming follow-ups scheduled for this week.
            </p>
          </div>
          <button 
            onClick={() => setContactFormOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-purple-700 bg-white hover:bg-purple-50 rounded-lg transition self-start md:self-center"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Dashboard Statistics Grid */}
        <DashboardCards stats={stats} />

        {/* Reminders & Timeline Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Reminders Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overdue Reminders Alert Banner */}
            {overdueReminders.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600 animate-pulse" />
                  <span>Action Required: {overdueReminders.length} Overdue Follow-Ups</span>
                </h3>
                <div className="mt-3 space-y-2.5">
                  {overdueReminders.map((reminder) => {
                    const contact = contacts.find(c => c.id === reminder.contactId);
                    return (
                      <div 
                        key={reminder.id}
                        className="flex items-center justify-between p-3 bg-white border border-red-100 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleReminder(reminder.id)}
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                          <div>
                            <span className="text-xs font-semibold text-slate-900">{reminder.title}</span>
                            <p className="text-[10px] text-red-600 mt-0.5 font-medium">
                              Due: {formatDate(reminder.dueDate)}
                            </p>
                          </div>
                        </div>
                        {contact && (
                          <Link 
                            href={`/contacts/${contact.id}`}
                            className="text-[10px] font-semibold text-purple-600 hover:text-purple-700"
                          >
                            {contact.name}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upcoming Reminders Checklist */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upcoming Reminders</h3>
                  <p className="text-[11px] text-slate-400">Scheduled follow-up checklist tasks</p>
                </div>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>

              {upcomingReminders.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                  No upcoming follow-up reminders.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingReminders.map((reminder) => {
                    const contact = contacts.find(c => c.id === reminder.contactId);
                    return (
                      <div key={reminder.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                        <div className="flex items-start gap-3 min-w-0">
                          <button 
                            onClick={() => toggleReminder(reminder.id)}
                            className="text-slate-400 hover:text-purple-600 transition mt-0.5 shrink-0"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-slate-900 leading-snug break-words">
                              {reminder.title}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Due: {formatDate(reminder.dueDate)}
                            </p>
                          </div>
                        </div>
                        {contact && (
                          <Link 
                            href={`/contacts/${contact.id}`}
                            className="text-[10px] font-semibold text-purple-600 hover:bg-purple-50 hover:text-purple-700 px-2 py-1 rounded shrink-0 transition ml-4"
                          >
                            {contact.name}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Recent Interactions Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Interactions</h3>
                <p className="text-[11px] text-slate-400">Your latest contact logs</p>
              </div>
              <MessageSquare className="w-4 h-4 text-slate-400" />
            </div>

            {sortedInteractions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 my-auto">
                No recent interactions logged.
              </div>
            ) : (
              <div className="relative border-l border-slate-100 pl-4 space-y-6 my-auto py-2">
                {sortedInteractions.map((int) => {
                  const contact = contacts.find(c => c.id === int.contactId);

                  return (
                    <div key={int.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white" />
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {int.type}
                          </span>
                          <span className="text-[10px] text-slate-400">{formatDate(int.date)}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {int.description}
                        </p>
                        {contact && (
                          <Link 
                            href={`/contacts/${contact.id}`}
                            className="inline-block text-[10px] font-bold text-slate-500 hover:text-purple-600 hover:underline"
                          >
                            with {contact.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-slate-100 pt-4 mt-auto">
              <Link 
                href="/contacts"
                className="flex items-center justify-center gap-1 w-full text-xs font-semibold text-slate-600 hover:text-purple-600 transition"
              >
                <span>Manage Contacts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </main>

      {/* Add Contact Modal Dialog */}
      <ContactForm 
        isOpen={contactFormOpen}
        onClose={() => setContactFormOpen(false)}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
}

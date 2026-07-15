'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/navbar';
import DashboardCards from '@/components/dashboard-cards';
import ContactForm from '@/components/contact-form';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  MessageSquare,
  Square,
  CheckSquare,
  Clock,
  ArrowRight,
  TrendingUp,
  UserPlus,
  History,
  Mail,
  User,
  ShieldCheck,
  Database,
  LogOut,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { ContactFormValues } from '@/validations';
import type { Contact, Interaction, Reminder, DashboardStats } from '@/types';
import { signOut } from '@/actions/auth';

export default function DashboardPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab]       = React.useState<'overview' | 'activity' | 'settings'>('overview');
  const [contacts, setContacts]         = React.useState<Contact[]>([]);
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const [allInteractions, setAllInteractions] = React.useState<Interaction[]>([]);
  const [reminders, setReminders]       = React.useState<Reminder[]>([]);
  const [stats, setStats]               = React.useState<DashboardStats>({ totalContacts: 0, upcomingFollowUps: 0, overdueFollowUps: 0, recentInteractions: 0 });
  const [userName, setUserName]         = React.useState('');
  const [userEmail, setUserEmail]       = React.useState('');
  const [userFullName, setUserFullName] = React.useState('');
  const [userJoined, setUserJoined]     = React.useState('');
  const [loading, setLoading]           = React.useState(true);
  const [contactFormOpen, setContactFormOpen] = React.useState(false);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#activity') {
        setActiveTab('activity');
      } else if (hash === '#settings') {
        setActiveTab('settings');
      } else {
        setActiveTab('overview');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    loadAll();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  async function loadAll() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserName(user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there');
      setUserFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      setUserEmail(user.email || '');
      setUserJoined(user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '');
    }

    const now = new Date().toISOString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { data: contactsData },
      { data: interactionsData },
      { data: allInteractionsData },
      { data: remindersData },
      { count: totalContacts },
      { count: upcoming },
      { count: overdue },
      { count: recentInt },
    ] = await Promise.all([
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      supabase.from('interactions').select('*').order('date', { ascending: false }).limit(5),
      supabase.from('interactions').select('*').order('date', { ascending: false }),
      supabase.from('reminders').select('*').eq('completed', false).order('due_date', { ascending: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('completed', false).gte('due_date', now),
      supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('completed', false).lt('due_date', now),
      supabase.from('interactions').select('*', { count: 'exact', head: true }).gte('date', weekAgo),
    ]);

    setContacts((contactsData as Contact[]) || []);
    setInteractions((interactionsData as Interaction[]) || []);
    setAllInteractions((allInteractionsData as Interaction[]) || []);
    setReminders((remindersData as Reminder[]) || []);
    setStats({
      totalContacts: totalContacts ?? 0,
      upcomingFollowUps: upcoming ?? 0,
      overdueFollowUps: overdue ?? 0,
      recentInteractions: recentInt ?? 0,
    });
    setLoading(false);
  }

  async function toggleReminder(id: string, currentCompleted: boolean) {
    await supabase.from('reminders').update({ completed: !currentCompleted }).eq('id', id);
    setReminders(prev => prev.filter(r => r.id !== id));
    await loadAll();
  }

  async function handleContactSubmit(data: ContactFormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('contacts').insert({ ...data, user_id: user.id });
    setContactFormOpen(false);
    await loadAll();
  }

  async function handleDeleteInteraction(id: string) {
    await supabase.from('interactions').delete().eq('id', id);
    await loadAll();
  }

  const now = new Date();
  const overdueReminders  = reminders.filter(r => new Date(r.due_date) < now).slice(0, 5);
  const upcomingReminders = reminders.filter(r => new Date(r.due_date) >= now).slice(0, 5);

  return (
    <div className="flex-1 pb-10">
      <Navbar
        title={activeTab === 'overview' ? 'Dashboard' : activeTab === 'activity' ? 'Activity Logs' : 'Settings'}
        actionButton={activeTab === 'overview' ? { label: 'Add Contact', onClick: () => setContactFormOpen(true) } : undefined}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading details...</div>
        ) : (
          <>
            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <TrendingUp className="w-48 h-48 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Welcome back, {userName}!</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      Here is an overview of your personal network. You have {stats.upcomingFollowUps} upcoming follow-ups scheduled.
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

                {/* Stats */}
                <DashboardCards stats={stats} />

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Reminders Panel */}
                  <div className="lg:col-span-2 space-y-6">
                    {overdueReminders.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-600 animate-pulse" />
                          Action Required: {overdueReminders.length} Overdue Follow-Ups
                        </h3>
                        <div className="mt-3 space-y-2.5">
                          {overdueReminders.map(reminder => {
                            const contact = contacts.find(c => c.id === reminder.contact_id);
                            return (
                              <div key={reminder.id} className="flex items-center justify-between p-3 bg-white border border-red-100 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                  <button onClick={() => toggleReminder(reminder.id, reminder.completed)} className="text-red-400 hover:text-red-600 transition">
                                    <Square className="w-4 h-4" />
                                  </button>
                                  <div>
                                    <span className="text-xs font-semibold text-slate-900">{reminder.title}</span>
                                    <p className="text-[10px] text-red-600 mt-0.5 font-medium">Due: {formatDate(reminder.due_date)}</p>
                                  </div>
                                </div>
                                {contact && (
                                  <Link href={`/contacts/${contact.id}`} className="text-[10px] font-semibold text-purple-600 hover:text-purple-700">
                                    {contact.name}
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

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
                          {upcomingReminders.map(reminder => {
                            const contact = contacts.find(c => c.id === reminder.contact_id);
                            return (
                              <div key={reminder.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                                <div className="flex items-start gap-3 min-w-0">
                                  <button onClick={() => toggleReminder(reminder.id, reminder.completed)} className="text-slate-400 hover:text-purple-600 transition mt-0.5 shrink-0">
                                    {reminder.completed ? <CheckSquare className="w-4 h-4 text-purple-500" /> : <Square className="w-4 h-4" />}
                                  </button>
                                  <div className="min-w-0">
                                    <span className="text-xs font-medium text-slate-900 leading-snug break-words">{reminder.title}</span>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Due: {formatDate(reminder.due_date)}</p>
                                  </div>
                                </div>
                                {contact && (
                                  <Link href={`/contacts/${contact.id}`} className="text-[10px] font-semibold text-purple-600 hover:text-purple-700 px-2 py-1 rounded shrink-0 transition ml-4">
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

                  {/* Recent Interactions Summary */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Recent Interactions</h3>
                        <p className="text-[11px] text-slate-400">Your latest contact logs</p>
                      </div>
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                    </div>
                    {interactions.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 my-auto">
                        No recent interactions logged.
                      </div>
                    ) : (
                      <div className="relative border-l border-slate-100 pl-4 space-y-6 my-auto py-2">
                        {interactions.map(int => {
                          const contact = contacts.find(c => c.id === int.contact_id);
                          return (
                            <div key={int.id} className="relative">
                              <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white" />
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{int.type}</span>
                                  <span className="text-[10px] text-slate-400">{formatDate(int.date)}</span>
                                </div>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">{int.description}</p>
                                {contact && (
                                  <Link href={`/contacts/${contact.id}`} className="inline-block text-[10px] font-bold text-slate-500 hover:text-purple-600 hover:underline">
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
                      <Link href="/contacts" className="flex items-center justify-center gap-1 w-full text-xs font-semibold text-slate-600 hover:text-purple-600 transition">
                        <span>Manage Contacts</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Logs Tab Content */}
            {activeTab === 'activity' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-600" />
                    Interaction History Log
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">A complete list of logged interactions across all your contacts.</p>
                </div>

                {allInteractions.length === 0 ? (
                  <div className="py-20 text-center text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    No interactions logged yet. Go to your contacts page to log one!
                  </div>
                ) : (
                  <div className="relative border-l border-slate-200 pl-6 space-y-8 ml-2">
                    {allInteractions.map(int => {
                      const contact = contacts.find(c => c.id === int.contact_id);
                      const typeColors: Record<string, string> = {
                        email: 'bg-blue-50 text-blue-700 border-blue-100',
                        call: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        meeting: 'bg-purple-50 text-purple-700 border-purple-100',
                        other: 'bg-slate-50 text-slate-700 border-slate-100',
                      };

                      return (
                        <div key={int.id} className="relative group">
                          {/* Dot marker */}
                          <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 rounded-full bg-white border-2 border-purple-500 items-center justify-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                          </span>
                          
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 hover:shadow-sm transition">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${typeColors[int.type] || typeColors.other}`}>
                                  {int.type}
                                </span>
                                <span className="text-[10px] text-slate-400">{formatDate(int.date)}</span>
                              </div>
                              <button
                                onClick={() => handleDeleteInteraction(int.id)}
                                className="text-slate-400 hover:text-red-600 transition shrink-0 p-1 cursor-pointer opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <p className="text-sm font-semibold text-slate-800">{int.description}</p>
                            {int.notes && (
                              <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                                {int.notes}
                              </p>
                            )}

                            {contact && (
                              <div className="pt-1 flex justify-between items-center text-[11px]">
                                <span className="text-slate-400">Interaction Partner:</span>
                                <Link href={`/contacts/${contact.id}`} className="font-bold text-purple-600 hover:underline">
                                  {contact.name}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab Content */}
            {activeTab === 'settings' && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Account Details Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      Account Profile
                    </h3>
                    <p className="text-xs text-slate-400">Your Personal CRM registration details</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                      <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span>{userFullName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                      <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{userEmail}</span>
                      </div>
                    </div>

                    {userJoined && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Member Since</label>
                        <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span>{userJoined}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* System & Connection Status */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-600" />
                        Database & Deployment Status
                      </h3>
                      <p className="text-xs text-slate-400">Connection environment parameters</p>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-slate-500 font-medium">Linked Database</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Supabase Database (Active)
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-slate-500 font-medium">Hosting Provider</span>
                        <span className="font-semibold text-slate-800">Vercel</span>
                      </div>
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-slate-500 font-medium">Site URL</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {process.env.NEXT_PUBLIC_SITE_URL || 'https://crm-nine-nu-15.vercel.app'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/70 border border-red-100 rounded-lg shadow-sm transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of CRM</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <ContactForm
        isOpen={contactFormOpen}
        onClose={() => setContactFormOpen(false)}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
}

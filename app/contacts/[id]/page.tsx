'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/navbar';
import ContactForm from '@/components/contact-form';
import InteractionForm from '@/components/interaction-form';
import ReminderForm from '@/components/reminder-form';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft, Mail, Phone, Building2, Plus, Trash2,
  Edit3, Clock, CheckSquare, Square, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { ContactFormValues, InteractionFormValues, ReminderFormValues } from '@/validations';
import type { Contact, Interaction, Reminder } from '@/types';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const id = params?.id as string;

  const [contact, setContact]           = React.useState<Contact | null>(null);
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const [reminders, setReminders]       = React.useState<Reminder[]>([]);
  const [loading, setLoading]           = React.useState(true);

  const [editFormOpen, setEditFormOpen]             = React.useState(false);
  const [interactionFormOpen, setInteractionFormOpen] = React.useState(false);
  const [reminderFormOpen, setReminderFormOpen]     = React.useState(false);
  const [deleteContactOpen, setDeleteContactOpen]   = React.useState(false);

  React.useEffect(() => { loadAll(); }, [id]);

  async function loadAll() {
    setLoading(true);
    const [{ data: c }, { data: ints }, { data: rems }] = await Promise.all([
      supabase.from('contacts').select('*').eq('id', id).single(),
      supabase.from('interactions').select('*').eq('contact_id', id).order('date', { ascending: false }),
      supabase.from('reminders').select('*').eq('contact_id', id).order('due_date', { ascending: true }),
    ]);
    if (!c) { router.push('/contacts'); return; }
    setContact(c as Contact);
    setInteractions((ints as Interaction[]) || []);
    setReminders((rems as Reminder[]) || []);
    setLoading(false);
  }

  async function handleEditSubmit(data: ContactFormValues) {
    await supabase.from('contacts').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
    setEditFormOpen(false);
    await loadAll();
  }

  async function handleInteractionSubmit(data: InteractionFormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('interactions').insert({ ...data, contact_id: id, user_id: user.id });
    await supabase.from('contacts').update({ last_contacted_at: data.date || new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', id);
    setInteractionFormOpen(false);
    await loadAll();
  }

  async function handleReminderSubmit(data: ReminderFormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('reminders').insert({ title: data.title, due_date: data.dueDate, contact_id: id, user_id: user.id, completed: false });
    setReminderFormOpen(false);
    await loadAll();
  }

  async function handleDeleteContactConfirm() {
    await supabase.from('contacts').delete().eq('id', id);
    router.push('/contacts');
  }

  async function toggleReminder(remId: string, completed: boolean) {
    await supabase.from('reminders').update({ completed: !completed }).eq('id', remId);
    await loadAll();
  }

  async function deleteReminder(remId: string) {
    await supabase.from('reminders').delete().eq('id', remId);
    await loadAll();
  }

  async function deleteInteraction(intId: string) {
    await supabase.from('interactions').delete().eq('id', intId);
    await loadAll();
  }

  if (loading || !contact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
        <p className="text-sm font-medium">Loading profile...</p>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lead: 'bg-purple-50 text-purple-700 border-purple-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="flex-1 pb-10">
      <Navbar title={contact.name} />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Back + Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/contacts" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Contacts
          </Link>
          <div className="flex items-center gap-2 self-end">
            <button onClick={() => setEditFormOpen(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition">
              <Edit3 className="w-3.5 h-3.5" /><span>Edit Profile</span>
            </button>
            <button onClick={() => setDeleteContactOpen(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg shadow-sm transition">
              <Trash2 className="w-3.5 h-3.5" /><span>Delete</span>
            </button>
          </div>
        </div>

        {/* Profile Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl border border-purple-200">
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">{contact.name}</h2>
                <span className={`px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full border ${statusColors[contact.status]}`}>{contact.status}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{contact.role ? `${contact.role} ` : ''}{contact.company ? `at ${contact.company}` : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-xs text-slate-500 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Interaction</p>
              <p className="text-slate-800 font-semibold mt-0.5">{formatDate(contact.last_contacted_at)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Added On</p>
              <p className="text-slate-800 font-semibold mt-0.5">{formatDate(contact.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Basic Information</h3>
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium">Email Address</span>
                  <div className="flex items-center gap-2 mt-0.5 text-slate-800 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:underline truncate">{contact.email}</a>
                  </div>
                </div>
                {contact.phone && (
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Phone Number</span>
                    <div className="flex items-center gap-2 mt-0.5 text-slate-800 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                )}
                {contact.company && (
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Company</span>
                    <div className="flex items-center gap-2 mt-0.5 text-slate-800 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.company}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Profile Notes</h3>
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">{contact.notes || 'No context notes added yet. Edit profile to write notes.'}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Reminders */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Follow-Up Reminders</h3>
                  <p className="text-[11px] text-slate-400">Scheduled reminders for {contact.name}</p>
                </div>
                <button onClick={() => setReminderFormOpen(true)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition">
                  <Plus className="w-3.5 h-3.5" /><span>Add Reminder</span>
                </button>
              </div>
              {reminders.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg">No reminders scheduled.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {reminders.map(rem => {
                    const isOverdue = !rem.completed && new Date(rem.due_date) < new Date();
                    return (
                      <div key={rem.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start gap-3 min-w-0">
                          <button onClick={() => toggleReminder(rem.id, rem.completed)} className="text-slate-400 hover:text-purple-600 transition mt-0.5 shrink-0">
                            {rem.completed ? <CheckSquare className="w-4 h-4 text-purple-600" /> : <Square className="w-4 h-4" />}
                          </button>
                          <div className="min-w-0">
                            <span className={`text-xs font-medium ${rem.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>{rem.title}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className={`text-[10px] ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>Due: {formatDate(rem.due_date)} {isOverdue && '(Overdue)'}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => deleteReminder(rem.id)} className="text-slate-400 hover:text-red-600 transition shrink-0 ml-4">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Interactions */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Interaction History</h3>
                  <p className="text-[11px] text-slate-400">Timeline log of recent touchpoints</p>
                </div>
                <button onClick={() => setInteractionFormOpen(true)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition">
                  <Plus className="w-3.5 h-3.5" /><span>Log Interaction</span>
                </button>
              </div>
              {interactions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg">No interactions logged for this contact yet.</div>
              ) : (
                <div className="relative border-l border-slate-100 pl-4 space-y-6">
                  {interactions.map(int => {
                    const typeColors: Record<string, string> = {
                      email: 'bg-blue-50 text-blue-700 border-blue-100',
                      call: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                      meeting: 'bg-purple-50 text-purple-700 border-purple-100',
                      other: 'bg-slate-50 text-slate-700 border-slate-100',
                    };
                    return (
                      <div key={int.id} className="relative group">
                        <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white" />
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded border ${typeColors[int.type]}`}>{int.type}</span>
                              <span className="text-[10px] text-slate-400">{formatDate(int.date)}</span>
                            </div>
                            <button onClick={() => deleteInteraction(int.id)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition shrink-0 p-1">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 leading-snug">{int.description}</p>
                          {int.notes && <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1.5">{int.notes}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ContactForm isOpen={editFormOpen} onClose={() => setEditFormOpen(false)} onSubmit={handleEditSubmit} contact={contact} />
      <InteractionForm isOpen={interactionFormOpen} onClose={() => setInteractionFormOpen(false)} onSubmit={handleInteractionSubmit} contactName={contact.name} />
      <ReminderForm isOpen={reminderFormOpen} onClose={() => setReminderFormOpen(false)} onSubmit={handleReminderSubmit} contactName={contact.name} />
      <ConfirmationDialog isOpen={deleteContactOpen} title="Delete Profile" description="Are you sure you want to delete this contact profile? This will delete all of their history, notes, logged interactions, and reminders. This action cannot be undone." confirmLabel="Delete Profile" onConfirm={handleDeleteContactConfirm} onCancel={() => setDeleteContactOpen(false)} />
    </div>
  );
}

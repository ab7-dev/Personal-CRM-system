'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/navbar';
import SearchBar from '@/components/search-bar';
import ContactCard from '@/components/contact-card';
import ContactForm from '@/components/contact-form';
import EmptyState from '@/components/empty-states';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { ContactStatus } from '@/types';
import { ContactFormValues } from '@/validations';
import type { Contact } from '@/types';

export default function ContactsPage() {
  const supabase = createClient();

  const [contacts, setContacts]         = React.useState<Contact[]>([]);
  const [loading, setLoading]           = React.useState(true);
  const [searchQuery, setSearchQuery]   = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<ContactStatus | 'all'>('all');
  const [contactFormOpen, setContactFormOpen] = React.useState(false);
  const [deleteId, setDeleteId]         = React.useState<string | null>(null);

  React.useEffect(() => { loadContacts(); }, []);

  async function loadContacts() {
    setLoading(true);
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    setContacts((data as Contact[]) || []);
    setLoading(false);
  }

  async function handleContactSubmit(data: ContactFormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('contacts').insert({ ...data, user_id: user.id });
    setContactFormOpen(false);
    await loadContacts();
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    await supabase.from('contacts').delete().eq('id', deleteId);
    setDeleteId(null);
    await loadContacts();
  }

  const filteredContacts = contacts.filter(contact => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      contact.name.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      (contact.company || '').toLowerCase().includes(q) ||
      (contact.role || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 pb-10">
      <Navbar
        title="Contacts"
        actionButton={{ label: 'Add Contact', onClick: () => setContactFormOpen(true) }}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <SearchBar
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            currentStatus={statusFilter}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <EmptyState
            title={contacts.length === 0 ? 'No Contacts Yet' : 'No matching contacts found'}
            description={
              contacts.length === 0
                ? 'Get started by adding your first personal or professional contact.'
                : 'Try adjusting your search terms or status filters.'
            }
            actionButton={contacts.length === 0 ? { label: 'Add Contact', onClick: () => setContactFormOpen(true) } : undefined}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact, idx) => (
              <div key={contact.id} style={{ '--stagger': idx } as React.CSSProperties} className="animate-fade-in-up">
                <ContactCard
                  contact={contact}
                  onDeleteClick={id => setDeleteId(id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <ContactForm
        isOpen={contactFormOpen}
        onClose={() => setContactFormOpen(false)}
        onSubmit={handleContactSubmit}
      />

      <ConfirmationDialog
        isOpen={deleteId !== null}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This will delete all of their history, notes, logged interactions, and reminders. This action cannot be undone."
        confirmLabel="Delete Contact"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { useCRM } from '@/hooks/use-contacts';
import Navbar from '@/components/navbar';
import SearchBar from '@/components/search-bar';
import ContactCard from '@/components/contact-card';
import ContactForm from '@/components/contact-form';
import EmptyState from '@/components/empty-states';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { ContactStatus } from '@/types';

import { ContactFormValues } from '@/validations';

export default function ContactsPage() {
  const { contacts, addContact, deleteContact } = useCRM();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<ContactStatus | 'all'>('all');

  // Modal Dialogs State
  const [contactFormOpen, setContactFormOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  // Handle new contact submission
  const handleContactSubmit = (data: ContactFormValues) => {
    addContact(data);
    setContactFormOpen(false);
  };

  // Filter contacts list based on search term & status filter
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.role && contact.role.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteContact(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex-1 pb-10">
      {/* Top Navbar */}
      <Navbar 
        title="Contacts" 
        actionButton={{
          label: 'Add Contact',
          onClick: () => setContactFormOpen(true),
        }}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header Action Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <SearchBar 
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            currentStatus={statusFilter}
          />
        </div>

        {/* Contacts Grid display */}
        {filteredContacts.length === 0 ? (
          <EmptyState 
            title={
              contacts.length === 0 
                ? "No Contacts Yet" 
                : "No matching contacts found"
            }
            description={
              contacts.length === 0
                ? "Get started by adding your first personal or professional contact."
                : "Try adjusting your search terms or status filters."
            }
            actionButton={
              contacts.length === 0
                ? {
                    label: "Add Contact",
                    onClick: () => setContactFormOpen(true),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                onDeleteClick={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Contact Modal Form */}
      <ContactForm 
        isOpen={contactFormOpen}
        onClose={() => setContactFormOpen(false)}
        onSubmit={handleContactSubmit}
      />

      {/* Delete Confirmation Modal Dialog */}
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

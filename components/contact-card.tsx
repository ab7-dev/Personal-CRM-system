'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { Contact } from '@/types';
import { cn, formatDate } from '@/lib/utils';

interface ContactCardProps {
  contact: Contact;
  onDeleteClick?: (id: string) => void;
}

export default function ContactCard({ contact, onDeleteClick }: ContactCardProps) {
  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lead: 'bg-purple-50 text-purple-700 border-purple-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="hover-lift group relative bg-white border border-slate-200 hover:border-purple-300 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">
      {/* Detail Content */}
      <div className="p-5">
        {/* Name and Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-purple-700 transition truncate text-base">
              {contact.name}
            </h3>
            {contact.role && contact.company ? (
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {contact.role} at {contact.company}
              </p>
            ) : contact.company ? (
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {contact.company}
              </p>
            ) : null}
          </div>

          <span 
            className={cn(
              "px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full border shrink-0",
              statusColors[contact.status]
            )}
          >
            {contact.status}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-4" />

        {/* Contact info list */}
        <div className="space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a href={`mailto:${contact.email}`} className="hover:underline hover:text-slate-800 truncate">
              {contact.email}
            </a>
          </div>

          {contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{contact.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Last contacted: {formatDate(contact.last_contacted_at)}</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Link */}
      <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link 
          href={`/contacts/${contact.id}`}
          className="flex items-center gap-1 font-semibold text-slate-600 group-hover:text-purple-700 transition"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        {onDeleteClick && (
          <button 
            onClick={() => onDeleteClick(contact.id)}
            className="btn-press text-slate-400 hover:text-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

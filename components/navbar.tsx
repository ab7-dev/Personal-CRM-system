'use client';

import React from 'react';
import { Bell, HelpCircle, FileText, Plus, User } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function Navbar({ title, actionButton }: NavbarProps) {
  const [notifications, setNotifications] = React.useState(2);

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
        {/* Help, Docs, Notifications */}
        <div className="flex items-center gap-2">
          {/* Notifications bell */}
          <button 
            onClick={() => setNotifications(0)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 relative"
          >
            <Bell className="w-4 h-4" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full" />
            )}
          </button>
          
          <Link 
            href="#" 
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md font-medium border border-transparent transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>

          <Link 
            href="#" 
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md font-medium border border-transparent transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Docs</span>
          </Link>
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-slate-200" />

        {/* Upgrade / Primary CTA Button */}
        <div className="flex items-center gap-2">
          <Link 
            href="#" 
            className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200/80 rounded-md border border-purple-200 transition"
          >
            Pro Version
          </Link>

          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-slate-800 rounded-md shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{actionButton.label}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

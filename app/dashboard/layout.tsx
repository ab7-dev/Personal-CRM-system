'use client';

import React from 'react';
import { useCRM } from '@/hooks/use-contacts';
import Sidebar from '@/components/sidebar';
import { Search, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { contacts } = useCRM();
  const [query, setQuery] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(query.toLowerCase())) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  const navigateToContact = (id: string) => {
    router.push(`/contacts/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Box */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl z-10 overflow-hidden transform transition-all">
        <div className="relative border-b border-slate-100 flex items-center p-3">
          <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a contact's name, email, or company to search..."
            className="w-full text-sm bg-transparent border-0 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition shrink-0 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No contacts found matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigateToContact(c.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-left transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-xs shrink-0">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {c.company ? `${c.role || 'Contact'} at ${c.company}` : c.email}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Helper footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>Search contacts in real-time</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedLayoutContent({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar navigation */}
      <Sidebar onSearchClick={() => setSearchOpen(true)} />

      {/* Main scrolling viewport container */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        {children}
      </div>

      {/* Global Command Menu Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
  );
}

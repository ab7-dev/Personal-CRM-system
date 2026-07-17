'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  History, 
  Settings, 
  Search, 
  ChevronDown, 
  ArrowLeft, 
  LogOut,
  BellRing
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/actions/auth';

interface SidebarProps {
  className?: string;
  onSearchClick?: () => void;
}

export default function Sidebar({ className, onSearchClick }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const [collapsed, setCollapsed] = React.useState(false);
  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, tab: null },
    { name: 'Contacts', href: '/contacts', icon: Users, tab: null },
    { name: 'Reminders', href: '/dashboard?tab=reminders', icon: BellRing, tab: 'reminders' },
    { name: 'Activity Logs', href: '/dashboard?tab=activity', icon: History, tab: 'activity' },
    { name: 'Settings', href: '/dashboard?tab=settings', icon: Settings, tab: 'settings' },
  ];

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r border-slate-200 bg-white transition-all duration-300 relative z-20",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Workspace Selector */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="text-sm font-semibold text-slate-900">Personal Team</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold text-sm mx-auto">
            P
          </div>
        )}
      </div>

      {/* Search Input Box */}
      <div className="p-3">
        {collapsed ? (
          <button 
            onClick={onSearchClick}
            className="btn-press w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 mx-auto"
          >
            <Search className="w-4 h-4" />
          </button>
        ) : (
          <div 
            onClick={onSearchClick}
            className="btn-press flex items-center justify-between w-full px-3 py-2 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/80"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = item.tab
            ? (pathname === '/dashboard' && currentTab === item.tab)
            : item.href === '/dashboard'
              ? (pathname === '/dashboard' && !currentTab)
              : (pathname === item.href || pathname?.startsWith(item.href + '/'));

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "btn-press flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg",
                isActive 
                  ? "bg-purple-50 text-purple-700 font-semibold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-purple-600" : "text-slate-400")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info / Collapse Section */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
            <button onClick={handleSignOut} className="btn-press text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "btn-press flex items-center w-full px-3 py-2 text-xs font-medium text-slate-500 rounded-lg hover:bg-slate-50 hover:text-slate-900",
            collapsed ? "justify-center" : "gap-2"
          )}
        >
          <ArrowLeft className={cn("w-3.5 h-3.5 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
}

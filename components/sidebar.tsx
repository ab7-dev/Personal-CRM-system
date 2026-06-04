'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  History, 
  Settings, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  User, 
  ArrowLeft, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  onSearchClick?: () => void;
}

export default function Sidebar({ className, onSearchClick }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Activity Logs', href: '/dashboard#activity', icon: History },
    { name: 'Settings', href: '/dashboard#settings', icon: Settings },
  ];

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
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 mx-auto"
          >
            <Search className="w-4 h-4" />
          </button>
        ) : (
          <div 
            onClick={onSearchClick}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/80 transition"
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
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
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
        {!collapsed && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium shrink-0">
              U
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">Alex Developer</p>
              <p className="text-[10px] text-slate-500 truncate">alex@example.com</p>
            </div>
            <Link href="/login" className="text-slate-400 hover:text-slate-600 shrink-0">
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center w-full px-3 py-2 text-xs font-medium text-slate-500 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition",
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

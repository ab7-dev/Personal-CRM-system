'use client';

import React from 'react';
import { Users, Calendar, AlertCircle, MessageSquare } from 'lucide-react';
import { DashboardStats } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardCardsProps {
  stats: DashboardStats;
}

export default function DashboardCards({ stats }: DashboardCardsProps) {
  const cards = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      description: 'Active, Leads & Inactive',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Upcoming Reminders',
      value: stats.upcomingFollowUps,
      description: 'Scheduled follow-ups',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Overdue Reminders',
      value: stats.overdueFollowUps,
      description: 'Urgent attention needed',
      icon: AlertCircle,
      color: stats.overdueFollowUps > 0 
        ? 'text-red-600 bg-red-50 border-red-100 animate-pulse' 
        : 'text-slate-500 bg-slate-50 border-slate-100',
    },
    {
      title: 'Recent Interactions',
      value: stats.recentInteractions,
      description: 'Logged within last 7 days',
      icon: MessageSquare,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className="group relative p-6 bg-white border border-slate-200 rounded-xl hover:border-purple-300 transition-all shadow-sm hover:shadow-md overflow-hidden"
          >
            {/* Top accent highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 group-hover:bg-purple-600 transition-colors" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                {card.title}
              </span>
              <div className={cn("p-2 rounded-lg border", card.color)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
              <p className="mt-1.5 text-xs text-slate-400">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

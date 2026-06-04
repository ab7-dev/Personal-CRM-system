'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1 max-w-[65%]">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        </div>
        <div className="h-5 bg-slate-200 rounded-full w-14" />
      </div>
      <div className="h-px bg-slate-100 w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded-md w-5/6" />
        <div className="h-3 bg-slate-100 rounded-md w-2/3" />
        <div className="h-3 bg-slate-100 rounded-md w-3/4" />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded-md w-24" />
            <div className="h-8 w-8 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-7 bg-slate-300 rounded-md w-12 mt-4" />
          <div className="h-3 bg-slate-100 rounded-md w-28 mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingState({ type = 'cards' }: { type?: 'cards' | 'stats' }) {
  if (type === 'stats') {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

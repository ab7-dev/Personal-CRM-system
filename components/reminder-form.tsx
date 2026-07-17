'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reminderSchema, ReminderFormValues } from '@/validations';
import { X } from 'lucide-react';

interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReminderFormValues) => void;
  contactName: string;
}

export default function ReminderForm({ isOpen, onClose, onSubmit, contactName }: ReminderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // tomorrow
    },
  });

  // Reset when open/close status changes
  React.useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
      />

      {/* Form Container */}
      <div className="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-xl shadow-xl z-10 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Add Reminder
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Schedule a follow-up task for <span className="font-semibold text-slate-700">{contactName}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reminder Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Call to finalize pricing"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Due Date Picker Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Due Date *
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-600">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-press px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-press px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-purple-500/20"
            >
              Schedule Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

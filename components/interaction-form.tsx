'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { interactionSchema, InteractionFormValues } from '@/validations';
import { X } from 'lucide-react';

interface InteractionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InteractionFormValues) => void;
  contactName: string;
}

export default function InteractionForm({ isOpen, onClose, onSubmit, contactName }: InteractionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      type: 'email',
      description: '',
      date: new Date().toISOString().substring(0, 10), // today's date
      notes: '',
    },
  });

  // Reset when open/close status changes
  React.useEffect(() => {
    if (isOpen) {
      reset({
        type: 'email',
        description: '',
        date: new Date().toISOString().substring(0, 10),
        notes: '',
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
      <div className="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-xl shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Log Interaction
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Record a new touchpoint with <span className="font-semibold text-slate-700">{contactName}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type Select Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Interaction Type *
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
            >
              <option value="email">Email</option>
              <option value="call">Phone Call</option>
              <option value="meeting">In-Person Meeting</option>
              <option value="other">Other Touchpoint</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Activity Description *
            </label>
            <input
              type="text"
              {...register('description')}
              placeholder="e.g. Discussed new API endpoints"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Date Picker Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Date *
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Notes Textarea Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Internal Notes
            </label>
            <textarea
              rows={3}
              {...register('notes')}
              placeholder="Agreed next steps, action items, or remarks..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition"
            >
              Log Interaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/validations';
import Link from 'next/link';
import { Shield, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    // Mock processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] grid-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 border border-slate-200 rounded-xl shadow-sm relative">
        {/* Sleek top indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600 rounded-t-xl" />

        {/* Header Logo */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Forgot Password
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 text-center max-w-[280px]">
            Enter your email to receive a password reset instructions link.
          </p>
        </div>

        {submitted ? (
          /* Success State Card */
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-800 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Reset Email Sent</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              If an account exists with that email address, we have sent instructions on how to reset your password.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Log In</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Email Input Form */
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-black hover:bg-slate-800 rounded-lg shadow-sm transition disabled:bg-slate-400 cursor-pointer mt-6"
            >
              {isSubmitting ? 'Sending instructions...' : 'Send Reset Link'}
            </button>

            {/* Back button link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Log In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

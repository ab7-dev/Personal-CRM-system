'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/validations';
import { signUp } from '@/actions/auth';
import Link from 'next/link';
import { Shield, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    const formData = new FormData();
    formData.set('name', data.name);
    formData.set('email', data.email);
    formData.set('password', data.password);
    formData.set('confirmPassword', data.confirmPassword);
    const result = await signUp(formData);
    if (result?.error) {
      setServerError(result.error);
    } else if (result?.success) {
      // Email confirmation is required - signUp did NOT redirect us to /dashboard
      setSubmitted(true);
    }
    // If neither error nor success came back, signUp() redirected us server-side already.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] grid-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 border border-slate-200 rounded-xl shadow-sm relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600 rounded-t-xl" />

        {submitted ? (
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
            <p className="text-sm text-slate-500">
              We sent a confirmation link to your email address. Click it to activate your account, then log in.
            </p>
            <Link href="/login" className="btn-press mt-4 text-xs font-semibold text-purple-600 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Create an Account</h2>
              <p className="mt-1.5 text-xs text-slate-500">Start organizing your personal relationships today.</p>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-3">
                {serverError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" {...register('name')} placeholder="John Doe"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm" />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" {...register('email')} placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" {...register('password')} placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm" />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" {...register('confirmPassword')} placeholder="Repeat password"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm" />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting}
                className="btn-press w-full py-2.5 px-4 text-xs font-semibold text-white bg-black hover:bg-slate-800 rounded-lg shadow-sm disabled:bg-slate-400 cursor-pointer mt-6">
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">Log in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

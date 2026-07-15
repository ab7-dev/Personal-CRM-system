'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/validations';
import { signIn } from '@/actions/auth';
import Link from 'next/link';
import { Shield, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const formData = new FormData();
    formData.set('email', data.email);
    formData.set('password', data.password);
    const result = await signIn(formData);
    if (result?.error) setServerError(result.error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] grid-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 border border-slate-200 rounded-xl shadow-sm relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600 rounded-t-xl" />

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Log in to Personal CRM</h2>
          <p className="mt-1.5 text-xs text-slate-500">Welcome back! Enter your details below.</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-3">
            {serverError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="password" {...register('password')} placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm" />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-black hover:bg-slate-800 rounded-lg shadow-sm transition disabled:bg-slate-400 cursor-pointer mt-6">
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

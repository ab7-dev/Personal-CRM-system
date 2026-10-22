'use client';

import React from 'react';
import Link from 'next/link';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, KeyRound, Lock } from 'lucide-react';
import { updatePassword } from '@/actions/auth';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/validations';

export default function ResetPasswordPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [updated, setUpdated] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError(null);
    const formData = new FormData();
    formData.set('password', data.password);
    formData.set('confirmPassword', data.confirmPassword);
    const result = await updatePassword(formData);

    if (result?.error) {
      setServerError(result.error);
    } else {
      setUpdated(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] grid-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-purple-600" />

        {updated ? (
          <div className="flex flex-col items-center space-y-4 py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h1 className="text-xl font-bold text-slate-900">Password updated</h1>
            <p className="text-sm text-slate-500">Your password has been changed. Taking you to your dashboard…</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                <KeyRound className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Choose a new password</h1>
              <p className="mt-1.5 text-xs text-slate-500">Use at least 6 characters and keep it somewhere safe.</p>
            </div>

            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {serverError} <Link className="font-semibold underline" href="/forgot-password">Request a new link</Link>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <PasswordField label="New password" error={errors.password?.message} register={register('password')} />
              <PasswordField label="Confirm new password" error={errors.confirmPassword?.message} register={register('confirmPassword')} />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-press mt-2 w-full cursor-pointer rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:bg-slate-400"
              >
                {isSubmitting ? 'Updating password...' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function PasswordField({ label, error, register }: {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <div className="relative">
        <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          {...register}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3.5 pl-9 text-sm shadow-sm placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

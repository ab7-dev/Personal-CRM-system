'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { reminderSchema } from '@/validations';
import type { Reminder } from '@/types';

export async function getReminders(contactId?: string): Promise<{ data: Reminder[] | null; error: string | null }> {
  const supabase = await createClient();

  let query = supabase
    .from('reminders')
    .select('*')
    .order('due_date', { ascending: true });

  if (contactId) {
    query = query.eq('contact_id', contactId);
  }

  const { data, error } = await query;

  if (error) return { data: null, error: error.message };
  return { data: data as Reminder[], error: null };
}

export async function createReminder(contactId: string, input: {
  title: string; dueDate: string;
}) {
  const parsed = reminderSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase.from('reminders').insert({
    contact_id: contactId,
    user_id: user.id,
    title: parsed.data.title,
    due_date: parsed.data.dueDate,
    completed: false,
  }).select().single();

  if (error) return { error: error.message };

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/dashboard');
  return { data, success: true };
}

export async function toggleReminder(id: string, completed: boolean, contactId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reminders')
    .update({ completed })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteReminder(id: string, contactId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/dashboard');
  return { success: true };
}

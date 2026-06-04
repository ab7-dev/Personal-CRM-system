'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { contactSchema } from '@/validations';
import type { Contact } from '@/types';

export async function getContacts(): Promise<{ data: Contact[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as Contact[], error: null };
}

export async function getContact(id: string): Promise<{ data: Contact | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Contact, error: null };
}

export async function createContact(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    company: formData.get('company') as string,
    role: formData.get('role') as string,
    status: formData.get('status') as string,
    notes: formData.get('notes') as string,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase.from('contacts').insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath('/contacts');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function createContactFromObject(input: {
  name: string; email: string; phone?: string; company?: string;
  role?: string; status: 'lead' | 'active' | 'inactive'; notes?: string;
}) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase.from('contacts').insert({
    ...parsed.data,
    user_id: user.id,
  }).select().single();

  if (error) return { error: error.message };

  revalidatePath('/contacts');
  revalidatePath('/dashboard');
  return { data, success: true };
}

export async function updateContact(id: string, input: Partial<{
  name: string; email: string; phone: string; company: string;
  role: string; status: string; notes: string; last_contacted_at: string;
}>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('contacts')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/contacts');
  revalidatePath(`/contacts/${id}`);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteContact(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/contacts');
  revalidatePath('/dashboard');
  return { success: true };
}

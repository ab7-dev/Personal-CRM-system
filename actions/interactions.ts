'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { interactionSchema } from '@/validations';
import type { Interaction } from '@/types';

export async function getInteractions(contactId?: string): Promise<{ data: Interaction[] | null; error: string | null }> {
  const supabase = await createClient();

  let query = supabase
    .from('interactions')
    .select('*')
    .order('date', { ascending: false });

  if (contactId) {
    query = query.eq('contact_id', contactId);
  }

  const { data, error } = await query;

  if (error) return { data: null, error: error.message };
  return { data: data as Interaction[], error: null };
}

export async function createInteraction(contactId: string, input: {
  type: string; description: string; date: string; notes?: string;
}) {
  const parsed = interactionSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase.from('interactions').insert({
    contact_id: contactId,
    user_id: user.id,
    type: parsed.data.type,
    description: parsed.data.description,
    notes: parsed.data.notes || null,
    date: parsed.data.date,
  }).select().single();

  if (error) return { error: error.message };

  // Update contact's last_contacted_at
  await supabase
    .from('contacts')
    .update({ last_contacted_at: parsed.data.date, updated_at: new Date().toISOString() })
    .eq('id', contactId);

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/dashboard');
  return { data, success: true };
}

export async function updateInteraction(id: string, input: Partial<{
  type: string; description: string; notes: string; date: string;
}>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('interactions')
    .update(input)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteInteraction(id: string, contactId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/dashboard');
  return { success: true };
}

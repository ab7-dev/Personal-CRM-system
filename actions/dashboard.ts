'use server';

import { createClient } from '@/lib/supabase/server';
import type { DashboardStats } from '@/types';

export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const [
    { count: totalContacts },
    { count: upcomingFollowUps },
    { count: overdueFollowUps },
    { count: recentInteractions },
  ] = await Promise.all([
    // Total contacts
    supabase.from('contacts').select('*', { count: 'exact', head: true }),

    // Upcoming reminders (due in future, not completed)
    supabase.from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('completed', false)
      .gte('due_date', now),

    // Overdue reminders (past due, not completed)
    supabase.from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('completed', false)
      .lt('due_date', now),

    // Interactions in last 7 days
    supabase.from('interactions')
      .select('*', { count: 'exact', head: true })
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    data: {
      totalContacts: totalContacts ?? 0,
      upcomingFollowUps: upcomingFollowUps ?? 0,
      overdueFollowUps: overdueFollowUps ?? 0,
      recentInteractions: recentInteractions ?? 0,
    },
    error: null,
  };
}

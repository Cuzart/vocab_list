import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Box, Container } from '@mantine/core';
import { AppContent } from '@/components/AppContent/AppContent';
import { TranslationEntry } from '@/types';
import { redirect } from 'next/navigation';
import { ChatInput } from '@/components/ChatInput/ChatInput';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from('translations')
    .select('*')
    .eq('created_by', user?.id);

  if (!user) redirect('/login');

  return <AppContent entries={entries as TranslationEntry[]} />;
}

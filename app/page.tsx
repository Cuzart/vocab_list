import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Container } from '@mantine/core';
import { AppContent } from '@/components/AppContent';
import { TranslationEntry } from '@/types';

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

  return (
    <main>
      <Container pos={'relative'}>
        <AppContent entries={entries as TranslationEntry[]} />
      </Container>
    </main>
  );
}

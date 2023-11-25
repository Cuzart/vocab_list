import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Box, Container, Flex, Stack, Text, Title } from '@mantine/core';
import { TranslationItem } from '@/components/TranslationItem/TranslationItem';
import { ChatInput } from '@/components/ChatInput/ChatInput';
import { CountryPicker } from '@/components/CountryPicker/CountryPicker';
import { HideToggle } from '@/components/HideToggle/HideToggle';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { AppContent } from '@/components/AppContent';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: notes, error } = await supabase
    .from('translations')
    .select('*')
    .eq('created_by', user?.id);

  return (
    <main>
      <Container pos={'relative'}>
        <AppContent notes={notes} />
      </Container>
    </main>
  );
}

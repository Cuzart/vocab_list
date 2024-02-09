import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { AppContent } from '@/components/AppContent/AppContent';
import { TranslationEntry } from '@/types';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  const { data: entries } = await supabase.from('translations').select('*').order('created_at');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('languages, repetitions')
    .eq('user_id', user.id)
    .single();

  return <AppContent entries={entries as TranslationEntry[]} profileData={profileData} />;
}

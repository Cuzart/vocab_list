import { AppContent } from '@/components/AppContent/AppContent';
import { TranslationEntry } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const entriesReq = supabase
    .from('translations')
    .select('id, translation, original, count, language')
    .order('created_at');

  const translationsReq = supabase
    .from('profiles')
    .select('languages, repetitions')
    .eq('user_id', user?.id)
    .single();

  const [{ data: entries }, { data: profileData }] = await Promise.all([
    entriesReq,
    translationsReq,
  ]);

  return <AppContent entries={entries as TranslationEntry[]} profileData={profileData} />;
}

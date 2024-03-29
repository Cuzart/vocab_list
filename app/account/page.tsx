import { AccountForm } from '@/components/AccountForm/AccountForm';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('languages, repetitions')
    .eq('user_id', user.id)
    .single();

  return <>{user && <AccountForm user={user} profileData={profileData} />}</>;
}

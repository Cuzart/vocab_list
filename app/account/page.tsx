import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect, useSearchParams } from 'next/navigation';
import { AccountForm } from './AccountForm';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return <>{user && <AccountForm user={user} />}</>;
}

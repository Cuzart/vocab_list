'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function deleteTranslation({ id }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from('translations').delete().eq('id', id);
  if (error) {
    return false;
  }

  return true;
}

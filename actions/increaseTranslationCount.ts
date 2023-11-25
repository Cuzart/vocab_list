'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function increaseTranslationCount({ id, count }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (count >= 5) {
    await supabase.from('translations').delete().eq('id', id);
    return true;
  }

  const { error } = await supabase.from('translations').update({ count }).eq('id', id);

  if (error) {
    return false;
  }

  return true;
}

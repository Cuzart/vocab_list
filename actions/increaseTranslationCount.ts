'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

type Params = {
  id: number;
  count: number;
  limit: number;
};

export async function increaseTranslationCount({ id, count, limit }: Params) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (count >= limit) {
    await supabase.from('translations').delete().eq('id', id);
    return true;
  }

  const { error } = await supabase.from('translations').update({ count }).eq('id', id);

  if (error) {
    return false;
  }

  return true;
}

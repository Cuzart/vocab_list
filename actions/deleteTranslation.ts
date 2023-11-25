'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

type Params = {
  id: number;
};

export async function deleteTranslation({ id }: Params) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from('translations').delete().eq('id', id);
  if (error) {
    return false;
  }

  return true;
}

'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

type Params = {
  id: number;
  edit: string;
  switched: boolean;
};

export async function editTranslation({ id, edit, switched }: Params) {
  edit = edit.trim();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('translations')
    .update(switched ? { original: edit } : { translation: edit })
    .eq('id', id);
  if (error) {
    return false;
  }

  return true;
}

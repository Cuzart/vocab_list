'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Translator } from 'deepl-node';

export async function createTranslation({ text, source, target }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authKey = process.env.DEEPL_KEY!;
  const translator = new Translator(authKey);

  const result = await translator.translateText(text, source, target);

  const newTranslation = {
    original: text,
    translation: result.text,
    created_by: user?.id,
    language: source,
  };

  const { error } = await supabase.from('translations').insert(newTranslation);
  if (error) {
    return false;
  }

  return true;
}

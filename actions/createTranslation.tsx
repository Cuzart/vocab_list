'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';

type Params = {
  text: string;
  source: string;
  target: string;
};

export async function createTranslation({ text, source, target }: Params) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authKey = process.env.DEEPL_KEY!;
  const translator = new Translator(authKey);

  const result = await translator.translateText(
    text,
    source as SourceLanguageCode,
    target as TargetLanguageCode
  );

  const newTranslation = {
    original: text,
    translation: result.text,
    created_by: user?.id,
    language: source,
  };

  const { data, error } = await supabase
    .from('translations')
    .insert(newTranslation)
    .select('*')
    .single();
  if (error) {
    return false;
  }

  return data;
}

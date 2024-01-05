'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';

type Params = {
  text: string;
  source: string;
  target: string;
  switched?: boolean;
};

export async function createTranslation({ text, source, target, switched }: Params) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authKey = process.env.DEEPL_KEY!;
  const translator = new Translator(authKey);

  const result = await translator.translateText(
    text,
    (switched ? target : source) as SourceLanguageCode,
    (switched ? (source === 'en' ? 'en-GB' : source) : target) as TargetLanguageCode
  );

  const newTranslation = {
    original: switched ? result.text : text,
    translation: switched ? text : result.text,
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

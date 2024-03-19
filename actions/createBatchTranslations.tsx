'use server';

import { createClient } from '@/utils/supabase/server';
import { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import { cookies } from 'next/headers';

type Params = {
  text: string[][];
  source: string;
  target: string;
  switched?: boolean;
};

export async function createBatchTranslations({ text, source, target, switched }: Params) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authKey = process.env.DEEPL_KEY!;
  const translator = new Translator(authKey);

  let sourceLang = switched ? target : source;
  let targetLang = switched ? source : target;

  if (targetLang === 'en') targetLang = 'en-GB';
  if (targetLang === 'pt') targetLang = 'pt-PT';

  const wordWithTranslation: string[][] = [];
  const singleWord: string[] = [];

  text.map((line) => {
    if (line.length === 2) {
      wordWithTranslation.push(line);
    }
    if (line.length === 1) {
      singleWord.push(line[0]);
    }
  });

  const result =
    singleWord.length > 0
      ? await translator.translateText(
          singleWord,
          sourceLang as SourceLanguageCode,
          targetLang as TargetLanguageCode
        )
      : [];

  const newTranslations = singleWord.map((entry, index) => ({
    original: entry.trim(),
    translation: result[index].text.trim(),
    created_by: user?.id,
    language: source,
  }));

  const newEntries = wordWithTranslation.map(([og, trans]) => ({
    original: switched ? trans.trim() : og.trim(),
    translation: switched ? og.trim() : trans.trim(),
    created_by: user?.id,
    language: source,
  }));

  const { data, error } = await supabase
    .from('translations')
    .insert([...newTranslations, ...newEntries])
    .select('*');

  if (error) {
    return false;
  }

  return true;
}

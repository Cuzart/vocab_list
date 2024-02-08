import { Database } from '@/schema';

export type TranslationEntry = Omit<Database['public']['Tables']['translations']['Row'], 'id'> & {
  id: string | number;
};
export type LanguageEnum = Database['public']['Enums']['languages'];

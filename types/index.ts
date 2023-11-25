import { Database } from '@/schema';

export type TranslationEntry = Database['public']['Tables']['translations']['Row'];
export type LanguageEnum = Database['public']['Enums']['languages'];

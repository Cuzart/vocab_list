'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function deleteUser(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) {
    return false;
  }

  return true;
}

import { createClient } from '@/utils/supabase/middleware';
import { NextRequest } from 'next/server';

export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|[-A-Za-z\\d_]+.png|[-A-Za-z\\d_]+.jpg|manifest.json).*)',
};

export async function middleware(req: NextRequest) {
  const { supabase, response } = createClient(req);

  // // Refresh session if expired - required for Server Components
  // // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession();

  return response;
}

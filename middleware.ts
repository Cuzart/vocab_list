import { createClient } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher:
    '/((?!api|auth|_next/static|_next/image|favicon.ico|[-A-Za-z\\d_]+.png|[-A-Za-z\\d_]+.jpg|manifest.json).*)',
};

export async function middleware(req: NextRequest) {
  const { supabase, response } = createClient(req);
  const user = (await supabase.auth.getUser()).data.user;

  const triesToAccessUnprotectedArea =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/imprint') ||
    req.nextUrl.pathname.startsWith('/privacy') ||
    req.nextUrl.pathname.startsWith('/password-reset');

  const triesToAccessProtectedArea = !triesToAccessUnprotectedArea;

  if (triesToAccessUnprotectedArea && user) {
    // paths without the need for authentication
    return NextResponse.redirect(new URL('/', req.url), { status: 302 });
  } else if (triesToAccessProtectedArea && !user) {
    // wants to access something that is protected but is NOT logged in,
    return NextResponse.redirect(new URL('/login', req.url), { status: 302 });
  }

  return response;
}

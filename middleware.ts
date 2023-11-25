import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|[-A-Za-z\\d_]+.png|[-A-Za-z\\d_]+.jpg|manifest.json).*)',
};

export async function middleware(req: NextRequest) {
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(req);

    // // Refresh session if expired - required for Server Components
    // // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const { data } = await supabase.auth.getSession();
    console.log(1);

    // const user = data.session?.user;

    // if (user) {
    //   return NextResponse.redirect(new URL('/', req.url), { status: 302 });
    // } else if (!user) {
    //   return NextResponse.redirect(new URL('/login', req.url), { status: 302 });
    // }
    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    });
  }
}

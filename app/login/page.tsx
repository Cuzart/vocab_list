import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Box, Button, Center, Container, PasswordInput, TextInput, Title } from '@mantine/core';

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/');
  };

  const signUp = async (formData: FormData) => {
    'use server';

    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/login?message=Check email to continue sign in process');
  };

  return (
    <main>
      <Container pos={'relative'}>
        <Center component='form' h={'100dvh'} w={'100%'} py={160} action={signIn}>
          <Box w={'500px'}>
            <Title ta={'center'} mb={30}>
              Login
            </Title>
            <TextInput mb={20} label='Email' name='email' required />
            <PasswordInput mb={30} label='Passwort' name='password' required />
            <Button fullWidth>Sign In</Button>
            {/* <Button formAction={signUp}>Sign Up</Button> */}

            {searchParams?.message && (
              <p className='mt-4 p-4 bg-foreground/10 text-foreground text-center'>
                {searchParams.message}
              </p>
            )}
          </Box>
        </Center>
      </Container>
    </main>
  );
}

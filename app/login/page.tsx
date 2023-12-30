import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Alert, Box, Button, Center, PasswordInput, TextInput, Title } from '@mantine/core';

export default async function Login({ searchParams }: { searchParams: { message: string } }) {
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

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/');

  return (
    <Center component='form' h={'100dvh'} w={'100%'} py={160} px={20} action={signIn}>
      <Box w={'500px'}>
        <Title ta={'center'} mb={30}>
          Login
        </Title>
        <TextInput mb={20} label='Email' name='email' required />
        <PasswordInput mb={30} label='Passwort' name='password' required />
        <Alert mb={20} title={searchParams.message} hidden={!searchParams?.message} color='red' />

        <Button type='submit' fullWidth mb={20}>
          Sign In
        </Button>
        <Button type='submit' formAction={signUp} variant='subtle' fullWidth>
          Sign Up
        </Button>
      </Box>
    </Center>
  );
}

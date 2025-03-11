import { Footer } from '@/components/Footer/Footer';
import { createClient } from '@/utils/supabase/server';
import { Alert, Anchor, Box, Button, Center, PasswordInput, TextInput, Title } from '@mantine/core';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
      return redirect('/login?message=Bitte überprüfe deine Anmeldedaten');
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
      console.log(error);
      return redirect('/login?message=Bitte überprüfe deine Anmeldedaten');
    }

    return redirect('/');
  };

  return (
    <>
      <Center component='form' h={'calc(100dvh - 3.75rem)'} w={'100%'} py={160} px={20}>
        <Box w={'500px'}>
          <Title ta={'center'} mb={30}>
            Login
          </Title>
          <TextInput mb={20} label='Email' name='email' required />
          <PasswordInput mb={30} label='Passwort' name='password' required />
          <Alert mb={20} title={searchParams.message} hidden={!searchParams?.message} color='red' />

          <Anchor
            display={'block'}
            ta={'center'}
            component={Link}
            href='/password-reset'
            mb={20}
            variant='subtle'
          >
            Passwort vergessen?
          </Anchor>
          <Button type='submit' formAction={signIn} fullWidth mb={20}>
            Sign In
          </Button>
          <Button type='submit' variant='subtle' formAction={signUp} fullWidth>
            Sign Up
          </Button>
        </Box>
      </Center>

      <Footer />
    </>
  );
}

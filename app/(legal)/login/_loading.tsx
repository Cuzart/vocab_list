import { Anchor, Box, Button, Center, PasswordInput, TextInput, Title } from '@mantine/core';
import Link from 'next/link';

export default async function Index() {
  return (
    <Center component='form' h={'calc(100dvh - 3.75rem)'} w={'100%'} py={160} px={20}>
      <Box w={'500px'}>
        <Title ta={'center'} mb={30}>
          Login
        </Title>
        <TextInput disabled mb={20} label='Email' name='email' required />
        <PasswordInput disabled mb={30} label='Passwort' name='password' required />

        <Anchor
          display={'block'}
          ta={'center'}
          component={Link}
          href='/password-reset'
          mb={20}
          variant='subtle'
          style={{ visibility: 'hidden' }}
        >
          Passwort vergessen?
        </Anchor>
        <Button type='submit' fullWidth mb={20}></Button>
      </Box>
    </Center>
  );
}

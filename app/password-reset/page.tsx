import { Box, TextInput, Title } from '@mantine/core';
import { PasswordResetForm } from './PasswordResetForm';

export default async function Index() {
  return (
    <Box py={120} h={'100dvh'} px={20}>
      <Title>Passwort zurücksetzen</Title>
      <PasswordResetForm />
    </Box>
  );
}

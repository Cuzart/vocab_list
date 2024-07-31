import { BackButton } from '@/components/BackButton';
import { Box, Title } from '@mantine/core';
import { PasswordResetForm } from './PasswordResetForm';

export default async function Index() {
  return (
    <Box py={120} h={'100dvh'} px={20}>
      <BackButton />

      <Title>Passwort zurücksetzen</Title>
      <PasswordResetForm />
    </Box>
  );
}

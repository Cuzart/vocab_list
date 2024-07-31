'use client';

import { createClient } from '@/utils/supabase/client';
import { Button, Text, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useState } from 'react';

export const PasswordResetForm = () => {
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail('Bitte gib eine gültige Email ein.'),
    },
  });

  const supabase = createClient();

  const resetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(form.values.email, {
      redirectTo: window.location.origin + '/account?mode=pw',
    });

    if (error) {
      console.error(error);
    } else {
      setResetted(true);
    }
  };

  const [resetted, setResetted] = useState(false);

  return (
    <>
      {resetted ? (
        <Text mt={40}>Wir haben dir eine Email gesendet um dein Passwort zurückzusetzen.</Text>
      ) : (
        <>
          <TextInput
            my={40}
            label='Deine Email'
            placeholder='Deine Email'
            {...form.getInputProps('email')}
          />
          <Button
            mx={'auto'}
            display={'block'}
            disabled={!form.isValid()}
            onClick={() => resetPassword()}
          >
            Zurücksetzen
          </Button>
        </>
      )}
    </>
  );
};

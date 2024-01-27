'use client';

import { AppHeader } from '@/components/AppContent/AppContent';
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Modal,
  PasswordInput,
  TextInput,
  ButtonProps,
} from '@mantine/core';
import React, { Fragment, useState } from 'react';
import classes from './AccountForm.module.css';
import { User } from '@supabase/supabase-js';
import {
  IconCheck,
  IconEditCircle,
  IconLogout,
  IconMail,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { hasLength, isEmail, matchesField, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteUser } from '@/actions/deleteUser';
import useBoop from '@/hooks/useBoop';
import { animated } from 'react-spring';

type Props = {
  user: User;
  isPwChange?: boolean;
};

export const AccountForm = ({ user, isPwChange }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const supabase = createClient();
  const params = useSearchParams();
  const router = useRouter();
  const [changePassword, setChangePassword] = useState<string | null>(
    params.get('mode') === 'pw' ? 'password' : null
  );

  const form = useForm({
    initialValues: {
      email: user.email,
      newEmail: '',
      password: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      email: isEmail('Bitte gib eine gültige E-Mail-Adresse ein'),
      newEmail: isEmail('Bitte gib eine gültige E-Mail-Adresse ein'),
      password: hasLength({ min: 6 }, 'Das Passwort muss mindestens 6 Zeichen lang sein'),
      confirmPassword: matchesField('password', 'Passwörter stimmen nicht überein'),
    },
  });

  const handleUpdate = async () => {
    if (changePassword === 'email') {
      await supabase.auth.updateUser({ email: form.values.newEmail });
    }
    if (changePassword === 'password') {
      await supabase.auth.updateUser({ password: form.values.password });
    }

    setChangePassword(null);
    router.refresh();
  };

  const handleDelete = async () => {
    const result = await deleteUser(user.id);
    close();

    if (result) {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <Box className={classes.container}>
        <AppHeader />

        <Flex justify={'space-between'} align={'flex-end'} style={{ flexWrap: 'wrap' }} gap={30}>
          <Box style={{ flexGrow: 1, alignSelf: 'flex-start' }}>
            <Text fz={20} fw={700} mb={20}>
              Profil-Einstellungen
            </Text>

            <TextInput
              maw={400}
              w={'100%'}
              label='Email Adresse'
              readOnly
              required
              mb={16}
              {...form.getInputProps('email')}
            />
            {changePassword === 'email' && (
              <TextInput
                maw={400}
                w={'100%'}
                label='Neue Email Adresse'
                required
                {...form.getInputProps('newEmail')}
              />
            )}

            {changePassword === 'password' && (
              <Fragment>
                <Divider w={'100%'} maw={400} my={20} />

                <Text fz={20} fw={700} mb={20}>
                  Passwort ändern
                </Text>

                <PasswordInput
                  maw={400}
                  w={'100%'}
                  label='Neues Passwort'
                  required
                  mb={16}
                  {...form.getInputProps('password')}
                />
                <PasswordInput
                  maw={400}
                  w={'100%'}
                  label='Passwort wiederholen'
                  required
                  {...form.getInputProps('confirmPassword')}
                />
              </Fragment>
            )}
            <Flex mt={20} justify={'space-between'} gap={10} w={'100%'} maw={400}>
              {changePassword !== null && (
                <>
                  <Button
                    leftSection={<IconX />}
                    onClick={() => setChangePassword(null)}
                    variant='subtle'
                    color={'gray'}
                    children='Abbrechen'
                  />
                  <Button
                    leftSection={<IconCheck />}
                    onClick={() => handleUpdate()}
                    variant='subtle'
                    children='Speichern'
                  />
                </>
              )}
            </Flex>
          </Box>

          <Flex direction={'column'} align={'flex-start'} gap={10}>
            <BoopButton
              icon={<IconMail />}
              onClick={() => setChangePassword('email')}
              color={'gray'}
              variant={'subtle'}
              children={'Email ändern'}
            />
            <BoopButton
              icon={<IconEditCircle />}
              onClick={() => setChangePassword('password')}
              color={'gray'}
              variant={'subtle'}
              children={'Passwort ändern'}
            />
            <BoopButton
              icon={<IconLogout />}
              color={'gray'}
              variant={'subtle'}
              children={'Logout'}
              onClick={handleLogout}
            />
            <BoopButton
              icon={<IconTrash />}
              onClick={open}
              color={'red'}
              variant={'subtle'}
              children={'Account löschen'}
            />
          </Flex>
        </Flex>
      </Box>

      <Modal opened={opened} onClose={close} title='Account wirklich löschen?'>
        Bist du dir sicher dass du deinen Account und alle deine Daten unwiderruflich löschen
        möchtest?
        <Flex mt={20} justify={'space-between'} gap={10}>
          <Button
            leftSection={<IconX />}
            onClick={close}
            variant='subtle'
            color={'gray'}
            children='Abbrechen'
          />
          <Button
            leftSection={<IconCheck />}
            onClick={handleDelete}
            variant='subtle'
            color='red'
            children='Ja, löschen'
          />
        </Flex>
      </Modal>
    </>
  );
};

const BoopButton = ({
  icon,
  ...props
}: ButtonProps & { icon: React.ReactNode; onClick: () => void }) => {
  const [style, trigger] = useBoop({ rotation: 5, timing: 300 });
  return (
    <Button
      leftSection={<animated.div style={style}>{icon}</animated.div>}
      onMouseEnter={trigger}
      {...props}
    />
  );
};

'use client';

import { deleteUser } from '@/actions/deleteUser';
import { AppHeader } from '@/components/AppContent/AppContent';
import { countryData } from '@/components/CountryPicker/CountryPicker';
import { createClient } from '@/utils/supabase/client';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  MultiSelect,
  PasswordInput,
  Slider,
  Text,
  TextInput,
} from '@mantine/core';
import { hasLength, isEmail, matchesField, useForm } from '@mantine/form';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { User } from '@supabase/supabase-js';
import {
  IconCheck,
  IconEditCircle,
  IconLogout,
  IconMail,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { BatchImport } from '../BatchImport/BatchImport';
import { BoopButton } from '../BoopButton/BoopButton';
import classes from './AccountForm.module.css';
import { LanguageEnum } from '@/types';

type Props = {
  user: User;
  profileData: { languages: string[]; repetitions: number } | null;
};

export const AccountForm = ({ user, profileData }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const supabase = createClient();
  const params = useSearchParams();
  const router = useRouter();
  const [changePassword, setChangePassword] = useState<string | null>(
    params.get('mode') === 'pw' ? 'password' : null
  );

  const [value, setValue] = useState<string[]>(profileData?.languages || []);
  const [debouncedValue] = useDebouncedValue(value, 2000);
  const [sliderValue, setSliderValue] = useState<number>(profileData?.repetitions || 5);
  const [searchValue, setSearchValue] = useState('');

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
    toast.success('Profil aktualisiert');
  };

  const handleDelete = async () => {
    const result = await deleteUser(user.id);

    if (result) {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleProfileUpdate = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ languages: value, repetitions: sliderValue })
      .eq('user_id', user.id);

    if (!error) toast.success('Änderung gespeichert');
  };

  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      handleProfileUpdate();
    } else {
      isMountingRef.current = false;
    }
  }, [debouncedValue]);

  return (
    <>
      <Box className={classes.container}>
        <AppHeader />

        <Flex
          justify={'space-between'}
          align={'center'}
          style={{ flexWrap: 'wrap' }}
          gap={30}
          pb={50}
        >
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

            <Box maw={400}>
              <Text mt={30} fz={20} fw={700} mb={20}>
                App-Einstellungen
              </Text>
              <MultiSelect
                mb={30}
                label='Sprachen'
                data={countryData.filter((entry) => entry.value !== 'de')}
                value={value}
                onChange={setValue}
                hidePickedOptions
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchable
              />

              <Text size='sm' mb={7} fw={500}>
                Wiederholungen bis zur Löschung
              </Text>
              <Slider
                mb={30}
                min={1}
                max={10}
                step={1}
                value={sliderValue}
                onChange={setSliderValue}
                onChangeEnd={handleProfileUpdate}
                marks={[
                  { value: 1, label: '1' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                ]}
              />
              <BatchImport languages={value as LanguageEnum[]} />
            </Box>
          </Box>

          <Flex
            direction={'column'}
            align={'flex-start'}
            gap={10}
            pb={'env(safe-area-inset-bottom)'}
          >
            <BoopButton
              className={classes.button}
              icon={<IconMail />}
              onClick={() => setChangePassword('email')}
              color={'gray'}
              variant={'subtle'}
              children={'Email ändern'}
              disabled={changePassword === 'email'}
              data-mode={changePassword === 'email' ? 'active' : undefined}
            />
            <BoopButton
              className={classes.button}
              disabled={changePassword === 'password'}
              icon={<IconEditCircle />}
              onClick={() => setChangePassword('password')}
              color={'gray'}
              variant={'subtle'}
              children={'Passwort ändern'}
              data-mode={changePassword === 'password' ? 'active' : undefined}
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

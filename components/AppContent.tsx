'use client';

import { Box, Flex, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import React from 'react';
import { HideToggle } from './HideToggle/HideToggle';
import { CountryPicker } from './CountryPicker/CountryPicker';
import { ThemeToggle } from './ThemeToggle/ThemeToggle';
import { TranslationItem } from './TranslationItem/TranslationItem';
import { ChatInput } from './ChatInput/ChatInput';
import { useLocalStorage } from '@mantine/hooks';
import { IconVocabulary } from '@tabler/icons-react';
import { LanguageEnum, TranslationEntry } from '@/types';

type Props = {
  entries: TranslationEntry[];
};

export const AppContent = ({ entries }: Props) => {
  const [hidden, setHidden] = useLocalStorage({ key: 'hidden', defaultValue: true });
  const [language, setLanguage] = useLocalStorage<LanguageEnum>({
    key: 'language',
    defaultValue: 'en',
  });

  const filteredEntries = entries
    ?.filter((entry) => entry.language === language)
    ?.sort((a, b) => b.count - a.count);

  return (
    <>
      <Box pt={60} h={'calc(100vh - 82px)'}>
        <Group justify={'space-between'} mb={50}>
          <Flex align={'center'} gap={5}>
            <ThemeIcon size={40} variant='transparent'>
              <IconVocabulary size={36} />
            </ThemeIcon>
            <Title>Vocabulist</Title>
          </Flex>
          <Flex gap={10}>
            <HideToggle hidden={hidden} setHidden={setHidden} />
            <ThemeToggle />
            <CountryPicker language={language} setLanguage={setLanguage} />
          </Flex>
        </Group>

        <Stack mt={30}>
          {filteredEntries?.map((note) => (
            <TranslationItem
              id={note.id}
              key={note.original}
              original={note.original}
              translation={note.translation}
              visible={!hidden}
              count={note.count}
            />
          ))}
        </Stack>

        {filteredEntries?.length === 0 && <Text ta='center'>Keine Einträge</Text>}
      </Box>
      <ChatInput language={language} />
    </>
  );
};

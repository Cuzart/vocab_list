'use client';

import { Box, Flex, Group, ScrollArea, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import React, { useState } from 'react';
import { HideToggle } from '../HideToggle/HideToggle';
import { CountryPicker } from '../CountryPicker/CountryPicker';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { TranslationItem } from '../TranslationItem/TranslationItem';
import { ChatInput } from '../ChatInput/ChatInput';
import { useLocalStorage, useMediaQuery, useWindowScroll } from '@mantine/hooks';
import { IconVocabulary } from '@tabler/icons-react';
import { LanguageEnum, TranslationEntry } from '@/types';
import classes from './AppContent.module.css';

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

  const matches = useMediaQuery('(min-width: 640px)');
  const [scroll] = useWindowScroll();
  return (
    <>
      <Box pos={'relative'} px={20}>
        <Group
          className={classes.header}
          mt={30}
          justify={'space-between'}
          mb={30}
          data-compact={scroll.y > 10 ? 'true' : 'false'}
        >
          <Flex align={'center'} gap={5}>
            <ThemeIcon size={40} variant='transparent'>
              <IconVocabulary size={36} />
            </ThemeIcon>
            {matches && <Title>Vocabulist</Title>}
          </Flex>
          <Flex gap={10}>
            <HideToggle hidden={hidden} setHidden={setHidden} />
            <ThemeToggle />
            <CountryPicker language={language} setLanguage={setLanguage} />
          </Flex>
        </Group>

        <Stack className={classes.stack} mt={0} pb={10} mih={`calc(100vh - 62px)`}>
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
        <ChatInput language={language} />
      </Box>
    </>
  );
};

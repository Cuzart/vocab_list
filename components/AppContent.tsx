'use client';

import { Box, Flex, Stack, Title } from '@mantine/core';
import React, { useState } from 'react';
import { HideToggle } from './HideToggle/HideToggle';
import { CountryPicker } from './CountryPicker/CountryPicker';
import { ThemeToggle } from './ThemeToggle/ThemeToggle';
import { TranslationItem } from './TranslationItem/TranslationItem';
import { ChatInput } from './ChatInput/ChatInput';
import { useLocalStorage } from '@mantine/hooks';

export const AppContent = ({ notes }) => {
  const [hidden, setHidden] = useLocalStorage({ key: 'hidden', defaultValue: true });
  const [language, setLanguage] = useLocalStorage({
    key: 'language',
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });

  return (
    <>
      <Box pt={60} h={'calc(100vh - 82px)'}>
        <Flex justify={'space-between'} mb={50}>
          <Title>Vokabeln</Title>
          <Flex gap={10}>
            <HideToggle hidden={hidden} setHidden={setHidden} />
            <ThemeToggle />
            <CountryPicker language={language} setLanguage={setLanguage} />
          </Flex>
        </Flex>

        <Stack mt={30}>
          {notes
            .filter((note) => note.language === language)
            .sort((a, b) => b.count - a.count)
            ?.map((note) => (
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
      </Box>
      <ChatInput language={language} />
    </>
  );
};

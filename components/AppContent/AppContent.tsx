'use client';

import { Box, Center, Flex, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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

  const filteredEntries = useMemo(
    () =>
      entries?.filter((entry) => entry.language === language)?.sort((a, b) => b.count - a.count),
    [entries, language]
  );

  const matches = useMediaQuery('(min-width: 640px)');

  const isScrolledDownRef = useRef(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  // to avoid using scroll position as state which causes unnecessary rerenders
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 && !isScrolledDownRef.current) {
        isScrolledDownRef.current = true;
        setIsScrolledDown(true);
      }
      if (window.scrollY <= 10 && isScrolledDownRef.current) {
        isScrolledDownRef.current = false;
        setIsScrolledDown(false);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Box pos={'relative'} px={20}>
        <Group
          className={classes.header}
          mt={30}
          justify={'space-between'}
          mb={30}
          data-compact={isScrolledDown ? 'true' : 'false'}
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

        <Stack
          className={classes.stack}
          mt={0}
          pb={10}
          mih={`calc(100dvh - 62px - env(safe-area-inset-bottom))`}
        >
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
          {filteredEntries?.length === 0 && (
            <Center h={'75vh'} ta='center'>
              Keine Einträge
            </Center>
          )}
        </Stack>

        <ChatInput language={language} />
      </Box>
    </>
  );
};

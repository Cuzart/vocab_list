'use client';

import { ActionIcon, Box, Center, Flex, Group, Stack, ThemeIcon, Title } from '@mantine/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HideToggle } from '../HideToggle/HideToggle';
import { CountryPicker } from '../CountryPicker/CountryPicker';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { TranslationItem } from '../TranslationItem/TranslationItem';
import { ChatInput } from '../ChatInput/ChatInput';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { IconUser, IconVocabulary } from '@tabler/icons-react';
import { LanguageEnum, TranslationEntry } from '@/types';
import classes from './AppContent.module.css';
import Link from 'next/link';
import useBoop from '@/hooks/useBoop';
import { animated } from 'react-spring';
import { SoundToggle } from '../SoundToggle/SoundToggle';

type Props = {
  entries: TranslationEntry[];
};

export const AppContent = ({ entries: initialEntries }: Props) => {
  const [hidden, setHidden] = useLocalStorage({ key: 'hidden', defaultValue: true });
  const [switched, setSwitched] = useLocalStorage({ key: 'switched', defaultValue: false });
  const [language, setLanguage] = useLocalStorage<LanguageEnum>({
    key: 'language',
    defaultValue: 'en',
  });
  // needs to be reset because iOS needs a button event to trigger the first speech synthesis utterance
  const [allowSound, setAllowSound] = useState(false);

  const [entries, setEntries] = useState<TranslationEntry[] | undefined>(initialEntries);
  const filteredEntries = useMemo(
    () => entries?.filter((entry) => entry.language === language),
    [entries, language]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 9999, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Box pos={'relative'} style={{ overflowX: 'hidden' }}>
        <AppHeader
          hidden={hidden}
          setHidden={setHidden}
          language={language}
          setLanguage={setLanguage}
          allowSound={allowSound}
          setAllowSound={setAllowSound}
          isIndex
        />
        <Stack
          ref={containerRef}
          className={classes.stack}
          h={`calc(100dvh - 62px - env(safe-area-inset-bottom))`}
          mah={`calc(100dvh - 62px - env(safe-area-inset-bottom))`}
        >
          {filteredEntries?.map((note) => (
            <TranslationItem
              id={note.id}
              key={note.id}
              original={note.original}
              translation={note.translation}
              visible={!hidden}
              count={note.count}
              setEntries={setEntries}
              switched={switched}
              language={language}
              allowSound={allowSound}
            />
          ))}
          {filteredEntries?.length === 0 && (
            <Center h={'75dvh'} ta='center'>
              Keine Einträge
            </Center>
          )}
        </Stack>
        <ChatInput
          language={language}
          setEntries={setEntries}
          switched={switched}
          setSwitched={setSwitched}
          afterSubmit={scrollDown}
        />
      </Box>
    </>
  );
};

type AppHeaderProps = {
  hidden: boolean;
  setHidden: (value: boolean) => void;
  language: LanguageEnum;
  setLanguage: (value: LanguageEnum) => void;
  isIndex?: boolean;
  allowSound: boolean;
  setAllowSound: (value: boolean) => void;
};

export const AppHeader = ({
  hidden,
  setHidden,
  language,
  setLanguage,
  isIndex = false,
  allowSound,
  setAllowSound,
}: Partial<AppHeaderProps>) => {
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

  const [style, trigger] = useBoop({ rotation: 10, timing: 300 });

  return (
    <Group
      className={classes.header}
      mt={30}
      justify={'space-between'}
      mb={30}
      data-compact={isScrolledDown ? 'true' : 'false'}
    >
      <Link href='/' style={{ textDecoration: 'none' }}>
        <Flex align={'center'} gap={5}>
          <ThemeIcon size={36} variant='transparent'>
            <IconVocabulary size={36} />
          </ThemeIcon>
          {matches && <Title className={classes.title}>Vocabulist</Title>}
        </Flex>
      </Link>
      <Flex gap={10}>
        {setAllowSound && <SoundToggle allowSound={allowSound!} setAllowSound={setAllowSound!} />}
        {setHidden && <HideToggle hidden={hidden!} setHidden={setHidden} />}
        {!isIndex && <ThemeToggle />}
        {setLanguage && <CountryPicker language={language!} setLanguage={setLanguage} />}
        {isIndex && (
          <ActionIcon
            component={Link}
            href={'/account'}
            size={40}
            className={classes.actionIcon}
            onMouseEnter={trigger}
          >
            <animated.div style={style}>
              <IconUser size={22} />
            </animated.div>
          </ActionIcon>
        )}
      </Flex>
    </Group>
  );
};

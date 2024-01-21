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

  const [entries, setEntries] = useState<TranslationEntry[] | undefined>(initialEntries);
  const filteredEntries = useMemo(
    () => entries?.filter((entry) => entry.language === language),
    [entries, language]
  );

  return (
    <>
      <Box pos={'relative'} px={20}>
        <AppHeader
          hidden={hidden}
          setHidden={setHidden}
          language={language}
          setLanguage={setLanguage}
          isIndex
        />
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
              setEntries={setEntries}
              switched={switched}
            />
          ))}
          {filteredEntries?.length === 0 && (
            <Center h={'75vh'} ta='center'>
              Keine Einträge
            </Center>
          )}
        </Stack>

        <ChatInput
          language={language}
          setEntries={setEntries}
          switched={switched}
          setSwitched={setSwitched}
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
};

export const AppHeader = ({
  hidden,
  setHidden,
  language,
  setLanguage,
  isIndex = false,
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

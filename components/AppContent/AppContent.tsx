'use client';

import { ActionIcon, Text, Box, Center, Flex, Group, Stack, ThemeIcon, Title } from '@mantine/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HideToggle } from '../HideToggle/HideToggle';
import { CountryPicker } from '../CountryPicker/CountryPicker';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { TranslationItem } from '../TranslationItem/TranslationItem';
import { ChatInput } from '../ChatInput/ChatInput';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft, IconUser, IconVocabulary } from '@tabler/icons-react';
import { LanguageEnum, TranslationEntry } from '@/types';
import classes from './AppContent.module.css';
import Link from 'next/link';
import useBoop from '@/hooks/useBoop';
import { animated } from 'react-spring';
import { SoundToggle } from '../SoundToggle/SoundToggle';
import Image from 'next/image';
import EmptyState from '@/public/empty.svg';
import { usePathname } from 'next/navigation';

type Props = {
  entries: TranslationEntry[];
  profileData: { languages: LanguageEnum[]; repetitions: number } | null;
};

export const AppContent = ({ entries: initialEntries, profileData }: Props) => {
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
      <Box pos={'relative'}>
        <AppHeader
          hidden={hidden}
          setHidden={setHidden}
          language={language}
          setLanguage={setLanguage}
          allowSound={allowSound}
          setAllowSound={setAllowSound}
          isIndex
          languages={profileData?.languages}
        />
        <Stack
          ref={containerRef}
          className={classes.stack}
          // h={`calc(100dvh - 62px - env(safe-area-inset-bottom))`}
          // mah={`calc(100dvh - 62px - env(safe-area-inset-bottom))`}
        >
          {filteredEntries?.map((note) => (
            <TranslationItem
              id={note.id}
              key={note.keyId || note.id}
              original={note.original}
              translation={note.translation}
              visible={!hidden}
              count={note.count}
              setEntries={setEntries}
              switched={switched}
              language={language}
              allowSound={allowSound}
              repetitionLimit={profileData?.repetitions}
            />
          ))}
          {filteredEntries?.length === 0 && (
            <Center h={'100%'} ta={'center'}>
              <div>
                <Image width={300} height={250} src={EmptyState} alt={''} priority />
                <Text>Noch keine Einträge</Text>
              </div>
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
  languages?: LanguageEnum[];
};

export const AppHeader = ({
  hidden,
  setHidden,
  language,
  setLanguage,
  isIndex = false,
  allowSound,
  setAllowSound,
  languages,
}: Partial<AppHeaderProps>) => {
  const matches = useMediaQuery('(min-width: 640px)');
  const pathname = usePathname();

  const [style, trigger] = useBoop({ rotation: 10, timing: 300 });

  const isScrolledDownRef = useRef(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  // to avoid using scroll position as state which causes unnecessary rerenders
  useEffect(() => {
    const handleScroll = (event: any) => {
      const y = window.scrollY;
      if (y > 30 && !isScrolledDownRef.current) {
        isScrolledDownRef.current = true;
        setIsScrolledDown(true);
      }
      if (y <= 30 && isScrolledDownRef.current) {
        isScrolledDownRef.current = false;
        setIsScrolledDown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <Group
      className={classes.header}
      mt={30}
      justify={'space-between'}
      mb={30}
      data-compact={isScrolledDown ? 'true' : 'false'}
    >
      <Link href='/' style={{ textDecoration: 'none' }}>
        <Flex
          className={classes.logoWrapper}
          data-account={pathname === '/account' ? true : undefined}
          align={'center'}
          gap={5}
          pos={'relative'}
        >
          <ThemeIcon className={classes.icon} variant='transparent'>
            <IconArrowLeft size={24} stroke={2.5} />
          </ThemeIcon>
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
        {setLanguage && (
          <CountryPicker language={language!} setLanguage={setLanguage} languages={languages} />
        )}
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

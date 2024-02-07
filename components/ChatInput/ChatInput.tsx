import { ActionIcon, Group, TextInput } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import React, { useState } from 'react';
import classes from './ChatInput.module.css';
import { getHotkeyHandler } from '@mantine/hooks';
import { createTranslation } from '../../actions/createTranslation';
import { countryData } from '../CountryPicker/CountryPicker';
import { TranslationEntry } from '@/types';
import { DirectionToggle } from '../DirectionToggle/DirectionToggle';

type ChatInputProps = {
  language: string;
  setEntries: React.Dispatch<React.SetStateAction<TranslationEntry[] | undefined>>;
  switched: boolean;
  setSwitched: (hidden: boolean) => void;
  afterSubmit?: () => void;
};

export const ChatInput = ({
  language,
  setEntries,
  switched,
  setSwitched,
  afterSubmit,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const isReadyToBeSent = message.length > 0;

  const handleSubmit = async () => {
    if (isReadyToBeSent) {
      setMessage('');

      setEntries((prevState) => [
        ...prevState!,
        {
          original: switched ? '...' : message,
          translation: switched ? message : '...',
          created_by: '1',
          language: language,
        } as TranslationEntry,
      ]);

      setTimeout(() => {
        afterSubmit && afterSubmit();
      }, 300);

      const res = await createTranslation({
        text: message,
        source: language,
        target: 'de',
        switched,
      });

      if (res) {
        setEntries((prevState) => {
          const newEntries = [...prevState!];
          newEntries.pop();
          newEntries.push(res as TranslationEntry);
          return newEntries;
        });
      }
    }
  };

  return (
    <Group className={classes.container} wrap='nowrap' gap={0}>
      <TextInput
        classNames={{ input: classes.input }}
        placeholder={`Wort auf ${
          switched ? 'Deutsch' : countryData.find((c) => c.value === language)?.label
        }`}
        size='md'
        w={'100%'}
        radius={'sm'}
        leftSection={<DirectionToggle switched={switched} setSwitched={setSwitched} />}
        leftSectionWidth={50}
        rightSection={
          <ActionIcon
            radius={6}
            size={'lg'}
            variant={isReadyToBeSent ? 'light' : 'transparent'}
            color={isReadyToBeSent ? 'violet.4' : 'gray.4'}
            opacity={1}
            onClick={() => handleSubmit()}
            style={{
              transition: 'all 0.2s ease',
              transform: isReadyToBeSent ? 'translateX(0px)' : 'translateX(-4px)',
            }}
          >
            <IconArrowNarrowRight />
          </ActionIcon>
        }
        value={message}
        onChange={(event) => {
          setMessage(event.currentTarget.value);
        }}
        onKeyDown={getHotkeyHandler([['Enter', () => handleSubmit()]])}
      />
    </Group>
  );
};

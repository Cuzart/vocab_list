import { TranslationEntry } from '@/types';
import { ActionIcon, Box, Container, TextInput } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createTranslation } from '../../actions/createTranslation';
import { countryData } from '../CountryPicker/CountryPicker';
import { DirectionToggle } from '../DirectionToggle/DirectionToggle';
import classes from './ChatInput.module.css';
import useBoop from '@/hooks/useBoop';

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
      const id: string = uuidv4();

      setEntries((prevState) => [
        ...prevState!,
        {
          id,
          original: switched ? '...' : message,
          translation: switched ? message : '...',
          created_by: '1',
          language: language,
          keyId: id,
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
          newEntries[newEntries.length - 1] = {
            ...newEntries[newEntries.length - 1],
            ...res,
          };
          return newEntries;
        });
      }
    }
  };

  const [boopStyle, trigger] = useBoop({ rotation: 10, timing: 300 });

  return (
    <Box component={'form'} onSubmit={(e) => e.preventDefault()} className={classes.container}>
      <Container p={0}>
        <TextInput
          classNames={{ input: classes.input }}
          placeholder={`Wort auf ${
            switched ? 'Deutsch' : countryData.find((c) => c.value === language)?.label
          }`}
          size='md'
          w={'100%'}
          radius={'sm'}
          leftSection={
            <DirectionToggle switched={switched} setSwitched={setSwitched} boopStyle={boopStyle} />
          }
          leftSectionWidth={50}
          leftSectionProps={{
            onClick: () => {
              setSwitched(!switched);
              trigger();
            },
          }}
          rightSection={
            <ActionIcon
              type='submit'
              radius={6}
              size={'lg'}
              variant={isReadyToBeSent ? 'light' : 'transparent'}
              color={isReadyToBeSent ? 'violet.4' : 'gray.4'}
              opacity={1}
              onClick={() => handleSubmit()}
              style={{
                transition: 'all 0.2s ease',
                transform: isReadyToBeSent ? 'translateX(0px)' : 'translateX(-4px)',
                borderRadius: '50%',
              }}
            >
              <IconArrowNarrowRight />
            </ActionIcon>
          }
          value={message}
          onChange={(event) => {
            setMessage(event.currentTarget.value);
          }}
          // onKeyDown={getHotkeyHandler([['Enter', () => handleSubmit()]])}
        />
      </Container>
    </Box>
  );
};

import { ActionIcon, Group, TextInput } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import React, { useState } from 'react';
import classes from './ChatInput.module.css';
import { getHotkeyHandler } from '@mantine/hooks';
import { createTranslation } from '../../actions/createTranslation';
import { useRouter } from 'next/navigation';

type ChatInputProps = { language: string };

export const ChatInput = ({ language }: ChatInputProps) => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const isReadyToBeSent = message.length > 0;

  const handleSubmit = async () => {
    if (isReadyToBeSent) {
      setMessage('');
      const res = await createTranslation({ text: message, source: language, target: 'de' });
      res && router.refresh();
    }
  };

  return (
    <Group className={classes.container} wrap='nowrap' gap={0}>
      <TextInput
        classNames={{ input: classes.input }}
        size='lg'
        w={'100%'}
        radius={'sm'}
        rightSection={
          <ActionIcon
            radius={6}
            size={'xl'}
            variant={isReadyToBeSent ? 'light' : 'transparent'}
            color={isReadyToBeSent ? 'violet.4' : 'gray.4'}
            opacity={1}
            onClick={() => handleSubmit()}
            style={{ transition: 'all 0.2s ease' }}
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

import { ActionIcon, Transition } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import React from 'react';
import classes from './HideToggle.module.css';
import { rotate, rotateReverted } from '@/utils/animations';

type Props = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export const HideToggle = ({ hidden, setHidden }: Props) => {
  return (
    <ActionIcon
      className={classes.button}
      size={'xl'}
      color='gray'
      onClick={() => setHidden(!hidden)}
      variant='outline'
    >
      <Transition mounted={hidden} transition={rotate}>
        {(style) => <IconEye style={style} />}
      </Transition>
      <Transition mounted={!hidden} transition={rotateReverted}>
        {(style) => <IconEyeOff style={style} />}
      </Transition>
    </ActionIcon>
  );
};

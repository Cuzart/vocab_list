import { ActionIcon } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import React from 'react';
import classes from './HideToggle.module.css';

export const HideToggle = ({ hidden, setHidden }) => {
  return (
    <ActionIcon
      className={classes.button}
      size={'xl'}
      color='gray'
      onClick={() => setHidden(!hidden)}
      variant='outline'
    >
      {hidden ? <IconEye /> : <IconEyeOff />}
    </ActionIcon>
  );
};

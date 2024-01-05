import { ActionIcon, Indicator } from '@mantine/core';
import { IconArrowsLeftRight, IconFlag } from '@tabler/icons-react';
import React from 'react';
import classes from './DirectionToggle.module.css';

type Props = {
  switched: boolean;
  setSwitched: (hidden: boolean) => void;
};

export const DirectionToggle = ({ switched, setSwitched }: Props) => {
  return (
    <ActionIcon
      className={classes.button}
      size={40}
      color='gray'
      onClick={() => setSwitched(!switched)}
      variant='outline'
    >
      <Indicator disabled={!switched} size={8}>
        <IconArrowsLeftRight size={18} />
      </Indicator>
    </ActionIcon>
  );
};

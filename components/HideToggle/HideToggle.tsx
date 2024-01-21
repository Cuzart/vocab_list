import { ActionIcon, Transition } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import React from 'react';
import classes from './HideToggle.module.css';
import { rotate, rotateReverted } from '@/utils/animations';
import useBoop from '@/hooks/useBoop';
import { animated } from 'react-spring';

type Props = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export const HideToggle = ({ hidden, setHidden }: Props) => {
  const [boopStyle, trigger] = useBoop({ rotation: 10, timing: 300 });

  return (
    <ActionIcon
      className={classes.button}
      size={40}
      color='gray'
      onClick={() => setHidden(!hidden)}
      variant='outline'
      onMouseEnter={trigger}
    >
      <Transition mounted={hidden} transition={rotate}>
        {(style) => (
          <animated.div style={boopStyle}>
            <IconEye style={style} />
          </animated.div>
        )}
      </Transition>
      <Transition mounted={!hidden} transition={rotateReverted}>
        {(style) => (
          <animated.div style={boopStyle}>
            <IconEyeOff style={style} />
          </animated.div>
        )}
      </Transition>
    </ActionIcon>
  );
};

import { ActionIcon, Transition } from '@mantine/core';
import { IconVolume, IconVolumeOff } from '@tabler/icons-react';
import React from 'react';
import classes from './SoundToggle.module.css';
import { rotate, rotateReverted } from '@/utils/animations';
import useBoop from '@/hooks/useBoop';
import { animated } from 'react-spring';

type Props = {
  allowSound: boolean;
  setAllowSound: (allowSound: boolean) => void;
};

export const SoundToggle = ({ allowSound, setAllowSound }: Props) => {
  const [boopStyle, trigger] = useBoop({ rotation: 10, timing: 300 });

  return (
    <ActionIcon
      className={classes.button}
      size={40}
      color='gray'
      onClick={() => {
        if (!allowSound) {
          const utterance = new SpeechSynthesisUtterance('');
          window.speechSynthesis.speak(utterance);
        }
        setAllowSound(!allowSound);
      }}
      variant='outline'
      onMouseEnter={trigger}
    >
      <Transition mounted={allowSound} transition={rotate}>
        {(style) => (
          <animated.div style={boopStyle}>
            <IconVolume style={style} />
          </animated.div>
        )}
      </Transition>
      <Transition mounted={!allowSound} transition={rotateReverted}>
        {(style) => (
          <animated.div style={boopStyle}>
            <IconVolumeOff style={style} />
          </animated.div>
        )}
      </Transition>
    </ActionIcon>
  );
};

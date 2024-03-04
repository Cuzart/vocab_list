import useBoop from '@/hooks/useBoop';
import { ActionIcon, Indicator } from '@mantine/core';
import { IconArrowsLeftRight } from '@tabler/icons-react';
import { animated } from 'react-spring';
import classes from './DirectionToggle.module.css';

type Props = {
  switched: boolean;
  setSwitched: (hidden: boolean) => void;
};

export const DirectionToggle = ({ switched, setSwitched }: Props) => {
  const [boopStyle, trigger] = useBoop({ rotation: 10, timing: 300 });

  return (
    <ActionIcon
      className={classes.button}
      size={'lg'}
      color='gray'
      bg={'gray.0'}
      onClick={() => {
        setSwitched(!switched);
        trigger();
      }}
      variant='outline'
    >
      <Indicator disabled={!switched} size={8}>
        <animated.div style={boopStyle}>
          <IconArrowsLeftRight size={18} />
        </animated.div>
      </Indicator>
    </ActionIcon>
  );
};

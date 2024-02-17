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
      size={40}
      color='gray'
      onClick={() => setSwitched(!switched)}
      variant='outline'
      onMouseEnter={trigger}
    >
      <Indicator disabled={!switched} size={8}>
        <animated.div style={boopStyle}>
          <IconArrowsLeftRight size={18} />
        </animated.div>
      </Indicator>
    </ActionIcon>
  );
};

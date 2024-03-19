import { ActionIcon, Indicator } from '@mantine/core';
import { IconArrowsLeftRight } from '@tabler/icons-react';
import { animated } from 'react-spring';
import classes from './DirectionToggle.module.css';

type Props = {
  switched: boolean;
  setSwitched: (hidden: boolean) => void;
  boopStyle: React.CSSProperties;
};

export const DirectionToggle = ({ switched, boopStyle }: Props) => {
  return (
    <ActionIcon className={classes.button} size={'lg'} color='gray' variant='outline'>
      <Indicator disabled={!switched} size={8}>
        <animated.div style={boopStyle}>
          <IconArrowsLeftRight size={18} />
        </animated.div>
      </Indicator>
    </ActionIcon>
  );
};

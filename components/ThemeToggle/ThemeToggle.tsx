import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Group } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './ThemeToggle.module.css';
import useBoop from '@/hooks/useBoop';
import { animated } from 'react-spring';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const [style, trigger] = useBoop({ rotation: 10, timing: 300 });
  return (
    <Group justify='center'>
      <ActionIcon
        className={classes.button}
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant='outline'
        size={40}
        aria-label='Toggle color scheme'
        color='gray'
        onMouseEnter={trigger}
      >
        <animated.div style={style}>
          <IconSun className={[classes.icon, classes.rotate].join(' ')} style={style} />
        </animated.div>
        <animated.div style={style}>
          <IconMoon className={[classes.icon, classes.rotateReverted].join(' ')} style={style} />
        </animated.div>
      </ActionIcon>
    </Group>
  );
}

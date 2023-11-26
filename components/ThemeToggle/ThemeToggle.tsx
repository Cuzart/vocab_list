import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group,
  Transition,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Group justify='center'>
      <ActionIcon
        className={classes.button}
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant='outline'
        size={40}
        aria-label='Toggle color scheme'
        color='gray'
      >
        <IconSun className={[classes.icon, classes.rotate].join(' ')} />
        <IconMoon className={[classes.icon, classes.rotateReverted].join(' ')} />
      </ActionIcon>
    </Group>
  );
}

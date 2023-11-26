import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group,
  Transition,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './ThemeToggle.module.css';
import { rotate, rotateReverted } from '@/utils/animations';

export function ThemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
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
        <Transition mounted={colorScheme === 'light'} transition={rotate}>
          {(style) => <IconSun style={style} />}
        </Transition>
        <Transition mounted={colorScheme === 'dark'} transition={rotateReverted}>
          {(style) => <IconMoon style={style} />}
        </Transition>
      </ActionIcon>
    </Group>
  );
}

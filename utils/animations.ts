import { MantineTransition } from '@mantine/core';

export const rotate: MantineTransition = {
  in: { opacity: 1, transform: 'translate(-50%, -50%) rotate(-360deg)' },
  out: { opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg)' },
  common: { position: 'absolute', top: '50%', left: '50%' },
  transitionProperty: 'transform, opacity',
};
export const rotateReverted: MantineTransition = {
  in: { opacity: 1, transform: 'translate(-50%, -50%) rotate(360deg)' },
  out: { opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg)' },
  common: { position: 'absolute', top: '50%', left: '50%' },
  transitionProperty: 'transform, opacity',
};

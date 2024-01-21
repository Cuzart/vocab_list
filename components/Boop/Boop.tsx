// components/Boop.jsx
import useBoop from '@/hooks/useBoop';
import React from 'react';
import { animated } from 'react-spring';

type Props = {
  children: React.ReactNode;
  rotation?: number;
  timing?: number;
};

export const Boop = ({ children, ...boopConfig }: Props) => {
  const [style, trigger] = useBoop(boopConfig);
  return (
    <animated.div onMouseEnter={trigger} style={style}>
      {children}
    </animated.div>
  );
};

'use client';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export const ClientProvider = ({ children }: Props) => {
  useEffect(() => {
    document.body.classList.remove('preload');
  }, []);
  return <>{children}</>;
};

import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export const BackButton = () => {
  return (
    <Button component={Link} variant='subtle' leftSection={<IconArrowLeft />} href='/'>
      Zurück
    </Button>
  );
};

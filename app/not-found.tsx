import { Button, Center, Text, Title } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import EmptyState from '@/public/empty.svg';

export default async function NotFound() {
  return (
    <>
      <Center h={'100dvh'} ta={'center'}>
        <div>
          <Title
            fz={280}
            mt={-40}
            lh={1}
            c={'violet'}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
              opacity: 0.5,
            }}
          >
            404
          </Title>
          <Image
            width={300}
            height={250}
            src={EmptyState}
            alt={''}
            priority
            style={{ position: 'relative' }}
          />

          <Text size='lg' fw={500} mb={20} maw={300} mx={'auto'} style={{ textWrap: 'balance' }}>
            Scheint als wärst du vom Pfad abgekommen
          </Text>
          <Button component={Link} href={'/'}>
            Zurück
          </Button>
        </div>
      </Center>
    </>
  );
}

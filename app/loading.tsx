import { Box, Flex, Group, Skeleton, Stack, ThemeIcon, Title } from '@mantine/core';
import { IconArrowLeft, IconVocabulary } from '@tabler/icons-react';
import Link from 'next/link';
import classes from '../components/AppContent/AppContent.module.css';

export default async function Index() {
  return (
    <Box pos={'relative'}>
      <Group className={classes.header} mt={30} justify={'space-between'} mb={30}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <Flex className={classes.logoWrapper} align={'center'} gap={5} pos={'relative'}>
            <ThemeIcon className={classes.icon} variant='transparent'>
              <IconArrowLeft size={24} stroke={2.5} />
            </ThemeIcon>
            <ThemeIcon size={36} variant='transparent'>
              <IconVocabulary size={36} />
            </ThemeIcon>
            <Title className={classes.title}>Vocabulist</Title>
          </Flex>
        </Link>
        <Flex gap={10}>
          <Skeleton width={40} height={40} />
        </Flex>
      </Group>

      <Stack className={classes.stack}>
        {Array.from(Array(5).keys()).map((note, index) => (
          <Flex key={note} align={'center'} justify={'space-between'} className={classes.entry}>
            <Skeleton opacity={1 - 0.2 * index} width={'100%'} height={56} />
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

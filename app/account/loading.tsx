import { Box, Flex, Group, Skeleton, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconArrowLeft, IconVocabulary } from '@tabler/icons-react';
import Link from 'next/link';
import classes from '../../components/AppContent/AppContent.module.css';
import styles from '@/components/AccountForm/AccountForm.module.css';

export default async function Index() {
  return (
    <Box className={styles.container}>
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

      <Flex
        justify={'space-between'}
        align={'center'}
        style={{ flexWrap: 'wrap' }}
        gap={30}
        pb={50}
      >
        <Box style={{ flexGrow: 1, alignSelf: 'flex-start' }}>
          <Text fz={20} fw={700} mb={20}>
            Profil-Einstellungen
          </Text>

          <Skeleton width={100} height={16} mb={10} />
          <Skeleton w={'100%'} maw={400} height={36} mb={20} />

          <Box maw={400}>
            <Text mt={30} fz={20} fw={700} mb={20}>
              App-Einstellungen
            </Text>
            <Skeleton width={100} height={16} mb={10} />
            <Skeleton w={'100%'} maw={400} height={60} mb={20} />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

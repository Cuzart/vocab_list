import classes from '@/components/AppContent/AppContent.module.css';
import { Center, Flex, ThemeIcon, Title } from '@mantine/core';
import { IconVocabulary } from '@tabler/icons-react';

export default async function Index() {
  return (
    <Center w={'100%'} h={'100vh'}>
      <Flex align={'center'} gap={5} pos={'relative'}>
        <ThemeIcon size={36} variant='transparent'>
          <IconVocabulary className={classes.loader} size={36} />
        </ThemeIcon>
        <Title className={classes.title}>Vocabulist</Title>
      </Flex>
    </Center>
  );
}

import {
  ActionIcon,
  Box,
  Collapse,
  Flex,
  Loader,
  LoadingOverlay,
  Paper,
  Text,
} from '@mantine/core';
import { IconArrowUp, IconTrash } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import classes from './TranslationItem.module.css';
import { useSwipeable } from 'react-swipeable';
import { deleteTranslation } from '@/actions/deleteTranslation';
import { useRouter } from 'next/navigation';
import { increaseTranslationCount } from '@/actions/increaseTranslationCount';
import { TranslationEntry } from '@/types';

const config = {
  delta: 10, // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: true, // prevents scroll during swipe (*See Details*)
  trackTouch: true, // track touch input
  trackMouse: true, // track mouse input
  rotationAngle: 0, // set a rotation angle
  swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
};

type Props = {
  index: number;
  id: number;
  original: string;
  translation: string;
  visible?: boolean;
  count?: number;
  setEntries: React.Dispatch<React.SetStateAction<TranslationEntry[] | undefined>>;
};

export const TranslationItem = ({
  id,
  original,
  translation,
  visible,
  count: initialCount,
  setEntries,
}: Props) => {
  const router = useRouter();
  const [opened, setOpened] = React.useState(false);
  const [count, setCount] = React.useState(initialCount || 0);
  const [offset, setOffset] = React.useState(0);
  const [offsetContainer, setOffsetContainer] = React.useState(0);

  useEffect(() => {
    visible !== undefined && setOpened(visible);
  }, [visible]);

  const handleOptimisticDelete = async () => {
    let previous: TranslationEntry[] = [];

    setEntries((prevState) => {
      const index = prevState!.findIndex((entry) => entry.id === id);
      previous = prevState!;
      const newEntries = [...prevState!];
      newEntries.splice(index, 1);
      return newEntries;
    });
    const res = await deleteTranslation({ id: id });

    !res && setEntries(() => previous);
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === 'Left') {
        if (eventData.deltaX > -60) {
          setOffset(eventData.deltaX);
        } else {
          setOffsetContainer(eventData.deltaX + 60);
        }
      }
    },

    onSwiped: async (eventData) => {
      if (eventData.deltaX < -100) {
        handleOptimisticDelete();
      }
      setOffset(0);
      setOffsetContainer(0);
    },

    // onTap: (e) => {
    //   console.log(e);
    //   setOpened(!opened);
    // },

    ...config,
  });

  return (
    <>
      {count < 5 && (
        <Box
          className={classes.container}
          mod={{ opened }}
          style={{ transform: `translateX(${offsetContainer}px)` }}
          {...handlers}
        >
          <Paper
            className={classes.paper}
            p={10}
            px={20}
            style={{ transform: `translateX(${offset}px)` }}
            onClick={() => setOpened(!opened)}
          >
            <Flex key={original} align={'center'} justify={'space-between'}>
              <div>
                <Text fw={500}>{original}</Text>
                <Collapse in={opened}>
                  <Text c={'dimmed'}>
                    {translation === '...' ? (
                      <Loader ml={4} size={24.8} type='dots' />
                    ) : (
                      translation
                    )}
                  </Text>
                </Collapse>
              </div>

              <ActionIcon
                size={'lg'}
                w={'auto'}
                variant='outline'
                px={6}
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const oldCount = count;
                  setCount(oldCount + 1);
                  const res = await increaseTranslationCount({ id: id, count: oldCount + 1 });
                  !res && setCount(oldCount);
                }}
              >
                <IconArrowUp size={16} />
                {count > 0 && <Text>{count}</Text>}
              </ActionIcon>
            </Flex>
          </Paper>
          <Box
            className={classes.underlay}
            opacity={Math.abs(offset / 100) + Math.abs(offsetContainer / 100)}
          >
            <IconTrash />
          </Box>
        </Box>
      )}
    </>
  );
};

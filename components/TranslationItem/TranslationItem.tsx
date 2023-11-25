import { ActionIcon, Box, Collapse, Flex, Paper, Text } from '@mantine/core';
import { IconArrowUp, IconTrash } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import classes from './TranslationItem.module.css';
import { useSwipeable } from 'react-swipeable';
import { deleteTranslation } from '@/actions/deleteTranslation';
import { useRouter } from 'next/navigation';
import { increaseTranslationCount } from '@/actions/increaseTranslationCount';

const config = {
  delta: 10, // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: true, // prevents scroll during swipe (*See Details*)
  trackTouch: true, // track touch input
  trackMouse: true, // track mouse input
  rotationAngle: 0, // set a rotation angle
  swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
};

export const TranslationItem = ({
  id,
  original,
  translation,
  visible,
  count: initialCount,
}: {
  id: string;
  original: string;
  translation: string;
  visible?: boolean;
  count?: number;
}) => {
  const router = useRouter();
  const [opened, setOpened] = React.useState(false);
  const [count, setCount] = React.useState(initialCount || 0);
  const [offset, setOffset] = React.useState(0);
  const [offsetContainer, setOffsetContainer] = React.useState(0);

  useEffect(() => {
    visible !== undefined && setOpened(visible);
  }, [visible]);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === 'Left') {
        if (eventData.absX < 60) {
          setOffset(eventData.absX);
        } else {
          setOffsetContainer(eventData.absX - 60);
        }
      }
    },

    onSwiped: async (eventData) => {
      if (eventData.absX > 80) {
        const res = await deleteTranslation({ id: id });
        res && router.refresh();
      }
      setOffset(0);
      setOffsetContainer(0);
    },

    onTap: () => {
      setOpened(!opened);
    },

    ...config,
  });

  return (
    <Box
      className={classes.container}
      mod={{ opened }}
      style={{ transform: `translateX(-${offsetContainer}px)` }}
      {...handlers}
    >
      <Paper
        className={classes.paper}
        p={10}
        px={20}
        onClick={() => {}}
        style={{ transform: `translateX(-${offset}px)` }}
      >
        <Flex key={original} align={'center'} justify={'space-between'}>
          <div>
            <Text fw={500}>{original}</Text>
            <Collapse in={opened}>
              <Text c={'dimmed'}>{translation}</Text>
            </Collapse>
          </div>

          <ActionIcon
            size={'lg'}
            w={'auto'}
            variant='outline'
            px={6}
            onClick={async (e) => {
              e.stopPropagation();
              const oldCount = count;
              setCount(oldCount + 1);
              const res = await increaseTranslationCount({ id: id, count: oldCount + 1 });
              if (oldCount + 1 >= 5) router.refresh();
              !res && setCount(oldCount);
            }}
          >
            <IconArrowUp size={16} />
            {count > 0 && <Text>{count}</Text>}
          </ActionIcon>
        </Flex>
      </Paper>
      <Box className={classes.underlay}>
        <IconTrash />
      </Box>
    </Box>
  );
};

import { deleteTranslation } from '@/actions/deleteTranslation';
import { increaseTranslationCount } from '@/actions/increaseTranslationCount';
import { TranslationEntry } from '@/types';
import { ActionIcon, Box, Collapse, Flex, Loader, Paper, Text } from '@mantine/core';
import { IconArrowUp, IconTrash, IconVolume } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import classes from './TranslationItem.module.css';

type Props = {
  id: string | number;
  original: string;
  translation: string;
  visible?: boolean;
  count?: number;
  setEntries: React.Dispatch<React.SetStateAction<TranslationEntry[] | undefined>>;
  switched: boolean;
  language: string;
  allowSound?: boolean;
  repetitionLimit?: number;
};

export const TranslationItem = ({
  id,
  original,
  translation,
  visible,
  count: initialCount,
  setEntries,
  switched,
  language,
  allowSound,
  repetitionLimit = 5,
}: Props) => {
  const [opened, setOpened] = React.useState(false);
  const [count, setCount] = React.useState(initialCount || 0);

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
    const res = await deleteTranslation({ id: id as number });
    !res && setEntries(() => previous);
  };

  const read = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onend = () => {
      underlayRef.current?.style.setProperty('--swipe-opacity', '0');
      paperRef.current?.style.setProperty('--swipe-amount', '0px');

      setTimeout(() => {
        paperRef.current?.style.setProperty('transition', 'none');
        toastRef.current?.style.setProperty('transition', 'none');
        swipesLeft && setSwipesLeft(false);
      }, 300);
    };
    window.speechSynthesis.speak(utterance);
  };

  const displayedTranslation = switched ? original : translation;
  const displayedOriginal = switched ? translation : original;

  // const timeOutRef = React.useRef<any>(null);
  // const [menuOpened, setMenuOpened] = React.useState(false);
  // const ref = useClickOutside(() => setMenuOpened(false));

  const SWIPE_THRESHOLD = 100;
  const toastRef = React.useRef<HTMLDivElement>(null);
  const paperRef = React.useRef<HTMLDivElement>(null);
  const underlayRef = React.useRef<HTMLDivElement>(null);
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const dragStartTime = React.useRef<Date | null>(null);

  const [swipesLeft, setSwipesLeft] = React.useState(false);
  const [swipeOut, setSwipeOut] = React.useState(false);

  return (
    <>
      {count < repetitionLimit && (
        <Box
          ref={toastRef}
          className={classes.container}
          data-left={swipesLeft ? 'true' : undefined}
          data-opened={opened ? 'true' : undefined}
          data-swipe-out={swipeOut ? 'true' : undefined}
          onPointerDown={(event) => {
            dragStartTime.current = new Date();
            // Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
            (event.target as HTMLElement).setPointerCapture(event.pointerId);
            if ((event.target as HTMLElement).tagName === 'BUTTON') return;

            pointerStartRef.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={() => {
            if (swipeOut) return;

            pointerStartRef.current = null;

            underlayRef.current?.style.setProperty('--swipe-opacity', '0');

            const swipeAmount = Number(
              paperRef.current?.style.getPropertyValue('--swipe-amount').replace('px', '') || 0
            );

            const timeTaken = new Date().getTime() - dragStartTime.current?.getTime()! || 0;
            const velocity = Math.abs(swipeAmount) / timeTaken;

            // Remove only if threshold is met
            if (Math.abs(swipeAmount) >= 75 || velocity > 0.11) {
              if (swipeAmount > 0) {
                toastRef.current?.style.setProperty('transition', 'all 300ms ease');
                paperRef.current?.style.setProperty('transition', 'all 300ms ease');
                toastRef.current?.style.setProperty('--swipe-amount', '0px');
                underlayRef.current?.style.setProperty('--swipe-opacity', '1');
                paperRef.current?.style.setProperty('--swipe-amount', '60px');
                read(displayedOriginal);
              } else {
                setSwipeOut(true);
                setTimeout(() => {
                  handleOptimisticDelete();
                }, 250);
              }

              return;
            }

            // reset
            if (Math.abs(swipeAmount) > 0) {
              swipesLeft && setSwipesLeft(false);
              toastRef.current?.style.setProperty('--swipe-amount', '0px');
              paperRef.current?.style.setProperty('--swipe-amount', '0px');
            } else {
              // toggle only when threshold is not met and no swipe has been made
              setOpened(!opened);
            }
          }}
          onPointerMove={(event) => {
            if (!pointerStartRef.current) return;

            const xPosition = event.clientX - pointerStartRef.current.x;

            if (!allowSound && xPosition > 0) return;
            if (!swipesLeft && xPosition > 0) setSwipesLeft(true);

            let toastOffset = 0;

            if (Math.abs(xPosition) > 80) {
              toastOffset = xPosition + (xPosition < 0 ? 80 : -80);
              toastRef.current?.style.setProperty('--swipe-amount', `${toastOffset}px`);
            } else {
              paperRef.current?.style.setProperty('--swipe-amount', `${xPosition}px`);
            }

            underlayRef.current?.style.setProperty(
              '--swipe-opacity',
              `${Math.abs(toastOffset / 100) + Math.abs(xPosition / 100) + 0.4}`
            );
          }}
        >
          <Paper
            ref={paperRef}
            className={classes.paper}
            p={10}
            px={20}

            // onMouseDown={() => {
            //   if (menuOpened) {
            //     setMenuOpened(false);
            //   } else {
            //     timeOutRef.current = setTimeout(() => setMenuOpened(true), 600);
            //   }
            // }}
            // onMouseUp={() => {
            //   clearTimeout(timeOutRef.current);
            // }}
          >
            <Flex key={id} align={'center'} justify={'space-between'}>
              <div>
                <Flex align={'center'}>
                  <Text fw={500}>{displayedOriginal}</Text>
                </Flex>
                <Collapse in={opened}>
                  <Text c={'dimmed'}>
                    {displayedTranslation === '...' ? (
                      <Loader ml={4} size={24.8} type='dots' />
                    ) : (
                      displayedTranslation
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
                  const res = await increaseTranslationCount({
                    id: id as number,
                    count: oldCount + 1,
                    limit: repetitionLimit,
                  });
                  !res && setCount(oldCount);
                }}
              >
                <IconArrowUp size={16} />
                {count > 0 && <Text>{count}</Text>}
              </ActionIcon>
            </Flex>
          </Paper>
          <Flex ref={underlayRef} className={classes.underlay} justify={'space-between'}>
            <IconVolume />
            <IconTrash />
          </Flex>
        </Box>
      )}
    </>
  );
};

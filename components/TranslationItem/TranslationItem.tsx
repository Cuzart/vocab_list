import { deleteTranslation } from '@/actions/deleteTranslation';
import { editTranslation } from '@/actions/editTranslation';
import { increaseTranslationCount } from '@/actions/increaseTranslationCount';
import { TranslationEntry } from '@/types';
import { ActionIcon, Box, Collapse, Flex, Loader, Paper, Text, TextInput } from '@mantine/core';
import { useOs } from '@mantine/hooks';
import { IconArrowUp, IconTrash, IconVolume } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
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

  const os = useOs();
  if (os !== 'ios') allowSound = true;

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

  const SWIPE_THRESHOLD = 80;
  const toastRef = React.useRef<HTMLDivElement>(null);
  const paperRef = React.useRef<HTMLDivElement>(null);
  const underlayRef = React.useRef<HTMLDivElement>(null);
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const dragStartTime = React.useRef<Date | null>(null);

  const [swipesLeft, setSwipesLeft] = React.useState(false);
  const [swipeOut, setSwipeOut] = React.useState(false);

  const handlers = {
    onSwipeStart: (event: any) => {
      dragStartTime.current = new Date();
      // Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
      if ((event.target as HTMLElement).tagName === 'BUTTON') return;

      pointerStartRef.current = { x: event.clientX, y: event.clientY };
    },
    onSwipeEnd: () => {
      if (swipeOut) return;

      toastRef.current?.style.setProperty('transition', 'all 300ms ease');
      paperRef.current?.style.setProperty('transition', 'all 300ms ease');

      pointerStartRef.current = null;

      underlayRef.current?.style.setProperty('--swipe-opacity', '0');

      const swipeAmount = Number(
        paperRef.current?.style.getPropertyValue('--swipe-amount').replace('px', '') || 0
      );

      const timeTaken = new Date().getTime() - dragStartTime.current?.getTime()! || 0;
      const velocity = Math.abs(swipeAmount) / timeTaken;

      if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD - 5 || velocity > 0.15) {
        // sometimes stops before threshold
        // Remove only if threshold is met
        if (swipeAmount > 0) {
          toastRef.current?.style.setProperty('--swipe-amount', '0px');
          underlayRef.current?.style.setProperty('--swipe-opacity', '1');
          paperRef.current?.style.setProperty('--swipe-amount', '60px');
          read(original);
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
        setTimeout(() => {
          toastRef.current?.style.setProperty('transition', 'none');
          paperRef.current?.style.setProperty('transition', 'none');
        }, 250);
      }
    },
    onSwipe: (event: any) => {
      if (!pointerStartRef.current) return;

      const xPosition =
        (event.type === 'touchmove' ? event.touches[0].clientX : event.clientX) -
        pointerStartRef.current.x;

      if (!allowSound && xPosition > 0) return;
      if (!swipesLeft && xPosition > 0) setSwipesLeft(true);

      let toastOffset = 0;

      if (Math.abs(xPosition) > SWIPE_THRESHOLD) {
        toastOffset = xPosition + (xPosition < 0 ? SWIPE_THRESHOLD : -SWIPE_THRESHOLD);
        toastRef.current?.style.setProperty('--swipe-amount', `${toastOffset}px`);
      } else {
        paperRef.current?.style.setProperty('--swipe-amount', `${xPosition}px`);
      }

      underlayRef.current?.style.setProperty(
        '--swipe-opacity',
        `${Math.abs(toastOffset / 100) + Math.abs(xPosition / 100) + 0.4}`
      );
    },
  };

  const [edit, setEdit] = React.useState('');
  const [editActive, setEditActive] = React.useState(false);

  useEffect(() => {
    setEdit(displayedTranslation);
  }, [displayedTranslation]);

  return (
    <>
      {count < repetitionLimit && (
        <Box
          ref={toastRef}
          className={classes.container}
          data-left={swipesLeft ? 'true' : undefined}
          data-opened={opened ? 'true' : undefined}
          data-swipe-out={swipeOut ? 'true' : undefined}
          onPointerDown={handlers.onSwipeStart}
          onMouseMove={handlers.onSwipe}
          onTouchMove={handlers.onSwipe}
          // needs touchEnd for mobile because pointer end is cancelled by touch-actions, so we need to include mouseUp for desktop as well
          onTouchEnd={handlers.onSwipeEnd}
          onMouseUp={handlers.onSwipeEnd}
          onClick={() => {
            const timeTaken = new Date().getTime() - dragStartTime.current?.getTime()! || 0;
            timeTaken < 500 && setOpened(!opened);
          }}
        >
          <Paper ref={paperRef} className={classes.paper} p={10} px={20}>
            <Flex key={id} align={'center'} justify={'space-between'}>
              <div>
                <Flex align={'center'}>
                  <Text fw={500}>{displayedOriginal}</Text>
                </Flex>
                <Collapse in={opened}>
                  <Box c={'dimmed'}>
                    {displayedTranslation === '...' ? (
                      <Loader ml={4} size={24.8} type='dots' />
                    ) : (
                      <>
                        {editActive ? (
                          <TextInput
                            autoFocus
                            value={edit}
                            onChange={(e) => setEdit(e.currentTarget.value)}
                            variant='unstyled'
                            p={0}
                            onClick={(e) => e.stopPropagation()}
                            size='xs'
                            w={'fit-content'}
                            styles={{
                              input: {
                                fontSize: '1rem',
                                minHeight: 'unset',
                                maxHeight: 'calc(var(--mantine-line-height) * 1rem)',
                                lineHeight: 'var(--mantine-line-height)',
                                border: 'none',
                                minWidth: '80px',
                                width: edit.length + 2 + 'ch',
                              },
                            }}
                            onBlur={() => {
                              if (edit === displayedTranslation || edit === '') {
                                setEditActive(false);
                                if (edit === '') setEdit(displayedTranslation);
                                return;
                              }
                              const oldWord = displayedTranslation;

                              // optimistic update
                              setEntries((prev) => {
                                const index = prev!.findIndex((entry) => entry.id === id);
                                const newEntries = [...prev!];
                                newEntries[index][switched ? 'original' : 'translation'] =
                                  edit.trim();
                                return newEntries;
                              });

                              toast.success('Änderung gespeichert', {
                                duration: 3200,
                                onDismiss: () =>
                                  editTranslation({ id: id as number, edit, switched }),
                                onAutoClose: () =>
                                  editTranslation({ id: id as number, edit, switched }),
                                action: {
                                  label: 'Rückgängig',
                                  onClick: () => {
                                    setEntries((prev) => {
                                      // optimistic update rollback
                                      const index = prev!.findIndex((entry) => entry.id === id);
                                      const newEntries = [...prev!];
                                      newEntries[index][switched ? 'original' : 'translation'] =
                                        oldWord;
                                      return newEntries;
                                    });
                                  },
                                },
                              });
                            }}
                          />
                        ) : (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditActive(true);
                            }}
                          >
                            {edit}
                          </span>
                        )}
                      </>
                    )}
                  </Box>
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

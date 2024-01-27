import { useEffect, useState } from 'react';
import { UnstyledButton, Menu, Group, ThemeIcon } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import images from './images';
import classes from './CountryPicker.module.css';
import { LanguageEnum } from '@/types';
import Image from 'next/image';

export const countryData = [
  { value: 'en', label: 'Englisch', image: images.en },
  { value: 'fr', label: 'Französisch', image: images.fr },
  { value: 'es', label: 'Spanisch', image: images.es },
  { value: 'it', label: 'Italienisch', image: images.it },
  { value: 'pl', label: 'Polnisch', image: images.pl },
  { value: 'ru', label: 'Russisch', image: images.ru },
  { value: 'tr', label: 'Türkisch', image: images.tr },
  // { value: 'de', label: 'German', image: images.de },
].sort((a, b) => a.label.localeCompare(b.label));

type Props = {
  language: LanguageEnum;
  setLanguage: (language: LanguageEnum) => void;
};

export function CountryPicker({ language, setLanguage }: Props) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(countryData[0]);

  useEffect(() => {
    const item = countryData.find((item) => item.value === language);
    if (item) {
      setSelected(item);
    }
  }, [language]);

  const items = countryData.map((item) => (
    <Menu.Item
      leftSection={
        <Image src={item.image} alt={item.label} width={20} height={15} className={classes.flag} />
      }
      onClick={() => {
        setSelected(item);
        setLanguage(item.value as LanguageEnum);
      }}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius='md'
      width='target'
      withinPortal
      position='bottom-end'
      transitionProps={{ transition: 'scale-y' }}
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap='xs'>
            <Image
              src={selected.image}
              alt={selected.label}
              width={20}
              height={15}
              className={classes.flag}
            />

            <span className={classes.label}>{selected?.label}</span>
          </Group>
          <IconChevronDown size='1rem' className={classes.icon} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown miw={'fit-content'} maw={'unset'}>
        {items}
      </Menu.Dropdown>
    </Menu>
  );
}

import { LanguageEnum } from '@/types';
import { Group, Menu, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import classes from './CountryPicker.module.css';
import images from './images';

export const countryData = [
  { value: 'zh', label: 'Chinesisch', image: images.cn },
  { value: 'da', label: 'Dänisch', image: images.dk },
  { value: 'en', label: 'Englisch', image: images.en },
  { value: 'fr', label: 'Französisch', image: images.fr },
  { value: 'el', label: 'Griechisch', image: images.gr },
  { value: 'it', label: 'Italienisch', image: images.it },
  { value: 'ja', label: 'Japanisch', image: images.jp },
  { value: 'nl', label: 'Niederländisch', image: images.nl },
  { value: 'nb', label: 'Norwegisch', image: images.no },
  { value: 'pl', label: 'Polnisch', image: images.pl },
  { value: 'pt', label: 'Portugiesisch', image: images.pt },
  { value: 'ro', label: 'Rumnänisch', image: images.ro },
  { value: 'ru', label: 'Russisch', image: images.ru },
  { value: 'sv', label: 'Schwedisch', image: images.se },
  { value: 'es', label: 'Spanisch', image: images.es },
  { value: 'tr', label: 'Türkisch', image: images.tr },
];

type Props = {
  language: LanguageEnum;
  setLanguage: (language: LanguageEnum) => void;
  languages?: LanguageEnum[];
};

export function CountryPicker({ language, setLanguage, languages }: Props) {
  const data = countryData.filter((item) => languages?.includes(item.value as LanguageEnum));

  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(countryData[0]);

  useEffect(() => {
    const item = data.find((item) => item.value === language);
    if (item) {
      setSelected(item);
    }
  }, [language]);

  const items = data.map((item) => (
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

      <Menu.Dropdown miw={'fit-content'} maw={'unset'} mah={400} style={{ overflow: 'scroll' }}>
        {items}
      </Menu.Dropdown>
    </Menu>
  );
}

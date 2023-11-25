import { useState } from 'react';
import { UnstyledButton, Menu, Group } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import images from './images';
import classes from './CountryPicker.module.css';

const data = [
  { value: 'en', label: 'English', image: images.en },
  { value: 'fr', label: 'French', image: images.fr },
  { value: 'es', label: 'Spanish', image: images.es },
  { value: 'it', label: 'Italian', image: images.it },
  { value: 'pl', label: 'Polish', image: images.pl },
  { value: 'ru', label: 'Russian', image: images.ru },
  // { value: 'de', label: 'German', image: images.de },
].sort((a, b) => a.label.localeCompare(b.label));

export function CountryPicker({ language, setLanguage }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(data.find((item) => item.value === language));
  const items = data.map((item) => (
    <Menu.Item
      leftSection={
        <img src={item.image} alt={item.label} width={22} height={22} className={classes.flag} />
      }
      onClick={() => {
        setSelected(item);
        setLanguage(item.value);
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
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap='xs'>
            <img
              src={selected.image}
              alt={selected.label}
              width={22}
              height={22}
              className={classes.flag}
            />

            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size='1rem' className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}

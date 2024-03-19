import { createBatchTranslations } from '@/actions/createBatchTranslations';
import useBoop from '@/hooks/useBoop';
import { LanguageEnum } from '@/types';
import { Button, Flex, Modal, Textarea, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CountryPicker, countryData } from '../CountryPicker/CountryPicker';
import { DirectionToggle } from '../DirectionToggle/DirectionToggle';

export const BatchImport = () => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [lang, setLang] = useState<LanguageEnum>('en');
  const [switched, setSwitched] = useState<boolean>(true);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [style, trigger] = useBoop({ rotation: 10, timing: 300 });

  const countryLabel = useMemo(
    () => countryData.find((entry) => entry.value === lang)?.label,
    [lang, countryData]
  );

  return (
    <>
      <Button variant='outline' mt={30} onClick={open}>
        Batch Import
      </Button>
      <Modal title={'Batch Import'} opened={opened} onClose={close}>
        <Flex
          gap={5}
          direction={switched ? 'row' : 'row-reverse'}
          align={'center'}
          justify={'space-between'}
        >
          <CountryPicker language={'de'} setLanguage={() => {}} readonly languages={['de']} />
          <UnstyledButton
            ref={trigger}
            onClick={() => {
              setSwitched(!switched);
              setContent((prev) =>
                prev
                  .split('\n')
                  .map((entry) => entry.split('=').reverse().join('='))
                  .join('\n')
              );
            }}
          >
            <DirectionToggle switched={switched} setSwitched={setSwitched} boopStyle={style} />
          </UnstyledButton>
          <CountryPicker
            language={lang}
            setLanguage={setLang}
            languages={countryData.map((entry) => entry.value) as LanguageEnum[]}
          />
        </Flex>
        <Textarea
          mt={20}
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          placeholder={
            switched
              ? 'Deutsch' + '\n' + 'Deutsch=Englisch'
              : `${countryLabel}\n${countryLabel}=Deutsch`
          }
          minRows={5}
          maxRows={25}
          maxLength={2000}
          inputWrapperOrder={['label', 'input', 'description', 'error']}
          description={content.length + '/2000'}
          descriptionProps={{ align: 'right' }}
          autosize
        />

        <Button
          mt={20}
          ml={'auto'}
          display={'block'}
          children='Anlegen'
          loading={loading}
          disabled={!content}
          onClick={async () => {
            setLoading(true);
            (await createBatchTranslations({
              text: content
                .split(/\n/)
                .filter(Boolean)
                .map((entry) => entry.split('=')),
              source: lang,
              target: 'de',
              switched,
            })) && router.refresh();
            setLoading(false);
            setContent('');
            close();
          }}
        />
      </Modal>
    </>
  );
};

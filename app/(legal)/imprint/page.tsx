import { BackButton } from '@/components/BackButton';
import { Footer } from '@/components/Footer/Footer';
import '@/styles/legal.css';
import { Container } from '@mantine/core';

const config = {
  steuerId: 'DE358764198',
  name: 'Christian Heinz',
  description: 'Selbstständiger Entwickler/ Designer',
  street: 'Annastraße 12',
  city: '97072 Würzburg',
  mail: 'funo@duck.com',
};

export default function ImprintPage() {
  return (
    <>
      <main id='legal'>
        <Container py={30}>
          <BackButton />

          <div className='wrapper'>
            <h1>Impressum</h1>

            <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
            <p>
              {config.name}
              <br />
              {config.description}
              <br />
              {config.street}
              <br />
              {config.city}
            </p>

            <h2>Kontakt</h2>
            <p>
              <span style={{ display: 'flex', gap: '6px' }}>
                E-Mail:
                <a className='mail-link' href={`mailto:${config.mail}`}>
                  {config.mail}
                </a>
              </span>
            </p>

            <h2>Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gem&auml;&szlig; &sect; 27 a Umsatzsteuergesetz:
              <br />
              {config.steuerId}
            </p>

            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit:{' '}
              <a
                href='https://ec.europa.eu/consumers/odr/'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .<br /> Meine E-Mail-Adresse finden Sie oben im Impressum.
            </p>

            <h2>Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle</h2>
            <p>
              Ich bin nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <p>
              Quelle: <a href='https://www.e-recht24.de'>https://www.e-recht24.de</a>
            </p>
          </div>
        </Container>
      </main>
      <Footer site={'imprint'} />
    </>
  );
}

import { GeistSans } from 'geist/font/sans';
import { Eczar as HeadingFont } from 'next/font/google';
import { Space_Grotesk as BodyFont } from 'next/font/google';
import './globals.css';
import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Viewport } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const headingFont = HeadingFont({ weight: ['400', '700'], subsets: ['latin'] });
const bodyFont = BodyFont({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Vocabulist',
  description: 'Quick management of your vocabulary',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  initialScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={GeistSans.className}>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/apple-icon-152x.png' />
        <meta name='apple-mobile-web-app-capable' content='yes' />

        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          theme={{
            primaryColor: 'violet',
            fontFamily: bodyFont.style.fontFamily,
            headings: {
              fontFamily: headingFont.style.fontFamily,
              sizes: { h1: { fontSize: '2.375rem' } },
            },
          }}
        >
          <main>
            <Container pos={'relative'} p={0}>
              {children}
            </Container>
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}

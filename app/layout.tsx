import { ClientProvider } from '@/components/ClientProvider';
import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { GeistSans } from 'geist/font/sans';
import { Viewport } from 'next';
import { Space_Grotesk as BodyFont, Eczar as HeadingFont } from 'next/font/google';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';
import './globals.css';

const headingFont = HeadingFont({ weight: ['400', '700'], subsets: ['latin'] });
const bodyFont = BodyFont({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const metadata = {
  title: 'Vocabulist',
  description: 'Quick management of your vocabulary',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F9FA' },
    { media: '(prefers-color-scheme: dark)', color: '#101113' },
  ],
  initialScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  cookies();

  return (
    <html lang='de' className={GeistSans.className}>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/apple-icon-152x.png' />
        <meta name='apple-mobile-web-app-capable' content='yes' />

        <ColorSchemeScript />
      </head>
      <body className='preload'>
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
          <ClientProvider>
            <Toaster position='bottom-right' />

            <main>
              <Container pos={'relative'} p={0}>
                {children}
              </Container>
            </main>
          </ClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

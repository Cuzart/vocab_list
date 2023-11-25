import { GeistSans } from 'geist/font/sans';
import { Eczar as HeadingFont } from 'next/font/google';
import { Lexend_Deca as BodyFont } from 'next/font/google';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={GeistSans.className}>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/apple-icon-152x.png' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, viewport-fit=cover' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#151515' media='(prefers-color-scheme: dark)' />
        <meta name='theme-color' content='#F2F2F2' media='(prefers-color-scheme: light)' />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          theme={{
            primaryColor: 'violet',
            fontFamily: bodyFont.style.fontFamily,
            headings: {
              fontFamily: headingFont.style.fontFamily,
              sizes: { h1: { fontSize: '38px' } },
            },
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}

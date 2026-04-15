import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../globals.css';

const locales = ['th', 'en'];

export const metadata: Metadata = {
  title: 'Eight Coffee Roasters — คั่วสด ส่งตรง',
  description: 'กาแฟคั่วสด Single Origin คุณภาพสูง จากไร่สู่แก้ว | Eight Coffee Roasters',
  keywords: ['กาแฟ', 'coffee', 'single origin', 'eight coffee roasters', 'กาแฟคั่วสด'],
  openGraph: {
    title: 'Eight Coffee Roasters',
    description: 'คั่วสดทุกล็อต ส่งตรงถึงมือคุณ',
    type: 'website',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params as any;
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

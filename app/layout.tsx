import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import '@/styles/globals.css';
import FloatingChat from '@/components/Chatbot/FloatingChat';
import { ScriptLoader } from '@/components/Scripts/ScriptLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Optimus Agency | Desarrollo Web Profesional',
  description:
    'Transformamos ideas en experiencias digitales impactantes. Diseño web, desarrollo y SEO para llevar tu negocio al siguiente nivel.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://agencypartner2.netlify.app'),
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <FloatingChat />
          </LanguageProvider>
        </ThemeProvider>
        <ScriptLoader />
      </body>
    </html>
  );
}



import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProjectAdvisorProvider } from '@/contexts/ProjectAdvisorContext';
import { FABProvider } from '@/contexts/FABContext';
import '@/styles/globals.css';
import Script from 'next/script';
import FloatingChat from '@/components/Chatbot/FloatingChat';
import FAB from '@/components/FAB/FAB';
import { ProjectAdvisorWrapper } from '@/components/ProjectAdvisor/ProjectAdvisorWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Optimus Agency | Desarrollo Web Profesional',
  description:
    'Transformamos ideas en experiencias digitales impactantes. Diseño web, desarrollo y SEO para llevar tu negocio al siguiente nivel.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
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
            <ProjectAdvisorProvider>
              <FABProvider>
                {children}
                <div className="floatingActionsWrapper">
                  <FloatingChat />
                  <FAB />
                </div>
                <ProjectAdvisorWrapper />
              </FABProvider>
            </ProjectAdvisorProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}



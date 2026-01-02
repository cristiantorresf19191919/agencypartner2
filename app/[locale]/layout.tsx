import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const metadataByLocale: Record<Locale, Metadata> = {
  es: {
    title: 'Optimus Agency | Desarrollo Web Profesional',
    description:
      'Convierte clics en clientes en 14 días. Desarrollo web profesional, diseño y SEO para llevar tu negocio al siguiente nivel. Lleva tu negocio a vender 24/7 desde el día 1.',
    keywords: [
      'desarrollo web',
      'diseño web',
      'landing pages',
      'SEO',
      'marketing digital',
      'aplicaciones web',
      'sitios corporativos',
      'conversión',
    ],
    openGraph: {
      title: 'Optimus Agency | Desarrollo Web Profesional',
      description:
        'Convierte clics en clientes en 14 días. Desarrollo web profesional para llevar tu negocio a vender 24/7 desde el día 1.',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: '/images/portfolio/marketingImage.png',
          width: 1200,
          height: 630,
          alt: 'Optimus Agency - Desarrollo Web Profesional',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Optimus Agency | Desarrollo Web Profesional',
      description:
        'Convierte clics en clientes en 14 días. Desarrollo web profesional para llevar tu negocio a vender 24/7 desde el día 1.',
      images: ['/images/portfolio/marketingImage.png'],
    },
    alternates: {
      canonical: '/es',
      languages: {
        'es-ES': '/es',
        'en-US': '/en',
      },
    },
  },
  en: {
    title: 'Optimus Agency | Professional Web Development',
    description:
      'Convert clicks into clients in 14 days. Professional web development, design and SEO to take your business to the next level. Get your business selling 24/7 from day 1.',
    keywords: [
      'web development',
      'web design',
      'landing pages',
      'SEO',
      'digital marketing',
      'web applications',
      'corporate websites',
      'conversion',
    ],
    openGraph: {
      title: 'Optimus Agency | Professional Web Development',
      description:
        'Convert clicks into clients in 14 days. Professional web development to get your business selling 24/7 from day 1.',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/images/portfolio/marketingimageenglish.png',
          width: 1200,
          height: 630,
          alt: 'Optimus Agency - Professional Web Development',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Optimus Agency | Professional Web Development',
      description:
        'Convert clicks into clients in 14 days. Professional web development to get your business selling 24/7 from day 1.',
      images: ['/images/portfolio/marketingimageenglish.png'],
    },
    alternates: {
      canonical: '/en',
      languages: {
        'es-ES': '/es',
        'en-US': '/en',
      },
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = metadataByLocale[locale];
  
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      url: `/${locale}`,
      siteName: 'Optimus Agency',
    },
    alternates: {
      ...metadata.alternates,
      canonical: `/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  return <>{children}</>;
}


'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname ? getLocaleFromPathname(pathname) : 'es';

  useEffect(() => {
    // Log to console so developers see the error
    console.error('Route error:', error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1.5rem', textAlign: 'center' }}>
        We couldn’t load this page. Try again or go back.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg, #a06af9 0%, #35E4B2 100%)',
            color: '#0a0a0f',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href={`/${locale}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface TranslationPendingBadgeProps {
  /** When false, render nothing. Caller passes `language === 'es' && !contentEs`. */
  show: boolean;
  /** Optional override label. */
  label?: string;
  /** Compact pill-only variant; default shows label + description block. */
  variant?: 'pill' | 'block';
}

export function TranslationPendingBadge({
  show,
  label,
  variant = 'block',
}: TranslationPendingBadgeProps) {
  const { t } = useLanguage();
  if (!show) return null;

  const title = label ?? t('course-translation-pending');
  const desc = t('course-translation-pending-desc');

  if (variant === 'pill') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          color: '#fbbf24',
          background: 'rgba(251, 191, 36, 0.12)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          borderRadius: 999,
        }}
        role="status"
      >
        <span aria-hidden style={{ fontSize: 13 }}>🌐</span>
        {title}
      </span>
    );
  }

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        margin: '12px 0',
        borderRadius: 12,
        background: 'rgba(251, 191, 36, 0.08)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        color: '#fde68a',
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>🌐</span>
      <div>
        <strong style={{ display: 'block', color: '#fbbf24', marginBottom: 2 }}>
          {title}
        </strong>
        <span style={{ opacity: 0.85 }}>{desc}</span>
      </div>
    </div>
  );
}

export default TranslationPendingBadge;

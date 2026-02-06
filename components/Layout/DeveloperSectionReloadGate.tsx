'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const DEV_RELOAD_PARAM = 'dev_reload';

/**
 * Workaround for black screen when client-navigating within developer section.
 * When the URL has ?dev_reload=1 (on initial load OR after client-side navigation),
 * we remove the param and trigger a full page load so content renders correctly.
 * We depend on pathname + searchParams so this runs again on every client-side
 * navigation to a URL that includes dev_reload=1.
 */
export default function DeveloperSectionReloadGate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (searchParams.get(DEV_RELOAD_PARAM) !== '1') return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete(DEV_RELOAD_PARAM);
    const newSearch = params.toString();
    const newUrl =
      pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
    window.history.replaceState(null, '', newUrl);
    window.location.reload();
  }, [pathname, searchParams]);

  return null;
}

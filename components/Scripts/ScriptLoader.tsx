"use client";

import Script from 'next/script';
import { useEffect } from 'react';

export function ScriptLoader() {
  useEffect(() => {
    // Ensure particlesJS is available globally after script loads
    const handleParticlesLoad = () => {
      if (typeof window !== 'undefined') {
        (window as any).particlesJS = (window as any).particlesJS || (window as any).particles;
      }
    };

    // Check if particles.js is already loaded
    if (typeof window !== 'undefined' && ((window as any).particlesJS || (window as any).particles)) {
      handleParticlesLoad();
    }
  }, []);

  return (
    <>
      {/* Google Analytics - Replace G-XXXXXXXXXX with your actual GA4 ID */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
        onError={() => {
          console.warn('Google Analytics script failed to load');
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          (function() {
            try {
              if (typeof window === 'undefined') {
                return;
              }
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              var gaId = 'G-XXXXXXXXXX';
              if (gaId && gaId !== 'G-XXXXXXXXXX') {
                gtag('config', gaId);
              }
            } catch (error) {
              console.warn('Google Analytics initialization error:', error);
            }
          })();
        `}
      </Script>
      {/* Facebook Pixel - Replace YOUR_PIXEL_ID with your actual Pixel ID */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          (function() {
            try {
              if (typeof window === 'undefined' || typeof document === 'undefined') {
                return;
              }
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              if(s && s.parentNode) {
                s.parentNode.insertBefore(t,s);
              }
              }(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              if (typeof fbq !== 'undefined') {
                var pixelId = 'YOUR_PIXEL_ID';
                if (pixelId && pixelId !== 'YOUR_PIXEL_ID') {
                  fbq('init', pixelId);
                  fbq('track', 'PageView');
                }
              }
            } catch (error) {
              console.warn('Facebook Pixel initialization error:', error);
            }
          })();
        `}
      </Script>
      <Script
        src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"
        strategy="afterInteractive"
        onError={() => {
          console.warn('GSAP script failed to load');
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"
        strategy="afterInteractive"
        onError={() => {
          console.warn('Particles.js script failed to load');
        }}
        onLoad={() => {
          // Ensure particlesJS is available globally
          if (typeof window !== 'undefined') {
            (window as any).particlesJS = (window as any).particlesJS || (window as any).particles;
          }
        }}
      />
    </>
  );
}


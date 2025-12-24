// app/ga.tsx
import Script from 'next/script';

export function GA4() {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-WX2KPFVDCW"
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WX2KPFVDCW'); 

          // Sticker scan magic
          if (window.location.search.includes('utm_source=sticker')) {
            gtag('event', 'sticker_scan', {
              event_category: 'QR Campaign',
              event_label: 'A6 Sticker Kerala 2025',
              value: 1
            });
          }
        `}
            </Script>
        </>
    );
}
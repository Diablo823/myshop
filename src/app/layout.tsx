import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Jost } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WixClientContextProvider } from "@/context/WixContext";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MobNav from "@/components/MobNav";
import NewNav from "@/components/NewNav";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import QueryClientProvider from "@/providers/QueryClientProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { GA4 } from "./ga";

const inter = Inter({ subsets: ["latin"] });
const jost = Jost({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "US Cartel",
  description:
    "US Cartel is the new rising ecommerce marketplace in India, founded by Muruka Bhupathy offering affordable high-quality useful gadgets, fashion, cosmetics, and household essentials. Shop smart and Shop quality products online at US Cartel, US Cartel store",
  keywords: [
    "US Cartel",
    "US Cartel shop",
    "US Cartel store",
    "US Cartel marketplace",
    "US Cartel Ecommerce",
    "US Cartel online store",
    "US Cartel company",
    "US Cartel corporation",
    "Muruka Bhupathy",
    "US Cartel founder",
    "fashion marketplace",
    "cosmetics online",
    "gadgets",
    "tech gadgets",
    "household products",
    "seller marketplace",
    "90% seller profits",
    "better than Amazon",
  ],
  authors: [{ name: "US Cartel" }],
  creator: "US Cartel",
  publisher: "US Cartel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://uscartel.com"),
  alternates: {
    canonical: "https://uscartel.com",
  },
  openGraph: {
    title:
      "US Cartel - Marketplace for Fashion, Cosmetics, Gadgets, Household essentials & More",
    description:
      "US Cartel is the new rising ecommerce marketplace in India, founded by Muruka Bhupathy offering affordable high-quality useful gadgets, fashion, cosmetics, and household essentials. Shop smart and Shop quality products online at US Cartel, US Cartel store",
    url: "https://uscartel.com",
    siteName: "US Cartel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://uscartel.com/og-image.jpg", // You'll need to create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "US Cartel Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "US Cartel - Marketplace for Fashion, Cosmetics, Gadgets, Household essentials & More",
    description:
      "US Cartel is the new rising ecommerce marketplace in India, founded by Muruka Bhupathy offering affordable high-quality useful gadgets, fashion, cosmetics, and household essentials. Shop smart and Shop quality products online at US Cartel, US Cartel store",
    images: ["https://uscartel.com/og-image.jpg"], // Same image as OpenGraph
    creator: "@uscartelcompany", // Replace with your actual Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      {
        url: "/web-app-manifest-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/web-app-manifest-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  appleWebApp: {
    title: "US CARTEL",
    capable: true,
    statusBarStyle: "default",
  },
  manifest: "/site.webmanifest",
  category: "E-commerce",
};

//Separate viewport export (themeColor moved here as it's deprecated in metadata)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff", // White matches your background
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="6fy7lri8jmPKtLlaiVLgv30UjAcc66VDFngPt21m6vw"
        />

        <meta
          name="p:domain_verify"
          content="34764cb53c23c911a3152eb26617b9da"
        />

        <meta name="msvalidate.01" content="C58A8ABF53A617997EAEAC357116C71B" />

        {/* WhatsApp/OG Image meta tags - helps with WhatsApp preview */}
        <meta property="og:image" content="https://uscartel.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://static.wixstatic.com" />

        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="" />

        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />


        {/* Structured Data - Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "US Cartel",
              alternateName: ["US Cartel", "US Cartel Marketplace", "US Cartel Shop", "US Cartel Ecommerce", "US Cartel Store"],
              url: "https://uscartel.com",
              logo: "https://uscartel.com/logo.png",

              description:
                "US Cartel is the new rising ecommerce marketplace in India,founded by Muruka Bhupathy offering affordable high-quality useful gadgets, fashion, cosmetics, and household essentials. Shop smart and Shop quality products online at US Cartel, US Cartel store",
              foundingDate: "2024", // Update with your actual founding date
              foundingLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "IN",
                },
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                availableLanguage: ["English"],
              },
              sameAs: [
                // Add your social media URLs here when you create them
                "https://x.com/uscartelcompany",
                "https://instagram.com/uscartelcompany",
                "https://pinterest.com/uscartel",
                "https://youtube.com/@uscartel",
              ],
            }),
          }}
        />

        {/* Structured Data - WebSite Schema for Search Box */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "US Cartel",
              url: "https://uscartel.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://uscartel.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8REF7JVL1X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8REF7JVL1X');
        `}
        </Script>

        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ryy2ibtcq3");
          `,
          }}
        />



      </head>
      <body className={`${roboto.className}`}>
        <GA4 />
        <QueryClientProvider>
          <WixClientContextProvider>
            <Navbar />
            {/* <NewNav /> */}
            <ScrollToTop>
              <main className="pt-16 pb-20">
                {children}
              </main>
            </ScrollToTop>
            <Toaster />
            <Footer />
            <MobNav />
          </WixClientContextProvider>
        </QueryClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

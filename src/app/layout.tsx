import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Jost } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"] });
const jost = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "US Cartel",
  description:
    "US Cartel, the store that offers affordable, high-quality fashion, beauty & lifestyle essentials. Shop quality products online at uscartel.com! cartel shop, us cartel",
  alternates: {
    canonical: "https://uscartel.com",
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

        <meta name="p:domain_verify" content="34764cb53c23c911a3152eb26617b9da"/>


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
      </head>
      <body className={`${jost.className}`}>
        <WixClientContextProvider>
          <Navbar />
          {/* <NewNav /> */}
          <main className="pt-20 pb-20">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
          <Toaster />
          <Footer />
          <MobNav />
        </WixClientContextProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

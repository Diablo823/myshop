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
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"


const inter = Inter({ subsets: ["latin"] });
const jost = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "US Cartel",
  description: "US Cartel offers affordable, high-quality fashion, beauty & lifestyle essentials. Shop quality products online at uscartel.com!",
  alternates : {
    canonical: "https://uscartel.com",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="6fy7lri8jmPKtLlaiVLgv30UjAcc66VDFngPt21m6vw" />
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

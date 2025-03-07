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

const inter = Inter({ subsets: ["latin"] });
const jost = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "US Cartel",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}

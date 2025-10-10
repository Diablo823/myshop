"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top whenever the path changes
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return <>{children}</>;
}

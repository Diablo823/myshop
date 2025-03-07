"use client";

import NewNav from "./NewNav";
import { ReactNode } from "react";

export default function RootLay({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NewNav />
      <main className="flex-1 mt-20">{children}</main>
    </div>
  );
}
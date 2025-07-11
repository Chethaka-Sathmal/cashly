"use client";

import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const pathName = usePathname();
  const titleStr = pathName.split("/").filter(Boolean)[0];
  const title = titleStr.charAt(0).toUpperCase() + titleStr.slice(1);

  return (
    <header className="flex md:hidden h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1 h-8" />
      <div className="w-full text-center">
        <h1 className="text-3xl font-robot-slab">{title}</h1>
      </div>
    </header>
  );
}

"use client";

import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const pathName = usePathname();
  const titleStr = pathName.split("/").filter(Boolean)[0];
  const title = titleStr.charAt(0).toUpperCase() + titleStr.slice(1);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1 block md:hidden h-8" />
      <div className="w-full text-center">
        <h1 className="text-3xl font-robot-slab">{title}</h1>
      </div>
      <div className="bg-red-400 sm:bg-blue-400 md:bg-green-400 lg:bg-purple-400 xl:bg-yellow-400 rounded-full h-[30px] w-[30px]" />
      {/* <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
    </header>
  );
}

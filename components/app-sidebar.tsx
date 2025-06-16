"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import SidebarFooterComponent from "./sidebar-footer";

const data = [
  { title: "Dashboard", url: "/dashboard" },
  { title: "Income", url: "/income" },
  { title: "Expense", url: "/expense" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname();

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="hidden md:flex flex-col justify-end bg-theme h-[150px] rounded-lg p-3">
          <div className="flex items-end gap-3">
            <Image
              src={"/logo-transparent.svg"}
              alt="Cashly logo"
              height={30}
              width={30}
            />
            <span className="font-robot-slab text-white text-3xl">Cashly</span>
          </div>
        </div>
        <SidebarTrigger className="block md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  key={item.title}
                  className={cn(
                    item.url === pathName
                      ? "bg-theme/10 hover:bg-theme/20 rounded-md"
                      : null
                  )}
                >
                  <Link
                    href={item.url}
                    key={item.title}
                    className={cn(
                      "font-inter",
                      item.url === pathName
                        ? "text-theme hover:text-theme"
                        : null
                    )}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterComponent />
      </SidebarFooter>
    </Sidebar>
  );
}

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/components/app-header";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="p-2 w-full max-w-[1180px] mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

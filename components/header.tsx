import { SidebarTrigger } from "./ui/sidebar";
export default function Header({ title }: { title: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="w-full text-center">
        <h1>{title}</h1>
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

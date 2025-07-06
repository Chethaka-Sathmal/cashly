"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const QueryBarSchema = z.object({
  search: z.string(),
});

type QueryBarData = z.infer<typeof QueryBarSchema>;

export default function QueryBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  // const params = new URLSearchParams(searchParams);
  let type: "income" | "expense";
  if (pathname.startsWith("/")) {
    type = pathname.slice(1) as "income" | "expense";
  }

  const form = useForm<QueryBarData>({
    resolver: zodResolver(QueryBarSchema),
    defaultValues: {
      search: searchParams.get("query") || "",
    },
  });

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // Reset to page 1 when searching
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  function onSubmit(data: QueryBarData) {
    handleSearch(data.search);
  }

  return (
    <section className="flex mx-auto gap-2 max-w-3xl mb-6 md:mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 w-full"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      className="bg-white shadow-none w-full pl-10"
                      placeholder="Search..."
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e); // update RHF state
                        handleSearch(e.target.value); // pass string to your handler
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="hidden md:block"
            variant="themeLight"
          >
            Search
          </Button>
        </form>
      </Form>
      <Button
        variant="theme"
        onClick={() => router.push(`/${type}/create-transaction`)}
        className="flex flex-row gap-1"
      >
        <Plus />
        Add <span className="hidden md:block">transaction</span>
      </Button>
    </section>
  );
}

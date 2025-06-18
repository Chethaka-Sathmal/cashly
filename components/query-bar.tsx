"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const QueryBarSchema = z.object({
  search: z.string(),
});

type QueryBarData = z.infer<typeof QueryBarSchema>;

export default function QueryBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const form = useForm<QueryBarData>({
    resolver: zodResolver(QueryBarSchema),
    defaultValues: {
      search: "",
    },
  });

  function handleSearch(data: string) {
    if (data) {
      params.set("query", data);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function onSubmit(data: QueryBarData) {
    handleSearch(data.search);
  }

  return (
    <section className="flex mx-auto gap-2 max-w-3xl">
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
                  <div className="flex-1">
                    <Input
                      className="bg-white shadow-none w-full"
                      placeholder="Search..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // update RHF state
                        handleSearch(e.target.value); // pass string to your handler
                      }}
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
      <Button variant="theme">
        Add <span className="hidden md:block">transaction</span>
      </Button>
    </section>
  );
}

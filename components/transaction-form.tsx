"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";
import { createNewTransaction, updateTransaction } from "@/db/actions";
import { toast } from "sonner";

const MAX_DESC_L = 120; // on change update transaction table (DB) accordingly

const transactionFormSchema = z.object({
  amount: z.preprocess((val) => {
    const str = String(val).trim();
    // regex to match a valid float (e.g., 123, 123.45)
    if (!/^\d+(\.\d+)?$/.test(str)) return NaN;
    return parseFloat(str);
  }, z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be greater than zero")),
  category: z.string().min(1, "Category is required"),
  transactionDate: z.string().min(1, "Date is required"),
  description: z.string().max(MAX_DESC_L, "Description too long").optional(),
});

export default function TransactionForm({
  currency,
  categories,
  transaction,
  isUpdate = false,
}: {
  currency: string | undefined;
  categories: string[] | undefined;
  transaction?: any;
  isUpdate?: boolean;
}) {
  const [date, setDate] = useState<Date>();
  const [descriptionL, setDescriptionL] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const type: "income" | "expense" = pathname.slice(
    1,
    pathname.lastIndexOf("/")
  ) as "income" | "expense";

  const form = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: "",
      category: "",
      transactionDate: "",
      description: "",
    },
  });

  // Pre-fill form data when updating
  useEffect(() => {
    if (isUpdate && transaction) {
      const amount = (transaction.amount_cents / 100).toString();
      const transactionDate = format(
        new Date(transaction.transaction_date),
        "yyyy-MM-dd"
      );

      form.reset({
        amount: amount,
        category: transaction.category,
        transactionDate: transactionDate,
        description: transaction.description || "",
      });

      setDate(new Date(transaction.transaction_date));
      setDescriptionL(transaction.description?.length || 0);
    }
  }, [isUpdate, transaction, form]);

  const category_arr = categories?.map((item) => ({
    label: item,
    value: item,
  }));

  async function onSubmit(data: z.infer<typeof transactionFormSchema>) {
    try {
      const toastID = toast(
        isUpdate ? "Updating transaction..." : "Creating transaction...",
        {
          description: "Please wait...",
        }
      );

      let result;

      if (isUpdate && transaction) {
        result = await updateTransaction({
          transactionId: transaction.transaction_id,
          amount: data.amount,
          category: data.category,
          transactionDate: new Date(data.transactionDate),
          description: data.description,
          type: type,
        });
      } else {
        result = await createNewTransaction({
          amount: data.amount,
          category: data.category,
          transactionDate: new Date(data.transactionDate),
          description: data.description,
          type: type,
        });
      }

      toast.dismiss(toastID);

      if (result?.status === "error" || result?.error) {
        toast.error(isUpdate ? "Update failed" : "Creation failed", {
          description: result.error,
        });
        return;
      }

      toast.success("Success", {
        description: isUpdate
          ? "Transaction updated successfully"
          : "Transaction created successfully",
      });

      router.replace(`/${type}`);
    } catch (error) {
      console.error(`Transaction form error: ${JSON.stringify(error)}`);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto md:mt-16">
      <CardHeader className="text-center text-3xl font-semibold hidden md:block">
        {isUpdate ? "Update" : "Create"} {type}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col md:flex-row gap-2">
                    <FormLabel className="flex gap-2 items-center whitespace-nowrap">
                      Amount ({currency})
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: 123.45"
                        {...field}
                        value={field.value?.toString() ?? ""}
                        className="shadow-none"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col md:flex-row gap-2">
                    <FormLabel>Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between shadow-none bg-white w-[285px] md:w-[375px]",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? category_arr?.find(
                                  (category) => category.value === field.value
                                )?.label
                              : "Select category"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" w-[300px] md:w-[390px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {category_arr?.map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue("category", category.value, {
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  {category.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      category.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col md:flex-row gap-3">
                    <FormLabel>Transaction date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal shadow-none bg-white"
                        >
                          <CalendarIcon />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            form.setValue(
                              "transactionDate",
                              selectedDate
                                ? format(selectedDate, "yyyy-MM-dd")
                                : ""
                            );
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description ({descriptionL}/{MAX_DESC_L})
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="shadow-none"
                      {...field}
                      placeholder="ex: Sunday shopping"
                      onChange={(e) => {
                        field.onChange(e);
                        setDescriptionL(e.target.value.length);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="theme" className="w-full">
              {isUpdate ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

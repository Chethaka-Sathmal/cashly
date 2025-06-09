"use client";

import { useRef } from "react";
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
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { currencyISO_Codes } from "@/utils/constants";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/utils/uploadthing";

const currencyISO_CodesArray = currencyISO_Codes.map((c) => c.value) as [
  string,
  ...string[]
];

const onboardingFormSchema = z.object({
  fName: z
    .string()
    .min(3, "Should contain at least 3 characters")
    .max(20, "Should not contain more than 20 characters"),
  lName: z
    .string()
    .min(3, "Should contain at least 3 characters")
    .max(20, "Should not contain more than 20 characters"),
  currency: z.enum(currencyISO_CodesArray, {
    errorMap: () => ({ message: "Please select a valid currency" }),
  }),
  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size <= 4 * 1024 * 1024, {
      message: "Profile picture must be less than 4MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    })
    .optional()
    .nullable(),
});

export default function OnboardingForm() {
  const profilePictureRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      fName: "",
      lName: "",
      currency: "LKR",
      profilePicture: null,
    },
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader");

  async function onSubmit(data: z.infer<typeof onboardingFormSchema>) {
    /**
     * 🛑
     * Add functionality
     * Update user metadata -> Set onboardingComplete to True
     */
    let profilePictureURL = null;

    const fName = data.fName;
    const lName = data.lName;
    const currency = data.currency;
    const profilePicture = data.profilePicture;

    try {
      if (profilePicture) {
        // if no profilePicture was selected, defaults to null
        const ppUploadResult = await startUpload([profilePicture]);
        profilePictureURL = ppUploadResult?.[0]?.ufsUrl ?? null;
      }
      // router.replace("/dashboard");
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  return (
    <section className="flex justify-center items-center">
      <Card className="bg-white shadow-none w-lg">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-bold">Welcome aboard</h1>
                  <p className="text-muted-foreground text-balance">
                    Let's get things started
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="fName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex:John"
                          {...field}
                          className="shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex:Doe"
                          {...field}
                          className="shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <FormLabel>
                        Currency <span className="text-destructive">*</span>
                      </FormLabel>
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
                                ? currencyISO_Codes.find(
                                    (language) => language.value === field.value
                                  )?.label
                                : "Select language"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className=" w-[300px] md:w-[390px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search currency..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No currency found.</CommandEmpty>
                              <CommandGroup>
                                {currencyISO_Codes.map((currencyISO_Code) => (
                                  <CommandItem
                                    value={currencyISO_Code.label}
                                    key={currencyISO_Code.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "currency",
                                        currencyISO_Code.value
                                      );
                                    }}
                                  >
                                    {currencyISO_Code.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        currencyISO_Code.value === field.value
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
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between gap-3">
                        <Input
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          name="profilePicture"
                          className="shadow-none"
                          ref={(el) => {
                            field.ref(el);
                            profilePictureRef.current = el;
                          }}
                        />
                        <Button
                          type="button"
                          variant={"destructiveLight"}
                          size={"icon"}
                          className="border-1"
                          onClick={() => {
                            form.setValue("profilePicture", undefined, {
                              shouldValidate: true,
                            });

                            if (profilePictureRef.current) {
                              profilePictureRef.current.value = "";
                            }
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-theme hover:bg-theme/90 active:bg-theme"
                disabled={form.formState.isSubmitting}
              >
                Finish
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

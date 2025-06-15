"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/utils/uploadthing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { currencyISO_Codes } from "@/utils/constants";
import { AwardIcon, Check, ChevronsUpDown, Trash2 } from "lucide-react";
import {
  onboardingFormSchema,
  type onboardingFormSchemaType,
} from "@/lib/zod-schema";
import { createUserOnboarding, editUserProfile } from "@/db/actions";
import { UserDataFormProps_func } from "@/types";

export default function UserDataForm({
  title,
  subTittle,
  type,
  buttonTitle,
  fName,
  lName,
  currency,
}: UserDataFormProps_func) {
  const profilePictureRef = useRef<HTMLInputElement | null>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      fName: fName ? fName : "",
      lName: lName ? lName : "",
      currency: currency ? currency : "LKR",
      profilePicture: null,
    },
  });

  async function onSubmitCreate(data: onboardingFormSchemaType) {
    try {
      // Display a toast while function executes
      const toastID = toast("Creating user...", {
        description: "Please wait",
        dismissible: true,
        duration: Infinity,
      });

      let profilePictureURL: string | null = null;
      let profilePictureKey: string | null = null;
      const profilePicture = data.profilePicture;

      if (profilePicture) {
        // if no profilePicture was selected, defaults to null
        const ppUploadResult = await startUpload([profilePicture]);
        profilePictureURL = ppUploadResult?.[0]?.ufsUrl ?? null;
        profilePictureKey = ppUploadResult?.[0]?.key ?? null;
      }

      // pass the data to server
      const result = await createUserOnboarding({
        fName: data.fName,
        lName: data.lName,
        currency: data.currency,
        profilePictureURL,
        profilePictureKey,
      });

      toast.dismiss(toastID);

      if (result.status === "error" || result.error) {
        toast.error("Onboarding failed", {
          description: result.error,
        });

        return;
      }

      toast.success("Onboarding successful", {
        description: "You will be redirected shortly",
      });

      router.replace("/dashboard");
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error("Submission error", {
        description: "Please try again later",
      });
    }
  }

  async function onSubmitEdit(data: onboardingFormSchemaType) {
    try {
      const toastID = toast("Updating user information", {
        description: "Please wait...",
      });

      const result = await editUserProfile({
        fName: data.fName,
        lName: data.lName,
        currency: data.currency,
      });

      toast.dismiss(toastID);

      if (result.status === "error" || result.error) {
        toast.error("Update failed", {
          description: "Hello world",
        });

        return;
      }

      toast.success("Success", {
        description: "Your profile updated successfully",
      });

      router.replace("/settings");
    } catch (error) {
      console.error(`User data form error: ${JSON.stringify(error)}`);
    }
  }

  return (
    <section className="flex justify-center items-center">
      <Card className="bg-white shadow-none w-lg">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                type === "create" ? onSubmitCreate(data) : onSubmitEdit(data)
              )}
              className="space-y-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-bold">{title}</h1>
                  <p className="text-muted-foreground text-balance">
                    {subTittle}
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
              {type === "create" && (
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
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
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
              )}
              <Button
                type="submit"
                className="w-full bg-theme hover:bg-theme/90 active:bg-theme"
                disabled={form.formState.isSubmitting || isUploading}
              >
                {buttonTitle}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

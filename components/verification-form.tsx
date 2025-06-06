"use client";

import { useState } from "react";
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
import { useSignUp } from "@clerk/nextjs";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

const verificationSchema = z.object({
  code: z.string(),
});

export default function VerificationFrom() {
  const [errors, setErrors] = useState<(ClerkAPIError | string)[]>([]);
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof verificationSchema>) {
    if (!isLoaded || !signUp || !setActive) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/onboarding");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }

  if (!isLoaded) return;

  return (
    <section className="flex justify-center items-center">
      <Card className="bg-white shadow-none w-lg">
        <CardContent className="flex flex-col gap-6 shadow-none">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold">Verification Code</h1>
                <p className="text-muted-foreground text-balance">
                  We sent you a verification code to your email
                </p>
              </div>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="shadow-none text-center"
                        type="text"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errors && errors.length > 0 && (
                <Alert variant={"destructive"}>
                  <AlertCircleIcon />
                  <AlertTitle>Verification error</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      {errors.map((el, index) => (
                        <li key={index}>
                          {typeof el === "string"
                            ? el
                            : el.longMessage || el.message}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                variant={"theme"}
                disabled={form.formState.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

"use client";

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

const verificationSchema = z.object({
  code: z.string(),
});

export default function VerificationFrom() {
  const { isLoaded, signUp, setActive } = useSignUp();

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
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        // router.push("/");
      }
    } catch (err) {
      console.log("Error:", JSON.stringify(err, null, 2));
    }
  }

  if (!isLoaded) return;

  return (
    <section className="flex justify-center items-center">
      <Card className="bg-white shadow-none w-lg h-[240px]">
        <CardContent className="flex flex-col gap-6 shadow-none">
          <div>
            <h1 className="text-2xl font-bold">Verification Code</h1>
            <span className="text-muted-foreground text-center text-sm">
              We sent you a verification code to your email
            </span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

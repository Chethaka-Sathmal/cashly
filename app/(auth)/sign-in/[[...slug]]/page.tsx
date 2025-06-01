"use client";

import { AuthForm } from "@/components/auth-form";
import { signInFromSchema } from "@/lib/zod-schema";
import { z } from "zod";

export default function SignInPage() {
  type SignInFormSchemaProps = z.infer<typeof signInFromSchema>;

  async function onSubmit(data: SignInFormSchemaProps) {
    console.log("Form submitted");
    console.log(data.email);
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm
          variant="sign-in"
          schema={signInFromSchema}
          onSubmit={onSubmit}
          defaultValues={{ email: "", password: "" }}
        />
      </div>
    </div>
  );
}

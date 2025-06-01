"use client";

import { AuthForm } from "@/components/auth-form";
import { signUpFromSchema } from "@/lib/zod-schema";
import { z } from "zod";

export default function SignUpPage() {
  type SignUpFormSchemaProps = z.infer<typeof signUpFromSchema>;

  async function onSubmit(data: SignUpFormSchemaProps) {
    console.log("Form submitted");
    console.log(data.email);
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm
          variant="sign-up"
          schema={signUpFromSchema}
          onSubmit={onSubmit}
          defaultValues={{ email: "", password: "", confirmPassword: "" }}
        />
      </div>
    </div>
  );
}

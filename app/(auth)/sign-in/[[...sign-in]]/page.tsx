"use client";

import AuthForm from "@/components/auth-form";
import { signInFromSchema } from "@/lib/zod-schema";
import { z } from "zod";

export default function SignInPage() {
  type SignInFormSchemaProps = z.infer<typeof signInFromSchema>;

  async function onSubmit(data: SignInFormSchemaProps) {
    console.log("Form submitted");
    console.log(data.email);
  }

  return (
    <AuthForm
      variant="sign-in"
      schema={signInFromSchema}
      onSubmit={onSubmit}
      defaultValues={{ email: "", password: "" }}
    />
  );
}

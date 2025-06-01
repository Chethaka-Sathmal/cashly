"use client";

import { useState } from "react";
import { z } from "zod";
import { useSignUp } from "@clerk/nextjs";
import { signUpFromSchema } from "@/lib/zod-schema";
import AuthForm from "@/components/auth-form";
import VerificationFrom from "@/components/verification-form";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(true);
  type SignUpFormSchemaProps = z.infer<typeof signUpFromSchema>;

  async function onSubmit(data: SignUpFormSchemaProps) {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (error) {
      // ⚠ ️ handle errors with RHF
    }
  }

  if (!isLoaded) return;

  if (verifying) return <VerificationFrom />;

  return (
    <AuthForm
      variant="sign-up"
      schema={signUpFromSchema}
      onSubmit={onSubmit}
      defaultValues={{ email: "", password: "", confirmPassword: "" }}
    />
  );
}

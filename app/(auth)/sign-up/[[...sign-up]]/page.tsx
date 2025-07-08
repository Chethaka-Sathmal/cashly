"use client";

import { useState } from "react";
import { z } from "zod";
import { useSignUp } from "@clerk/nextjs";
import { signUpFromSchema } from "@/lib/zod-schema";
import AuthForm from "@/components/auth-form";
import VerificationFrom from "@/components/verification-form";
import { ClerkAPIError, OAuthStrategy } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [errors, setErrors] = useState<(ClerkAPIError | string)[]>([]);
  type SignUpFormSchemaProps = z.infer<typeof signUpFromSchema>;

  async function onSubmit(data: SignUpFormSchemaProps) {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        unsafeMetadata: {
          onboardingComplete: false,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }

  function signInWithGoogle(strategy: OAuthStrategy) {
    if (!signUp) return;

    return signUp
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback", // Check Clerk documentation -> https://clerk.com/docs/custom-flows/oauth-connections
        redirectUrlComplete: "/onboarding",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(err.errors);
        console.error(err, null, 2);
        setErrors(err);
      });
  }

  if (!isLoaded || !signUp) return null;

  if (verifying) return <VerificationFrom />;

  return (
    <AuthForm
      variant="sign-up"
      schema={signUpFromSchema}
      onSubmit={onSubmit}
      authenticateWith={signInWithGoogle}
      defaultValues={{ email: "", password: "", confirmPassword: "" }}
      errors={errors}
    />
  );
}

"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth-form";
import { signInFromSchema } from "@/lib/zod-schema";
import { z } from "zod";
import { ClerkAPIError, OAuthStrategy } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export default function SignInPage() {
  const [errors, setErrors] = useState<(ClerkAPIError | string)[]>([]);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  type TSignInFromSchema = z.infer<typeof signInFromSchema>;

  async function onSubmit(data: TSignInFromSchema) {
    if (!isLoaded || !signIn) return;

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign-in not complete:", result);
        setErrors(["Unexpected error occurred. Please try again later"]);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }

  async function signInWithGoogle(strategy: OAuthStrategy) {
    if (!signIn) return;

    return await signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/dashboard",
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

  if (!isLoaded || !signIn) return null;

  return (
    <AuthForm
      variant="sign-in"
      schema={signInFromSchema}
      onSubmit={onSubmit}
      authenticateWith={signInWithGoogle}
      defaultValues={{ email: "", password: "" }}
      errors={errors}
    />
  );
}

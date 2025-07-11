"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthFormProps } from "@/types";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, DefaultValues } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, Eye, EyeClosed } from "lucide-react";
import Link from "next/link";

export default function AuthForm<T extends FieldValues>({
  className,
  variant,
  onSubmit,
  authenticateWith,
  schema,
  defaultValues,
  errors,
  ...props
}: AuthFormProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const isSignIn = variant === "sign-in";

  type fromTypes = z.infer<typeof schema>;

  const form = useForm<fromTypes>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-white shadow-none">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-bold">
                    {isSignIn ? "Welcome Back" : "Create an Account"}
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    {isSignIn
                      ? "Login to your Cashly account"
                      : "Create your Cashly account"}
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="shadow-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          {/** ⚠️ Implement forgot password feature later
                           * Check app/(auth)/forgot-password/page.tsx
                           */}
                          {/* {isSignIn && (
                            <Link
                              href="/forgot-password"
                              className="ml-auto text-sm underline-offset-2 hover:underline text-theme"
                            >
                              Forgot your password?
                            </Link>
                          )} */}
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              required
                              className="shadow-none"
                              {...field}
                            />
                            {/* Password visible button */}
                            <Button
                              type="button"
                              variant={"ghost"}
                              size={"icon"}
                              className="border-1"
                              onClick={() =>
                                setShowPassword((prevValue) => !prevValue)
                              }
                            >
                              {showPassword ? <Eye /> : <EyeClosed />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!isSignIn && (
                  <div className="grid gap-3">
                    <FormField
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Confirm Password</FormLabel>
                          </div>
                          <FormControl>
                            <div className="flex items-center gap-3">
                              <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                className="shadow-none"
                                {...field}
                              />
                              {/* Password visible button */}
                              <Button
                                type="button"
                                variant={"ghost"}
                                size={"icon"}
                                className="border-1"
                                onClick={() =>
                                  setShowPassword((prevValue) => !prevValue)
                                }
                              >
                                {showPassword ? <Eye /> : <EyeClosed />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div id="clerk-captcha" />
                {errors && errors.length > 0 && (
                  <Alert variant={"destructive"}>
                    <AlertCircleIcon />
                    <AlertTitle>
                      {isSignIn ? "Sign in error" : "Sign up error"}
                    </AlertTitle>
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
                {/* Form submit button */}
                <Button
                  variant="theme"
                  type="submit"
                  disabled={form.formState.isSubmitting || disabled}
                  className="w-full shadow-none"
                >
                  {isSignIn ? "Login" : "Sign Up"}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="w-full">
                  {/* OAuth button */}
                  <Button
                    variant="outline"
                    type="button"
                    disabled={form.formState.isSubmitting || disabled}
                    className="w-full shadow-none"
                    onClick={async () => {
                      setDisabled(true);
                      try {
                        await authenticateWith("oauth_google");
                      } finally {
                        setDisabled(false);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-base">
                      {isSignIn ? "Login with Google" : "Sign up with Google"}
                    </span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {isSignIn ? (
                    <span>
                      Don't have an account?{" "}
                      <a
                        href="/sign-up"
                        className="underline underline-offset-4 text-theme font-semibold"
                      >
                        Sign up
                      </a>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{" "}
                      <a
                        href="/sign-in"
                        className="underline underline-offset-4 text-theme font-semibold"
                      >
                        Sign in
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden md:flex items-center justify-center bg-theme">
            <div className="flex items-baseline gap-4">
              <Image
                src={"/logo-transparent.svg"}
                alt="Cashly logo"
                height={40}
                width={40}
              />
              <span className="font-robot-slab text-white text-4xl">
                Cashly
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}

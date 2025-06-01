import { z } from "zod";

export const signUpFromSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password should have at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const onboardingFromSchema = z.object({
  fName: z
    .string()
    .min(3, "First name must be consistent of at least 3 characters")
    .max(20, "First name must not contain more than 20 characters"),
  lName: z
    .string()
    .min(3, "Last Name must be consistent of at least 3 characters")
    .max(20, "ame must not contain more than 20 characters"),
  currency: z.string(),
  profilePicture: z.string(),
});

export const signInFromSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

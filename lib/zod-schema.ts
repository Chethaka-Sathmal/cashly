import { z } from "zod";
import { currencyISO_Codes } from "@/utils/constants";

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

const currencyISO_CodesArray = currencyISO_Codes.map((c) => c.value) as [
  string,
  ...string[]
];

export const onboardingFormSchema = z.object({
  fName: z
    .string()
    .min(3, "Should contain at least 3 characters")
    .max(20, "Should not contain more than 20 characters"),
  lName: z
    .string()
    .min(3, "Should contain at least 3 characters")
    .max(20, "Should not contain more than 20 characters"),
  currency: z.enum(currencyISO_CodesArray, {
    errorMap: () => ({ message: "Please select a valid currency" }),
  }),
  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size <= 4 * 1024 * 1024, {
      message: "Profile picture must be less than 4MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    })
    .optional()
    .nullable(),
});

export type onboardingFormSchemaType = z.infer<typeof onboardingFormSchema>;

export const signInFromSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// import { z } from "zod";

// export const signUpFromSchema = z
//   .object({
//     email: z.string().email("Invalid email"),
//     password: z.string().min(8, "Password should have minimum 8 characters"),
//     confirmPassword: z.string().min(8),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"], // error goes to the confirmPassword field
//   });

// export type SignUpFromSchemaProps = z.infer<typeof signUpFromSchema>;

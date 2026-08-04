import { z } from "zod";

const emailSchema = z.email({
  error: "Enter a valid email address.",
});

const passwordSchema = z
  .string()
  .min(8, {
    error: "Password must contain at least 8 characters.",
  })
  .max(128, {
    error: "Password cannot exceed 128 characters.",
  })
  .regex(/[a-z]/, {
    error: "Password must contain a lowercase letter.",
  })
  .regex(/[A-Z]/, {
    error: "Password must contain an uppercase letter.",
  })
  .regex(/[0-9]/, {
    error: "Password must contain a number.",
  });

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, {
        error: "Full name must contain at least 2 characters.",
      })
      .max(80, {
        error: "Full name cannot exceed 80 characters.",
      }),

    email: emailSchema,

    password: passwordSchema,

    confirmPassword: z.string().min(1, {
      error: "Confirm your password.",
    }),
  })
  .refine(
    (values) => values.password === values.confirmPassword,
    {
      error: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  email: emailSchema,

  password: z.string().min(1, {
    error: "Enter your password.",
  }),
});

export type RegisterFormValues = z.infer<
  typeof registerSchema
>;

export type LoginFormValues = z.infer<
  typeof loginSchema
>;
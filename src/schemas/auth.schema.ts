import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "errors.emailRequired")
    .email("errors.invalidEmail"),
  password: z
    .string()
    .min(1, "errors.passwordRequired")
    .min(6, "errors.passwordMinLength"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

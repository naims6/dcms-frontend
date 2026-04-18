import z from "zod";

export const loginSchema = z.object({
  registeredId: z
    .string()
    .min(1, "errors.registeredIdRequired")
    .min(3, "errors.registeredIdMinLength"),
  pin: z
    .string()
    .min(1, "errors.pinRequired")
    .min(4, "errors.pinMinLength")
    .regex(/^\d+$/, "errors.pinNumeric"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

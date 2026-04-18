import z from "zod";

export const loginSchema = z.object({
  registeredId: z
    .string()
    .min(1, "Registered ID is required")
    .min(3, "Registered ID must be at least 3 characters"),
  pin: z
    .string()
    .min(1, "PIN is required")
    .min(4, "PIN must be at least 4 digits")
    .regex(/^\d+$/, "PIN must contain only numbers"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Student } from "@/types/student.types";

// ── Option lists (mirrors backend enums) ──────────────────────────────────
export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"] as const;
export const RELIGION_OPTIONS = ["ISLAM", "HINDU", "CHRISTIAN", "OTHER"] as const;
export const BLOOD_GROUP_OPTIONS = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
] as const;
export const RELATIONSHIP_OPTIONS = ["FATHER", "MOTHER", "OTHER"] as const;

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_ROLL = 1;
export const MAX_ROLL = 9999;

// Enum-or-empty so an untouched <Select> still validates
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]);

const optionalEmail = z.string().email("Enter a valid email address.").or(z.literal(""));

// ── Guardian row ──────────────────────────────────────────────────────────
export const guardianFormSchema = z.object({
  /** Existing guardian id when editing — sent back so the server updates in place. */
  id: z.string().optional(),
  name: z.string().trim(),
  relationship: z.enum(RELATIONSHIP_OPTIONS),
  phone: z.string(),
  email: optionalEmail,
  occupation: z.string(),
  address: z.string(),
});

// ── Student form (shared base shape) ──────────────────────────────────────
// NOTE: every field is a plain string so `register()` works and both the
// create and update resolvers infer the exact same value type.
export const studentFormSchema = z.object({
  // Account
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string(),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z.string(),
  password: z.string(),

  // Academic
  studentId: z.string().trim(),
  classId: z.string(),
  rollNumber: z
    .string()
    .refine(
      (v) => !v || (Number(v) >= MIN_ROLL && Number(v) <= MAX_ROLL),
      `Roll number must be between ${MIN_ROLL} and ${MAX_ROLL}.`
    ),

  // Personal
  dateOfBirth: z.string(),
  gender: optionalEnum(GENDER_OPTIONS),
  bloodGroup: optionalEnum(BLOOD_GROUP_OPTIONS),
  religion: optionalEnum(RELIGION_OPTIONS),
  admissionDate: z.string(),
  emergencyContact: z.string(),

  // Guardians
  guardians: z.array(guardianFormSchema),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

// ── Create mode: student ID + password are mandatory ──────────────────────
export const createStudentSchema = studentFormSchema.extend({
  studentId: z.string().trim().min(1, "Student ID is required."),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
});

// ── Edit mode: credentials are not managed on this form ───────────────────
export const updateStudentSchema = studentFormSchema;

export const createStudentResolver = zodResolver(createStudentSchema);
export const updateStudentResolver = zodResolver(updateStudentSchema);

// ── Default values ────────────────────────────────────────────────────────
export function emptyGuardian() {
  return {
    name: "",
    relationship: "FATHER" as const,
    phone: "",
    email: "",
    occupation: "",
    address: "",
  };
}

/**
 * Maps an existing student into react-hook-form default values.
 */
export function studentToFormDefaults(student?: Student | null): StudentFormValues {
  return {
    firstName: student?.user.firstName ?? "",
    lastName: student?.user.lastName ?? "",
    email: student?.user.email ?? "",
    phone: student?.user.phone ?? "",
    password: "",
    studentId: student?.studentId ?? "",
    classId: student?.classId ?? "",
    rollNumber: student?.rollNumber != null ? String(student.rollNumber) : "",
    dateOfBirth: student?.dateOfBirth?.split("T")[0] ?? "",
    gender: student?.gender ?? "",
    bloodGroup: student?.bloodGroup ?? "",
    religion: student?.religion ?? "",
    admissionDate: student?.admissionDate?.split("T")[0] ?? "",
    emergencyContact: student?.emergencyContact ?? "",
    guardians: (student?.guardians ?? []).map((g) => ({
      id: g.id,
      name: g.name,
      relationship: g.relationship,
      phone: g.phone ?? "",
      email: g.email ?? "",
      occupation: g.occupation ?? "",
      address: g.address ?? "",
    })),
  };
}

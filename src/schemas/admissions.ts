import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const PHONE_REGEX = /^[0-9+\-\s()]+$/;
const MIN_PHONE_LENGTH = 10;
const MIN_NAME_LENGTH = 2;
const MIN_ADDRESS_LENGTH = 5;
const MIN_CITY_LENGTH = 2;
const MIN_POSTAL_CODE_LENGTH = 4;

export const admissionFormSchema = z
  .object({
    // Student Information
    fullName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_NAME_LENGTH },
        }),
      })
      .max(100, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 100 },
        }),
      }),
    dateOfBirth: z.string().min(1, { message: "errors.required" }),
    gender: z.string().min(1, { message: "errors.required" }),
    bloodGroup: z.string().optional(),
    religion: z.string(),
    studentPhoto: z
      .string()
      .url("errors.invalidUrl")
      .optional()
      .or(z.literal("")),

    // Academic Information
    classApplying: z.string().min(1, { message: "errors.required" }),
    previousSchool: z.string(),
    previousClass: z.string(),
    previousGrade: z.string().optional(),

    // Parent Information — Father
    fatherName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_NAME_LENGTH },
        }),
      })
      .max(100, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 100 },
        }),
      }),
    fatherOccupation: z.string(),
    fatherPhone: z
      .string()
      .min(MIN_PHONE_LENGTH, { message: "errors.minPhoneLength" })
      .regex(PHONE_REGEX, { message: "errors.invalidPhone" }),

    // Parent Information — Mother
    motherName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_NAME_LENGTH },
        }),
      })
      .max(100, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 100 },
        }),
      }),
    motherOccupation: z.string(),
    motherPhone: z
      .string()
      .min(MIN_PHONE_LENGTH, { message: "errors.minPhoneLength" })
      .regex(PHONE_REGEX, { message: "errors.invalidPhone" }),

    // Contact Information
    address: z
      .string()
      .min(MIN_ADDRESS_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_ADDRESS_LENGTH },
        }),
      })
      .max(500, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 500 },
        }),
      }),
    city: z
      .string()
      .min(MIN_CITY_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_CITY_LENGTH },
        }),
      })
      .max(50, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 50 },
        }),
      }),
    postalCode: z
      .string()
      .min(MIN_POSTAL_CODE_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_POSTAL_CODE_LENGTH },
        }),
      })
      .max(20, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 20 },
        }),
      }),
    email: z.email({ message: "errors.invalidEmail" }),
    emergencyContact: z
      .string()
      .min(MIN_PHONE_LENGTH, { message: "errors.minPhoneLength" })
      .regex(PHONE_REGEX, { message: "errors.invalidPhone" }),

    // Additional Information
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "errors.agreeTerms",
    }),
    password: z.string().min(6, {
      message: JSON.stringify({
        key: "errors.minLength",
        values: { min: 6 },
      }),
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwordMatch",
    path: ["confirmPassword"],
  });

// TypeScript type inferred from schema
export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

// Default values — all strings for register() compatibility
export const admissionFormDefaultValues: AdmissionFormValues = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  religion: "",
  studentPhoto: "",
  classApplying: "",
  previousSchool: "",
  previousClass: "",
  previousGrade: "",
  fatherName: "",
  fatherOccupation: "",
  fatherPhone: "",
  motherName: "",
  motherOccupation: "",
  motherPhone: "",
  address: "",
  city: "",
  postalCode: "",
  email: "",
  emergencyContact: "",
  agreeTerms: false,
  password: "",
  confirmPassword: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const admissionFormResolver = zodResolver(admissionFormSchema as any);

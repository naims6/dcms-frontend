import { z } from "zod";
import type { Resolver } from "react-hook-form";

const PHONE_REGEX = /^[0-9+\-\s()]+$/;
const MIN_PHONE_LENGTH = 10;
const MIN_NAME_LENGTH = 2;
const MIN_ADDRESS_LENGTH = 5;
const MIN_CITY_LENGTH = 2;
const MIN_POSTAL_CODE_LENGTH = 4;

export const admissionFormSchema = z.object({
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
  dateOfBirth: z.date().min(1, "errors.required"),
  gender: z.string().min(1, "errors.required"),
  bloodGroup: z.string().optional(),
  religion: z.string(),
  studentPhoto: z.string().url("errors.invalidUrl").optional().or(z.literal("")),

  // Academic Information
  classApplying: z.string().min(1, "errors.required"),
  previousSchool: z.string(),
  previousClass: z.string(),
  previousGrade: z.string().optional(),

  // Parent Information - Father
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
    .min(MIN_PHONE_LENGTH, "errors.minPhoneLength")
    .regex(PHONE_REGEX, "errors.invalidPhone"),

  // Parent Information - Mother
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
    .min(MIN_PHONE_LENGTH, "errors.minPhoneLength")
    .regex(PHONE_REGEX, "errors.invalidPhone"),

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
      message: JSON.stringify({ key: "errors.maxLength", values: { max: 50 } }),
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
      message: JSON.stringify({ key: "errors.maxLength", values: { max: 20 } }),
    }),
  email: z.email("errors.invalidEmail"),
  emergencyContact: z
    .string()
    .min(MIN_PHONE_LENGTH, "errors.minPhoneLength")
    .regex(PHONE_REGEX, "errors.invalidPhone"),

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
}).refine((data) => data.password === data.confirmPassword, {
  message: "errors.passwordMatch",
  path: ["confirmPassword"],
});

// typescript type
export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

// default values
export const admissionFormDefaultValues: AdmissionFormValues = {
  fullName: "",
  dateOfBirth: new Date(),
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

export const admissionFormResolver: Resolver<AdmissionFormValues> = async (
  values,
) => {
  const parsedValues = admissionFormSchema.safeParse(values);

  if (parsedValues.success) {
    return {
      values: parsedValues.data,
      errors: {},
    };
  }

  const errors: Partial<
    Record<keyof AdmissionFormValues, { type: string; message: string }>
  > = {};

  for (const issue of parsedValues.error.issues) {
    const fieldName = issue.path[0];

    if (typeof fieldName !== "string") {
      continue;
    }

    const key = fieldName as keyof AdmissionFormValues;
    if (errors[key]) {
      continue;
    }

    errors[key] = {
      type: issue.code,
      message: issue.message,
    };
  }

  return {
    values: {},
    errors,
  };
};

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const PHONE_REGEX = /^[0-9+\-\s()]+$/;
const MIN_PHONE_LENGTH = 10;
const MIN_NAME_LENGTH = 2;
const MIN_ADDRESS_LENGTH = 3;

export const admissionFormSchema = z
  .object({
    // Student Personal Information
    firstName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_NAME_LENGTH },
        }),
      })
      .max(50, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 50 },
        }),
      }),
    lastName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_NAME_LENGTH },
        }),
      })
      .max(50, {
        message: JSON.stringify({
          key: "errors.maxLength",
          values: { max: 50 },
        }),
      }),
    dateOfBirth: z.string().min(1, { message: "errors.required" }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "errors.required",
    }),
    bloodGroup: z.string().optional(),
    religion: z.string().optional(),
    nationality: z.string().default("Bangladeshi"),
    nationalIdOrBirthReg: z.string().optional(),

    // Academic Information
    targetClassId: z.string().min(1, { message: "errors.required" }),
    previousSchoolName: z.string().optional(),
    previousClass: z.string().optional(),
    previousGpa: z.string().optional(),
    previousBoardRoll: z.string().optional(),
    previousPassingYear: z.string().optional(),

    // Parent Information — Father
    fatherName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_NAME_LENGTH },
        }),
      })
      .max(100),
    fatherPhone: z
      .string()
      .optional()
      .refine(
        (val) => !val || (val.length >= MIN_PHONE_LENGTH && PHONE_REGEX.test(val)),
        { message: "errors.invalidPhone" },
      ),
    fatherOccupation: z.string().optional(),
    fatherNid: z.string().optional(),

    // Parent Information — Mother
    motherName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_NAME_LENGTH },
        }),
      })
      .max(100),
    motherPhone: z
      .string()
      .optional()
      .refine(
        (val) => !val || (val.length >= MIN_PHONE_LENGTH && PHONE_REGEX.test(val)),
        { message: "errors.invalidPhone" },
      ),
    motherOccupation: z.string().optional(),
    motherNid: z.string().optional(),

    // Local Guardian (Optional)
    localGuardianName: z.string().optional(),
    localGuardianPhone: z.string().optional(),
    localGuardianRelation: z.string().optional(),
    localGuardianAddress: z.string().optional(),

    // Contact Information & Present Address
    email: z.string().email({ message: "errors.invalidEmail" }),
    phone: z
      .string()
      .min(MIN_PHONE_LENGTH, { message: "errors.minPhoneLength" })
      .regex(PHONE_REGEX, { message: "errors.invalidPhone" }),
    presentStreetAddress: z
      .string()
      .min(MIN_ADDRESS_LENGTH, {
        message: JSON.stringify({
          key: "errors.minLength",
          values: { min: MIN_ADDRESS_LENGTH },
        }),
      }),
    presentUpazila: z.string().min(2, { message: "errors.required" }),
    presentDistrict: z.string().min(2, { message: "errors.required" }),
    presentDivision: z.string().min(2, { message: "errors.required" }),
    presentPostCode: z.string().optional(),

    // Permanent Address
    sameAsPresentAddress: z.boolean().default(true),
    permanentStreetAddress: z.string().optional(),
    permanentUpazila: z.string().optional(),
    permanentDistrict: z.string().optional(),
    permanentDivision: z.string().optional(),
    permanentPostCode: z.string().optional(),

    // Credentials & Agreement
    password: z.string().min(6, {
      message: JSON.stringify({
        key: "errors.minLength",
        values: { min: 6 },
      }),
    }),
    confirmPassword: z.string().min(6, { message: "errors.required" }),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "errors.agreeTerms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwordMatch",
    path: ["confirmPassword"],
  });

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

export const admissionFormDefaultValues: AdmissionFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "MALE",
  bloodGroup: "",
  religion: "ISLAM",
  nationality: "Bangladeshi",
  nationalIdOrBirthReg: "",
  targetClassId: "",
  previousSchoolName: "",
  previousClass: "",
  previousGpa: "",
  previousBoardRoll: "",
  previousPassingYear: "",
  fatherName: "",
  fatherPhone: "",
  fatherOccupation: "",
  fatherNid: "",
  motherName: "",
  motherPhone: "",
  motherOccupation: "",
  motherNid: "",
  localGuardianName: "",
  localGuardianPhone: "",
  localGuardianRelation: "",
  localGuardianAddress: "",
  email: "",
  phone: "",
  presentStreetAddress: "",
  presentUpazila: "",
  presentDistrict: "Dhaka",
  presentDivision: "Dhaka",
  presentPostCode: "",
  sameAsPresentAddress: true,
  permanentStreetAddress: "",
  permanentUpazila: "",
  permanentDistrict: "",
  permanentDivision: "",
  permanentPostCode: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const admissionFormResolver = zodResolver(admissionFormSchema as any);

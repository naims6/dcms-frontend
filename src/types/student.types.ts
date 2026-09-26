// ── Enums (matches backend exactly) ────────────────────────────────────────
export type StudentGender = "MALE" | "FEMALE" | "OTHER";

export type StudentBloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type StudentStatus = "ACTIVE" | "INACTIVE" | "GRADUATED" | "EXPELLED";

export type GuardianRelationship = "FATHER" | "MOTHER" | "OTHER";

export type StudentReligion = "ISLAM" | "HINDU" | "CHRISTIAN" | "OTHER";

// ── Core models ────────────────────────────────────────────────────────────
export interface StudentUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roles: Array<{ id: string; name: string }>;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: GuardianRelationship;
  phone: string | null;
  email: string | null;
  occupation: string | null;
  address: string | null;
}

export interface Student {
  id: string;
  studentId: string;
  classId: string | null;
  rollNumber: number | null;
  dateOfBirth: string | null;
  gender: StudentGender | null;
  bloodGroup: StudentBloodGroup | null;
  religion: StudentReligion | null;
  admissionDate: string | null;
  emergencyContact: string | null;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  guardians: Guardian[];
  user: StudentUser;
}

export interface StudentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedStudentsResponse {
  data: Student[];
  meta: StudentMeta;
}

// ── Query params ───────────────────────────────────────────────────────────
export interface GetStudentsQueryParams {
  page?: number;
  limit?: number;
  classId?: string;
}

// ── Mutation DTOs ──────────────────────────────────────────────────────────
export interface GuardianDto {
  name: string;
  relationship: GuardianRelationship;
  phone?: string;
  email?: string;
  occupation?: string;
  address?: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  imageUrl?: string;
  studentId: string;
  classId?: string;
  rollNumber?: number;
  dateOfBirth?: string;
  gender?: StudentGender;
  bloodGroup?: StudentBloodGroup;
  religion?: StudentReligion;
  admissionDate?: string;
  emergencyContact?: string;
  guardians?: GuardianDto[];
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  studentId?: string;
  classId?: string;
  rollNumber?: number;
  dateOfBirth?: string;
  gender?: StudentGender;
  bloodGroup?: StudentBloodGroup;
  religion?: StudentReligion;
  admissionDate?: string;
  emergencyContact?: string;
  /**
   * Full replacement of the student's guardian set.
   * Entries with an `id` are updated in place, entries without one are created,
   * and existing guardians missing from the array are removed server-side.
   */
  guardians?: UpdateGuardianDto[];
}

/** A guardian row on update — `id` present means "update this existing guardian". */
export interface UpdateGuardianDto extends GuardianDto {
  id?: string;
}

export interface DeleteStudentResponse {
  id: string;
  message: string;
}
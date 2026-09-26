import { apiClient } from "@/lib/apiClient";
import {
  CreateStudentDto,
  DeleteStudentResponse,
  GetStudentsQueryParams,
  PaginatedStudentsResponse,
  Student,
  UpdateStudentDto,
} from "@/types/student.types";

// ── Helpers ───────────────────────────────────────────────────────────────

/** Convert a params object to a Record<string, string>, skipping undefined values. */
function toQuery(params: Record<string, string | number | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ) as Record<string, string>;
}

/** Normalise the raw response envelope into a PaginatedStudentsResponse. */
function toPaginated(raw: { data?: Student[]; meta?: PaginatedStudentsResponse["meta"] }): PaginatedStudentsResponse {
  return {
    data: raw.data ?? [],
    meta: raw.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
}

// ── Student API ─────────────────────────────────────────────────────────────

/** POST /students — create a student (User + Student profile + optional guardians). */
export async function createStudentApi(dto: CreateStudentDto): Promise<Student> {
  return apiClient.post<Student>("/students", dto);
}

/** POST /students/:id/avatar — upload a student avatar (multipart, field `image`). */
export async function uploadStudentAvatarApi(id: string, image: File): Promise<Student> {
  const formData = new FormData();
  formData.append("image", image);
  return apiClient.postForm<Student>(`/students/${id}/avatar`, formData);
}

/** GET /students — paginated students list (optional `classId` filter). */
export async function getStudentsApi(params?: GetStudentsQueryParams): Promise<PaginatedStudentsResponse> {
  const query = toQuery({
    page: params?.page,
    limit: params?.limit,
    classId: params?.classId,
  });
  const raw = await apiClient.getRaw<{ data: Student[]; meta: PaginatedStudentsResponse["meta"] }>(
    "/students",
    { params: Object.keys(query).length ? query : undefined },
  );
  return toPaginated(raw);
}

/** GET /students/:id — single student. */
export async function getStudentByIdApi(id: string): Promise<Student> {
  return apiClient.get<Student>(`/students/${id}`);
}

/**
 * PATCH /students/:id — update a student.
 * Sends JSON unless an `image` file is provided, in which case the request is
 * sent as multipart form-data (matching the backend's dual JSON/form-data support).
 */
export async function updateStudentApi(
  id: string,
  dto: UpdateStudentDto,
  image?: File,
): Promise<Student> {
  if (image) {
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, String(value));
    });
    formData.append("image", image);
    return apiClient.patchForm<Student>(`/students/${id}`, formData);
  }
  return apiClient.patch<Student>(`/students/${id}`, dto);
}

/** DELETE /students/:id — delete a student. */
export async function deleteStudentApi(id: string): Promise<DeleteStudentResponse> {
  return apiClient.delete<DeleteStudentResponse>(`/students/${id}`);
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  createStudentApi,
  deleteStudentApi,
  getStudentByIdApi,
  getStudentsApi,
  updateStudentApi,
  uploadStudentAvatarApi,
} from "@/services/student.service";
import { CreateStudentDto, GetStudentsQueryParams, UpdateStudentDto } from "@/types/student.types";

/** GET /students — paginated student list. */
export function useStudentsQuery(params?: GetStudentsQueryParams) {
  return useQuery({
    queryKey: queryKeys.students.list(params as Record<string, unknown>),
    queryFn: () => getStudentsApi(params),
  });
}

/** GET /students/:id — single student. */
export function useStudentDetailQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.students.detail(id ?? ""),
    queryFn: () => getStudentByIdApi(id!),
    enabled: Boolean(id),
  });
}

/** POST /students — create a student. */
export function useCreateStudentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateStudentDto) => createStudentApi(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.students.all }),
  });
}

/** PATCH /students/:id — update a student. */
export function useUpdateStudentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateStudentDto }) => updateStudentApi(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.students.all });
      qc.invalidateQueries({ queryKey: queryKeys.students.detail(id) });
    },
  });
}

/** POST /students/:id/avatar — upload a student avatar. */
export function useUploadStudentAvatarMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: File }) => uploadStudentAvatarApi(id, image),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.students.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

/** DELETE /students/:id — delete a student. */
export function useDeleteStudentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStudentApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.students.all }),
  });
}
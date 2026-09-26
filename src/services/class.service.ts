import { apiClient } from "@/lib/apiClient";
import { SchoolClass } from "@/types/class.types";

/** GET /classes — fetch all academic classes. */
export async function getClassesApi(): Promise<SchoolClass[]> {
  return apiClient.get<SchoolClass[]>("/classes");
}
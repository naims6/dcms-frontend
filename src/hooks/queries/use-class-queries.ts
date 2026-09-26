import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getClassesApi } from "@/services/class.service";

/** GET /classes — all academic classes. */
export function useClassesQuery() {
  return useQuery({
    queryKey: queryKeys.classes.list(),
    queryFn: () => getClassesApi(),
  });
}
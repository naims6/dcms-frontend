import { useMutation } from "@tanstack/react-query";
import { changePasswordApi } from "@/services/auth.service";
import { ChangePasswordCredentials } from "@/types/auth.types";

/**
 * Change password mutation
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (credentials: ChangePasswordCredentials) => changePasswordApi(credentials),
  });
}

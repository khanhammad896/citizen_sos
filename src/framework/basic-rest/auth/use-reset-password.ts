import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { ResetPasswordInputType } from "@utils/types";

async function resetPassword(input: ResetPasswordInputType) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, input);
  return data;
}

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

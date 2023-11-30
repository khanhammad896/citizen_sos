import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { ForgetPasswordInputType } from "@utils/types";

async function forgetPassword(input: ForgetPasswordInputType) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.FORGET_PASSWORD, input);
  return data;
}

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: forgetPassword,
  });
};

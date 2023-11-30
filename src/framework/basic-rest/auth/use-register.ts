import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { RegisterInputType } from "@utils/types";

async function register(input: RegisterInputType) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.REGISTER, input);
  return data;
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
  });
};

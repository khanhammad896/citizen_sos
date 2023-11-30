import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { RegisterVerificationInputType } from "@utils/types";

async function verify(input: RegisterVerificationInputType) {
  const { data } = await http.post(
    API_ENDPOINTS.AUTH.REGISTER_VERIFICATION,
    input,
  );
  return data;
}

export const useRegisterVerificationMutation = () => {
  return useMutation({
    mutationFn: verify,
  });
};

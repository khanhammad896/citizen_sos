import { useAuth } from "@hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import { showToast } from "@utils/helper";
import http from "@utils/http";
import { LoginInputType, User } from "@utils/types";
import { queryClient } from "App";

async function login(input: LoginInputType) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.LOGIN, input);
  return data;
}

export const useLoginMutation = () => {
  const { login: handleLogin } = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.error)
        return showToast(
          "error",
          typeof data.error_messages === "string"
            ? data.error_messages
            : data.message,
        );
      showToast("success", "Login Successful!");
      handleLogin({
        token: data.data.token,
        id: data.data.user_details.id,
        first_name: data.data.user_details.first_name,
        last_name: data.data.user_details.last_name,
        cnic: data.data.user_details.cnic,
        email: data.data.user_details.email,
        is_active: data.data.user_details.is_active,
        super_admin: data.data.user_details.super_admin,
        username: data.data.user_details.username,
        contact_number: data.data.user_details.contact_number,
      } as User);
      return queryClient.invalidateQueries();
    },
    onError: () =>
      showToast("error", "Not able to login right now. Please try again!"),
  });
};

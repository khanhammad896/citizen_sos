import { useAuth } from "@hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";

async function deleteUser() {
  const { data } = await http.post(API_ENDPOINTS.PROFILE.DELETE_USER);
  return data;
}

export const useDeleteUserMutation = () => {
  const { signOut } = useAuth();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => signOut(),
  });
};

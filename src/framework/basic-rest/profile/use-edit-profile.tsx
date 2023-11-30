import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { ProfileInputType } from "@utils/types";

async function editUser(input: ProfileInputType) {
  const { data } = await http.post(API_ENDPOINTS.PROFILE.EDIT_USER, input);
  return data;
}

export const useEditUserMutation = () => {
  return useMutation({
    mutationFn: editUser,
  });
};

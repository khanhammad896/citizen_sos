import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { CaseSchema } from "@utils/types";

type Response = {
  code: number;
  data: CaseSchema[];
  error: boolean;
  message: string;
  error_messages?: string;
};

async function fetchUserSOS(): Promise<Response> {
  const { data } = await http.post(API_ENDPOINTS.LEADS.USER_SOS);
  return data;
}

export const useUserSOSQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.LEADS.USER_SOS],
    queryFn: fetchUserSOS,
  });
};

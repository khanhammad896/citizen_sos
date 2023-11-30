import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { SaveLeadsInputType } from "@utils/types";

async function saveLeads(input: SaveLeadsInputType) {
  const { data } = await http.post(API_ENDPOINTS.LEADS.SAVE_LEADS, input);
  return data;
}

export const useSaveLeadsMutation = () => {
  return useMutation({
    mutationFn: saveLeads,
  });
};

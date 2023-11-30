import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/constants";
import http from "@utils/http";
import { ImageAssetType, VideoAssetType } from "@utils/types";

export type SaveLeadsMediaType = {
  lead_id: number;
  file_image?: ImageAssetType | null;
  file_video?: VideoAssetType | null;
  file_audio?: string | null;
};

async function saveLeadsMedia(input: FormData) {
  const { data } = await http.post(
    API_ENDPOINTS.LEADS.SAVE_LEADS_MEDIA,
    input,
    {
      timeout: 200000,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
}

export const useSaveLeadsMediaMutation = () => {
  return useMutation({
    mutationFn: saveLeadsMedia,
  });
};

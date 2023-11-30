import { Asset } from "react-native-image-picker";

export type ImageAssetType = Asset & {
  type: "image/jpeg";
};

export type VideoAssetType = Asset & {
  type: "video/mp4";
};

export type EvidenceType = {
  lead_id: number;
  file_image?: ImageAssetType | null;
  file_audio?: string | null;
  file_video?: VideoAssetType;
};

export type LoginInputType = {
  contact_number: string;
  password: string;
};

export type RegisterInputType = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact_number: string;
  cnic: string;
};

export type RegisterVerificationInputType = {
  token: string;
  user_id: number;
};

export type ForgetPasswordInputType = {
  contact_number: string;
};

export type ResetPasswordInputType = {
  token: string;
  contact_number: string;
  password: string;
  password_confirmation: string;
};

export type SaveLeadsInputType = {
  lat: string;
  lng: string;
};

export type ProfileInputType = {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  cnic: string;
};

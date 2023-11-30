import { Dimensions } from "react-native";

export const BASE_URL = "https://jsonplaceholder.typicode.com/posts";
export const AUTH_KEY = "@authdata";
export const ON_BOARDED_KEY = "@onBoarded";
export const LANGUAGE_KEY = "@language";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const REFERENCE_WIDTH = 375;
export const REFERENCE_HEIGHT = 812;

export const SCREEN_OPTIONS = {
  headerShown: false,
};

export const PX = 24;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "login",
    REGISTER: "register",
    REGISTER_VERIFICATION: "active_user",
    FORGET_PASSWORD: "forget-password",
    RESET_PASSWORD: "reset-password",
  },
  LEADS: {
    SAVE_LEADS: "save_leads",
    SAVE_LEADS_MEDIA: "save_leads_media",
    USER_SOS: "user_sos",
  },
  PROFILE: {
    EDIT_USER: "update_user",
    DELETE_USER: "delete_user",
  },
};

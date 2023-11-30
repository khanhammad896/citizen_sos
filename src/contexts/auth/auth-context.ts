import { ProfileInputType, User } from "@utils/types";
import { createContext } from "react";

export interface State {
  isAuthenticated: boolean;
  isOnBoarded: boolean;
  user: User | null;
}

export const initialState: State = {
  isAuthenticated: false,
  user: null,
  isOnBoarded: false,
};

export interface AuthContextType extends State {
  login: (user: User) => void;
  signOut: () => void;
  onBoard: () => void;
  update: (updatedUser: ProfileInputType) => void;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: () => {},
  signOut: () => {},
  onBoard: () => {},
  update: () => {},
});

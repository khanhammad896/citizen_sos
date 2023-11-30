import { useContext } from "react";

import type { AuthContextType } from "@contexts/auth";
import { AuthContext } from "@contexts/auth";

export const useAuth = <T = AuthContextType>() => useContext(AuthContext) as T;

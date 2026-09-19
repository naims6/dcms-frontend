import { createContext } from "react";
import { AuthState } from "@/types/auth.types";

export const AuthContext = createContext<AuthState | undefined>(undefined);

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "@/lib/api";

import {
  requestNotificationPermission,
} from "@/lib/firebase";

interface Auth {
  token: string;
  role: string;
}

interface AuthContextType {
  auth: Auth | null;
  setAuth: (auth: Auth | null) => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [auth, setAuth] =
    useState<Auth | null>(null);

  /*
  LOAD AUTH FROM LOCAL STORAGE
  */

  useEffect(() => {

    const initializeAuth = async () => {

      const stored =
        localStorage.getItem("auth");

      if (stored) {

        const parsed =
          JSON.parse(stored);

        console.log(
          "RESTORED AUTH:",
          parsed
        );

        setAuth(parsed);

        /*
        FIREBASE PUSH TOKEN
        */

        try {

          const fcmToken =
            await requestNotificationPermission();

          if (fcmToken) {

            await api.put(
              "/users/me/fcm-token",
              {
                fcmToken,
              }
            );

            console.log(
              "FCM token saved"
            );
          }

        } catch (error) {

          console.log(
            "FCM ERROR:",
            error
          );
        }
      }
    };

    initializeAuth();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,setAuth

      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
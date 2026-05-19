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

/*
=========================================
AUTH TYPE
=========================================
*/

interface Auth {
  token?: string;
  role?: string;
  userId?: string;
  cafeteriaId?: string;
  collegeId?: string;
}

/*
=========================================
CONTEXT TYPE
=========================================
*/

interface AuthContextType {
  auth: Auth | null;
  setAuth: (
    auth: Auth | null
  ) => void;
}

/*
=========================================
CREATE CONTEXT
=========================================
*/

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

/*
=========================================
AUTH PROVIDER
=========================================
*/

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [auth, setAuth] =
    useState<Auth | null>(null);

  /*
  =========================================
  LOAD AUTH FROM STORAGE
  =========================================
  */

  useEffect(() => {

    const initializeAuth =
      async () => {

        try {

          const stored =
            localStorage.getItem(
              "auth"
            );

          if (!stored) {

            return;
          }

          const parsed =
            JSON.parse(stored);

          console.log(
            "RESTORED AUTH:",
            parsed
          );

          /*
          =========================================
          SET AUTH STATE
          =========================================
          */

          setAuth(parsed);

          /*
          =========================================
          FIREBASE PUSH TOKEN
          =========================================
          */

          try {

            const fcmToken =
              await requestNotificationPermission();

            if (
              fcmToken &&
              parsed.token
            ) {

await api.put(
  "/users/me/fcm-token",
  {
    fcmToken,
  },
  {
    headers: {
      Authorization:
        `Bearer ${parsed.token}`,
    },
  }
);

              console.log(
                "FCM TOKEN SAVED"
              );
            }

          } catch (error) {

            console.log(
              "FCM ERROR:",
              error
            );
          }

        } catch (error) {

          console.log(
            "AUTH INIT ERROR:",
            error
          );
        }
      };

    initializeAuth();

  }, []);

  /*
  =========================================
  PROVIDER
  =========================================
  */

  return (

    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

/*
=========================================
USE AUTH
=========================================
*/

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
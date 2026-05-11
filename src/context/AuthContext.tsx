import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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

    const stored =
      localStorage.getItem("auth");

    if (stored) {

      const parsed = JSON.parse(stored);

      console.log(
        "RESTORED AUTH:",
        parsed
      );

      setAuth(parsed);
    }

  }, []);

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
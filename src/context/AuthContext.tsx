import { createContext, useContext, useEffect, useState } from "react";

interface Auth {
  token: string;
  role: string;
}

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) setAuth(JSON.parse(stored));
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {

  const { auth } = useAuth();

  console.log("AUTH:", auth);

  /*
  =========================================
  NOT LOGGED IN
  =========================================
  */

  if (!auth) {

    console.log("NO AUTH");

    return <Navigate to="/" replace />;
  }

  /*
  =========================================
  ROLE
  =========================================
  */

  const role =
    auth.role || "";

  console.log("ROLE:", role);

  console.log(
    "ALLOWED:",
    allowedRoles
  );

  /*
  =========================================
  ACCESS CHECK
  =========================================
  */

  const hasAccess =
    allowedRoles.includes(role);

  console.log(
    "HAS ACCESS:",
    hasAccess
  );

  /*
  =========================================
  BLOCK ACCESS
  =========================================
  */

  if (!hasAccess) {

    return <Navigate to="/" replace />;
  }

  /*
  =========================================
  ALLOW ROUTE
  =========================================
  */

  return children;
}
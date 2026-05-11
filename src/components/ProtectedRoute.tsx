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

  const authContext = useAuth();

  const auth = authContext.auth;

  console.log("AUTH:", auth);

  /*
  NO LOGIN
  */

  if (!auth) {

    console.log("NO USER");

    return <Navigate to="/" replace />;
  }

  /*
  CLEAN ROLE
  */

  const cleanRole =
    auth.role.replace("ROLE_", "");

  console.log("ROLE:", cleanRole);

  console.log(
    "ALLOWED:",
    allowedRoles
  );

  /*
  CHECK ACCESS
  */

  const hasAccess =
    allowedRoles.includes(cleanRole);

  console.log(
    "ACCESS:",
    hasAccess
  );

  if (!hasAccess) {

    return <Navigate to="/" replace />;
  }

  return children;
}
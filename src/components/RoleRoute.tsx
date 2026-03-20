import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RoleRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { auth } = useAuth();

  if (!auth || !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" />;
  }

  return children;
};
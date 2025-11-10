import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;

  if (!roles.includes(user.rol)) {
    return <Navigate to="/pacientes" replace />;
  }

  return children;
}

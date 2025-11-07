import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !roles.includes(user.rol)) {
    return <div className="p-8 text-red-600 text-center">No autorizado</div>;
  }

  return children;
}

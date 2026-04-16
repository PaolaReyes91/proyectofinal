import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading/Loading";
import { useAuth } from "../context/AuthContext";
import "./ProtectedRoute.css";

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
}) {
  const location = useLocation();
  const { user, isAuth, loading } = useAuth();

  if (loading) return <Loading />;

  if (!isAuth)
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  if (allowedRoles && user) {
    const userRole = user.role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return (
        <div className="access-denied">
          <h2>Acceso denegado</h2>
          <p>Tu rol actual ({user.role}) no tiene permisos para esta sección.</p>
        </div>
      );
    }
  }
  return children;
}

import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button/Button";
import "./ProfileCard.css";

const ROLE_COLORS = {
  admin: "var(--color-blue)",
  customer: "#A08CDA",
  guest: "#6b7280",
};

export default function ProfileCard() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Hook necesario para que las acciones funcionen
  
  const currentUser = user;
  
  if (!currentUser) return null;

  const role = currentUser.role || "guest";

  // Mantenemos exactamente el orden y etiquetas que compartiste anteriormente
  const ROLE_ACTIONS = {
    admin: [
      { label: "Editar Perfil", action: () => navigate("/settings") },
      { label: "Cambiar contraseña", action: () => navigate("/settings") },
      { label: "Ver todos los pedidos", action: () => navigate("/orders") },
      { label: "Panel de administración", action: () => navigate("/admin/dashboard") },
    ],
    customer: [
      { label: "Editar Perfil", action: () => navigate("/settings") },
      { label: "Cambiar contraseña", action: () => navigate("/settings") },
      { label: "Ver mis pedidos", action: () => navigate("/orders") },
    ],
  };

  const actions = ROLE_ACTIONS[role] || [];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={currentUser.avatar || "/img/user-placeholder.png"}
            alt={currentUser.name || currentUser.email}
            className="profile-avatar"
          />
          <div className="profile-names">
            <h2>{currentUser.displayName || currentUser.name || currentUser.email}</h2>
            <span
              className="profile-role-badge"
              style={{ background: ROLE_COLORS[role] || ROLE_COLORS.guest }}
            >
              {role}
            </span>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Email:</label>
            <span>{currentUser.email || "No disponible"}</span>
          </div>
          <div className="info-item">
            <label>Nombre:</label>
            <span>{currentUser.name || currentUser.displayName || "No disponible"}</span>
          </div>
          <div className="info-item">
            <label>Estado:</label>
            <span>{currentUser.isActive ? "Activo" : "Inactivo"}</span>
          </div>
          <div className="info-item">
            <label>Última conexión:</label>
            <span>
              {currentUser.loginDate
                ? new Date(currentUser.loginDate).toLocaleString()
                : "No disponible"}
            </span>
          </div>
        </div>

        <div className="profile-actions">
          <h3>Acciones de la cuenta</h3>
          {/* Mapeo respetando el orden de tu lista original */}
          {actions.map((action, idx) => (
            <Button key={idx} type="button" onClick={action.action}>
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
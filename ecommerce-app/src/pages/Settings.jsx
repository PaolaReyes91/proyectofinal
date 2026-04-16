import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button/Button";
import "./Settings.css";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  
  // Estado para controlar la vista del formulario de contraseña
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Aquí iría tu llamada al backend de Node.js
    console.log("Enviando cambio de contraseña:", passwordData);
    alert("Solicitud de cambio enviada (Simulación)");
    setIsChangingPassword(false);
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Configuración</h2>
      
      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("account");
            setIsChangingPassword(false);
          }}
        >
          Cuenta
        </button>
        <button
          className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          Notificaciones
        </button>
        <button
          className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
          onClick={() => setActiveTab("privacy")}
        >
          Privacidad
        </button>
      </div>

      <div className="settings-content">
        {/* SECCIÓN DE CUENTA */}
        {activeTab === "account" && (
          <div className="settings-section animate-fade-in">
            {!isChangingPassword ? (
              <div className="account-info">
                <h3>Información de Cuenta</h3>
                <div className="info-group">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Nombre:</strong> {user?.displayName || user?.name || "Paola"}</p>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsChangingPassword(true)}
                >
                  Cambiar Contraseña
                </Button>
              </div>
            ) : (
              <div className="password-form-container">
                <h3>Actualizar Contraseña</h3>
                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  <div className="form-group">
                    <label>Contraseña Actual</label>
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handleInputChange}
                      className="settings-input"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handleInputChange}
                      className="settings-input"
                      required 
                    />
                  </div>
                  <div className="form-actions">
                    <Button type="submit" variant="primary">Guardar Nueva Contraseña</Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN DE NOTIFICACIONES */}
        {activeTab === "notifications" && (
          <div className="settings-section animate-fade-in">
            <h3>Preferencias de Comunicación</h3>
            <div className="checkbox-group">
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Recibir correos promocionales
              </label>
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Recibir ofertas de nuevos cursos
              </label>
            </div>
          </div>
        )}

        {/* SECCIÓN DE PRIVACIDAD */}
        {activeTab === "privacy" && (
          <div className="settings-section animate-fade-in">
            <h3>Privacidad y Seguridad</h3>
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Perfil público (otros estudiantes pueden verte)
            </label>
            <div className="danger-zone">
              <h4>Zona de Peligro</h4>
              <p>Una vez eliminada la cuenta, no hay marcha atrás.</p>
              <Button variant="danger" className="button-danger">
                Eliminar Cuenta Permanentemente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
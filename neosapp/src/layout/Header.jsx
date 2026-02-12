import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

export default function Header() {
  const navigate = useNavigate();
  const { obtenerUsuario, esAdmin, logout } = useAuth();
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const usuario = obtenerUsuario();
  const esAdministrador = esAdmin();
  const iniciales = usuario?.substring(0, 2).toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header header-dark">
      <h1>Distribución de Belleza</h1>

      <div className="header-right">
        <div className="usuario-info">
          <span className={`badge-tipo ${esAdministrador ? "admin" : "cliente"}`}>
            {esAdministrador ? "👨‍💼 Administrador" : "👤 Cliente"}
          </span>
          <span className="usuario-nombre">{usuario}</span>
        </div>

        <div className="avatar-menu">
          <button
            className="avatar"
            onClick={() => setMostrarMenu(!mostrarMenu)}
            title={usuario}
          >
            {iniciales}
          </button>

          {mostrarMenu && (
            <div className="menu-desplegable">
              <div className="menu-item disabled">
                <span className="menu-label">Usuario:</span>
                <strong>{usuario}</strong>
              </div>
              <div className="menu-item disabled">
                <span className="menu-label">Tipo:</span>
                <strong>{esAdministrador ? "Administrador" : "Cliente"}</strong>
              </div>
              <hr className="menu-divider" />
              <button
                className="menu-item logout"
                onClick={handleLogout}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

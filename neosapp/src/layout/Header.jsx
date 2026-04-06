import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

export default function Header() {
  const navigate = useNavigate();
  const { usuarioAutenticado, obtenerDatosUsuario, esAdmin, esVendedor, esRepartidor, logout } = useAuth();
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const datosUsuario = obtenerDatosUsuario();
  const usuario = datosUsuario?.nombre || datosUsuario?.usuario;
  const esAdministrador = esAdmin();
  const esVend = esVendedor();
  const esRepar = esRepartidor();

  let tipoUsuario = "Cliente";
  if (esAdministrador) tipoUsuario = "Administrador";
  else if (esVend) tipoUsuario = "Vendedor";
  else if (esRepar) tipoUsuario = "Repartidor";

  const iniciales = usuario?.substring(0, 2).toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const tipoClase = esAdministrador ? "admin" : esVend ? "vendedor" : esRepar ? "repartidor" : "cliente";

  return (
    <header className="header header-dark">
      <h1>Distribución de Belleza</h1>

      <div className="header-right">
        <div className="usuario-info">
          <span className={`badge-tipo ${tipoClase}`}>
            {tipoUsuario}
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
              {usuarioAutenticado ? (
                <>
                  <div className="menu-item disabled">
                    <span className="menu-label">Usuario:</span>
                    <strong>{usuario}</strong>
                  </div>
                  <div className="menu-item disabled">
                    <span className="menu-label">Tipo:</span>
                    <strong>{tipoUsuario}</strong>
                  </div>
                  <hr className="menu-divider" />
                  <button
                    className="menu-item logout"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  className="menu-item login"
                  onClick={handleLogin}
                >
                  Inicio de sesión
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

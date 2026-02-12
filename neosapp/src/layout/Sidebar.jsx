import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { esAdmin } = useAuth();
  const esAdministrador = esAdmin();

  return (
    <aside className="sidebar">
      <h2 className="logo">NEOSAPP</h2>

      <nav>
        {/* Menú principal */}
        <NavLink to="/" end>
          {esAdministrador ? "📊 Dashboard" : "💳 Cartera"}
        </NavLink>

        <NavLink to="/productos">
          🛍️ Productos
        </NavLink>

        {/* Clientes - solo para admin */}
        {esAdministrador && (
          <NavLink to="/clientes">
            👥 Clientes
          </NavLink>
        )}

        {/* Menú administrativo - solo para admin */}
        {esAdministrador && (
          <>
            <hr className="nav-divider" />
            <div className="nav-section-title">Administración</div>

            <NavLink to="/pedidos">
              📋 Pedidos
            </NavLink>

            <NavLink to="/repartidores">
              🚗 Repartidores
            </NavLink>

            <NavLink to="/vendedores">
              👨‍💼 Vendedores
            </NavLink>

            <NavLink to="/mapa">
              🗺️ Mapa
            </NavLink>

            <NavLink to="/admin-clientes">
              ⚙️ Configuración
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

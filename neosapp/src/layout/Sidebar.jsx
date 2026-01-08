import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">NEOSAPP</h2>

      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/pedidos">
          Pedidos
        </NavLink>

        <NavLink to="/repartidores">
          Repartidores
        </NavLink>

        <NavLink to="/mapa">
          Mapa
        </NavLink>
      </nav>
    </aside>
  );
}

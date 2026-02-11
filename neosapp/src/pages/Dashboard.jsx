import "./dashboard.css";
import { useStore } from "../context/StoreContext";

export default function Dashboard() {
  const { pedidos, repartidores } = useStore();

  const pedidosHoy = pedidos.length;

  const entregasEnCurso = pedidos.filter(
    (p) => p.estado === "En camino"
  ).length;

  const incidencias = pedidos.filter(
    (p) => p.estado === "Retraso" || p.estado === "Cancelado"
  ).length;

  const pedidosRecientes = pedidos.slice(-3).reverse();

  const repartidoresActivos = repartidores?.filter(
    (r) => r.estado === "activo"
  ).length || 0;

  return (
    <div className="dashboard">

      {/* KPIs */}
      <div className="kpi-grid">
        <Kpi title="Pedidos Hoy" value={pedidosHoy} />
        <Kpi title="Repartidores Activos" value={repartidoresActivos} />
        <Kpi title="Entregas en Curso" value={entregasEnCurso} />
        <Kpi title="Incidencias" value={incidencias} alert />
      </div>

      {/* Mapa + Pedidos */}
      <div className="dashboard-row">

        <div className="card map-card">
          <h3>Mapa en tiempo real</h3>
          <div className="map-placeholder">
            Mapa aquí
          </div>
          <button className="btn-link">
            Ver mapa completo
          </button>
        </div>

        <div className="card">
          <h3>Pedidos recientes</h3>

          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Repartidor</th>
              </tr>
            </thead>

            <tbody>
              {pedidosRecientes.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.cliente}</td>
                  <td>
                    <span className={`badge ${getBadge(p.estado)}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>{p.repartidor || "—"}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      {/* Repartidores */}
      <div className="card">
        <h3>Repartidores</h3>

        <div className="drivers">
          {repartidores?.map((r) => (
            <Driver
              key={r.id}
              name={r.nombre}
              status={r.estado}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

/* Helpers */

function getBadge(estado) {
  switch (estado) {
    case "En camino":
      return "success";
    case "Pendiente":
      return "warning";
    case "Cancelado":
      return "danger";
    default:
      return "warning";
  }
}

/* Componentes visuales */

function Kpi({ title, value, alert }) {
  return (
    <div className={`card kpi ${alert ? "alert" : ""}`}>
      <span className="kpi-title">{title}</span>
      <span className="kpi-value">{value}</span>
    </div>
  );
}

function Driver({ name, status }) {
  return (
    <div className="driver">
      <span>{name}</span>
      <span className={`status ${status}`}>
        {status}
      </span>
    </div>
  );
}

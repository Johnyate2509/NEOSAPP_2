import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      {/* KPIs */}
      <div className="kpi-grid">
        <Kpi title="Pedidos Hoy" value="128" />
        <Kpi title="Repartidores Activos" value="6" />
        <Kpi title="Entregas en Curso" value="14" />
        <Kpi title="Incidencias" value="2" alert />
      </div>

      {/* Mapa + Pedidos */}
      <div className="dashboard-row">
        <div className="card map-card">
          <h3>Mapa en tiempo real</h3>
          <div className="map-placeholder">
            Mapa aquí
          </div>
          <button className="btn-link">Ver mapa completo</button>
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
              <tr>
                <td>#1023</td>
                <td>Ana Pérez</td>
                <td><span className="badge success">En ruta</span></td>
                <td>Carlos</td>
              </tr>
              <tr>
                <td>#1024</td>
                <td>Laura Gómez</td>
                <td><span className="badge warning">Pendiente</span></td>
                <td>—</td>
              </tr>
              <tr>
                <td>#1025</td>
                <td>Sofía Ruiz</td>
                <td><span className="badge danger">Retraso</span></td>
                <td>Mario</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Repartidores */}
      <div className="card">
        <h3>Repartidores</h3>

        <div className="drivers">
          <Driver name="Carlos" status="activo" />
          <Driver name="Mario" status="activo" />
          <Driver name="Luis" status="inactivo" />
        </div>
      </div>

    </div>
  );
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

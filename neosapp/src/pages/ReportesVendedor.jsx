import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import "../styles/vendedor-reportes.css";

export default function ReportesVendedor() {
  const { obtenerDatosUsuario } = useAuth();
  const { clientes, pedidos } = useStore();
  const vendedorData = obtenerDatosUsuario();

  // Obtener clientes del vendedor
  const clientesVendedor = clientes.filter(
    c => c.vendedor_id === vendedorData?.id
  );

  // Obtener pedidos del vendedor
  const pedidosVendedor = pedidos.filter(p =>
    clientesVendedor.some(c => c.cedula === p.clienteCedula)
  );

  // Cálculos
  const totalVentas = pedidosVendedor.reduce((sum, p) => sum + p.total, 0);
  const totalPedidos = pedidosVendedor.length;
  const carteraTotal = clientesVendedor.reduce((sum, c) => sum + c.saldo, 0);
  const clientesAsignados = clientesVendedor.length;

  // Detallar por estado
  const pedidosPendientes = pedidosVendedor.filter(p => p.estado === "Pendiente").length;
  const pedidosEnCamino = pedidosVendedor.filter(p => p.estado === "En camino").length;
  const pedidosEntregados = pedidosVendedor.filter(p => p.estado === "Entregado").length;

  return (
    <div className="reportes-vendedor">
      <div className="reportes-header">
        <h2>Reportes de Ventas</h2>
        <p>Análisis de desempeño - {vendedorData?.nombre}</p>
      </div>

      {/* Tarjetas resumen */}
      <div className="tarjetas-resumen">
        <div className="tarjeta-resumen">
          <div className="icono">💰</div>
          <div className="contenido">
            <span className="label">Total Ventas</span>
            <span className="valor">${totalVentas.toLocaleString()}</span>
          </div>
        </div>

        <div className="tarjeta-resumen">
          <div className="icono">📦</div>
          <div className="contenido">
            <span className="label">Total Pedidos</span>
            <span className="valor">{totalPedidos}</span>
          </div>
        </div>

        <div className="tarjeta-resumen">
          <div className="icono">👥</div>
          <div className="contenido">
            <span className="label">Clientes</span>
            <span className="valor">{clientesAsignados}</span>
          </div>
        </div>

        <div className="tarjeta-resumen">
          <div className="icono">📊</div>
          <div className="contenido">
            <span className="label">Cartera Total</span>
            <span className="valor">${carteraTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Estado de pedidos */}
      <div className="estado-pedidos">
        <h3>Estado de Pedidos</h3>
        <div className="estado-grid">
          <div className="estado-card pendiente">
            <span className="estado-icono">⏳</span>
            <span className="estado-numero">{pedidosPendientes}</span>
            <span className="estado-label">Pendientes</span>
          </div>

          <div className="estado-card en-camino">
            <span className="estado-icono">🚚</span>
            <span className="estado-numero">{pedidosEnCamino}</span>
            <span className="estado-label">En Camino</span>
          </div>

          <div className="estado-card entregado">
            <span className="estado-icono">✅</span>
            <span className="estado-numero">{pedidosEntregados}</span>
            <span className="estado-label">Entregados</span>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="tabla-clientes">
        <h3>Mis Clientes ({clientesVendedor.length})</h3>
        {clientesVendedor.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Cédula</th>
                <th>Pedidos</th>
                <th>Saldo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientesVendedor.map((cliente) => {
                const pedidosCliente = pedidos.filter(p => p.clienteCedula === cliente.cedula);
                const estado = cliente.saldo > 0 ? "Debe" : cliente.saldo < 0 ? "Favor" : "Al día";
                const estadoColor = cliente.saldo > 0 ? "rojo" : cliente.saldo < 0 ? "verde" : "azul";
                
                return (
                  <tr key={cliente.id}>
                    <td className="nombre">{cliente.nombre}</td>
                    <td>{cliente.cedula}</td>
                    <td className="pedidos">{pedidosCliente.length}</td>
                    <td className="saldo">
                      <span className={`saldo-${estadoColor}`}>
                        ${Math.abs(cliente.saldo).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-estado estado-${estadoColor}`}>
                        {estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="sin-clientes">No tienes clientes asignados</p>
        )}
      </div>

      {/* Últimos pedidos */}
      {pedidosVendedor.length > 0 && (
        <div className="ultimos-pedidos">
          <h3>Últimos Pedidos</h3>
          <div className="pedidos-lista">
            {pedidosVendedor.slice(-5).reverse().map((pedido) => (
              <div key={pedido.id} className="pedido-item">
                <div className="pedido-header">
                  <span className="pedido-numero">Pedido #{pedido.id}</span>
                  <span className={`estado-badge estado-${pedido.estado.toLowerCase().replace(" ", "-")}`}>
                    {pedido.estado}
                  </span>
                </div>
                <div className="pedido-body">
                  <p><strong>{pedido.cliente}</strong></p>
                  <p className="fecha">{pedido.fecha}</p>
                  <p className="total">Total: ${pedido.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

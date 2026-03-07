import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import "../styles/repartidor-perfil.css";

export default function RepartidorPerfil() {
  const { pedidos, cambiarEstadoPedido } = useStore();
  const { obtenerDatosUsuario } = useAuth();
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const datosRepartidor = obtenerDatosUsuario();

  // Filtrar pedidos asignados a este repartidor
  const pedidosDelRepartidor = pedidos.filter(
    (p) => p.repartidor === datosRepartidor.nombre
  );

  // Aplicar filtro de estado
  const pedidosFiltrados =
    filtroEstado === "Todos"
      ? pedidosDelRepartidor
      : pedidosDelRepartidor.filter((p) => p.estado === filtroEstado);

  const estadisticas = {
    pendientes: pedidosDelRepartidor.filter((p) => p.estado === "Pendiente").length,
    enCamino: pedidosDelRepartidor.filter((p) => p.estado === "En camino").length,
    entregados: pedidosDelRepartidor.filter((p) => p.estado === "Entregado").length,
    total: pedidosDelRepartidor.length,
  };

  return (
    <div className="repartidor-perfil">
      {/* Encabezado del Perfil */}
      <div className="perfil-header">
        <div className="perfil-info">
          <div className="avatar">
            <span>{datosRepartidor.nombre.charAt(0)}</span>
          </div>
          <div className="info-texto">
            <h2>{datosRepartidor.nombre}</h2>
            <p className="zona">📍 Zona: {datosRepartidor.zona}</p>
            <p className="usuario">Usuario: {datosRepartidor.usuario}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-container">
        <div className="estadistica pendiente">
          <h4>Pendientes</h4>
          <p className="numero">{estadisticas.pendientes}</p>
        </div>
        <div className="estadistica en-camino">
          <h4>En Camino</h4>
          <p className="numero">{estadisticas.enCamino}</p>
        </div>
        <div className="estadistica entregado">
          <h4>Entregados</h4>
          <p className="numero">{estadisticas.entregados}</p>
        </div>
        <div className="estadistica total">
          <h4>Total Asignados</h4>
          <p className="numero">{estadisticas.total}</p>
        </div>
      </div>

      {/* Filtro de Estado */}
      <div className="pedidos-header">
        <h3>Mis Pedidos</h3>
        <div className="filtro-container">
          <label>Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-select"
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En camino">En camino</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="pedidos-lista">
        {pedidosFiltrados.length === 0 ? (
          <div className="sin-pedidos">
            <p>
              {pedidosDelRepartidor.length === 0
                ? "No tienes pedidos asignados aún"
                : `No hay pedidos con estado "${filtroEstado}"`}
            </p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className={`pedido-card ${pedido.estado.toLowerCase().replace(" ", "-")}`}>
              {/* Encabezado de la tarjeta */}
              <div className="pedido-card-header">
                <div className="pedido-numero-estado">
                  <h4>Pedido #{pedido.id}</h4>
                  <span className={`estado-badge ${pedido.estado.toLowerCase().replace(" ", "-")}`}>
                    {pedido.estado}
                  </span>
                </div>
                <div className="pedido-fecha">
                  📅 {pedido.fecha}
                </div>
              </div>

              {/* Información del Cliente y Dirección */}
              <div className="pedido-cliente-info">
                <div className="cliente-detalle">
                  <div className="detalle-item">
                    <label>👤 Cliente:</label>
                    <p>{pedido.cliente}</p>
                  </div>
                  <div className="detalle-item">
                    <label>📌 Dirección:</label>
                    <p className="direccion">{pedido.direccion}</p>
                  </div>
                  <div className="detalle-item">
                    <label>💳 Forma de Pago:</label>
                    <p>
                      <span className={`pago-badge ${pedido.formaPago.toLowerCase()}`}>
                        {pedido.formaPago}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items del Pedido */}
              <div className="pedido-items">
                <h5>📦 Productos:</h5>
                <div className="items-lista">
                  {pedido.items.map((item, index) => (
                    <div key={index} className="item-fila">
                      <div className="item-info">
                        <span className="item-nombre">{item.nombre}</span>
                        <span className="item-cantidad">x{item.cantidad}</span>
                      </div>
                      <span className="item-precio">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pedido-total">
                <span className="label">Total:</span>
                <span className="monto">${pedido.total.toLocaleString()}</span>
              </div>

              {/* Control de Estado */}
              <div className="pedido-control">
                <label>Actualizar Estado:</label>
                <select
                  value={pedido.estado}
                  onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                  className="estado-select"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En camino">En camino</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

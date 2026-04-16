import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import "../styles/repartidor-perfil.css";
import { SupabaseClient } from "@supabase/supabase-js";

export default function RepartidorPerfil() {
  const { obtenerDatosUsuario } = useAuth();
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [pedidos, setPedidos] = useState([]);

  const datosRepartidor = obtenerDatosUsuario();

  // Cargar pedidos desde Supabase
  const cargarPedidos = async () => {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .eq("repartidor", datosRepartidor.nombre);

    if (!error) {
      setPedidos(data);
    }
  };

  useEffect(() => {
    if (datosRepartidor?.nombre) {
      cargarPedidos();
    }
  }, [datosRepartidor]);

  // Cambiar estado del pedido
  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    await supabase
      .from("pedidos")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    cargarPedidos();
  };

  // Aplicar filtro
  const pedidosFiltrados =
    filtroEstado === "Todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  const estadisticas = {
    pendientes: pedidos.filter((p) => p.estado === "Pendiente").length,
    enCamino: pedidos.filter((p) => p.estado === "En camino").length,
    entregados: pedidos.filter((p) => p.estado === "Entregado").length,
    total: pedidos.length,
  };

  return (
    <div className="repartidor-perfil">
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

      <div className="pedidos-lista">
        {pedidosFiltrados.length === 0 ? (
          <div className="sin-pedidos">
            <p>No tienes pedidos asignados aún</p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-card-header">
                <h4>Pedido #{pedido.id}</h4>
                <span>{pedido.estado}</span>
              </div>

              <div className="pedido-cliente-info">
                <p>👤 {pedido.cliente}</p>
                <p>📌 {pedido.direccion}</p>
              </div>

              <div className="pedido-total">
                <span>Total:</span>
                <span>${pedido.total}</span>
              </div>

              <div className="pedido-control">
                <select
                  value={pedido.estado}
                  onChange={(e) =>
                    cambiarEstadoPedido(pedido.id, e.target.value)
                  }
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
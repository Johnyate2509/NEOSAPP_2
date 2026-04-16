import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../context/supabaseClient";
import "../styles/repartidor-perfil.css";

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
      setPedidos(data || []);
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
        <h2>{datosRepartidor.nombre}</h2>
        <p>Zona: {datosRepartidor.zona}</p>
      </div>

      <div className="estadisticas-container">
        <div>Pendientes: {estadisticas.pendientes}</div>
        <div>En camino: {estadisticas.enCamino}</div>
        <div>Entregados: {estadisticas.entregados}</div>
        <div>Total: {estadisticas.total}</div>
      </div>

      <select
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
      >
        <option value="Todos">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En camino">En camino</option>
        <option value="Entregado">Entregado</option>
        <option value="Cancelado">Cancelado</option>
      </select>

      {pedidosFiltrados.map((pedido) => (
        <div key={pedido.id}>
          <h4>Pedido #{pedido.id}</h4>
          <p>{pedido.cliente}</p>
          <p>{pedido.direccion}</p>
          <p>${pedido.total}</p>

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
      ))}
    </div>
  );
}
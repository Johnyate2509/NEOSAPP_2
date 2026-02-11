import { useState } from "react";
import { useStore } from "../context/StoreContext";
import "../styles/pedidos.css";

export default function Pedidos() {
  const { productos, pedidos, crearPedido, eliminarPedido, asignarRepartidor } = useStore();

  const [cliente, setCliente] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  

  const handleCrear = () => {
  if (!cliente || !productoSeleccionado) return;

  const producto = productos.find(
    (p) => p.id === Number(productoSeleccionado)
  );

  if (!producto) return;

  if (cantidad > producto.stock) {
    alert("No hay suficiente stock disponible");
    return;
  }

  crearPedido(cliente, [
    { ...producto, cantidad: Number(cantidad) },
  ]);

  setCliente("");
  setProductoSeleccionado("");
  setCantidad(1);
};


  return (
    <div className="pedidos-page">
      <h2>Pedidos</h2>

      {/* Crear pedido */}
      <div className="crear-pedido">
        <input
          placeholder="Nombre del cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />

        <select
          value={productoSeleccionado}
          onChange={(e) =>
            setProductoSeleccionado(e.target.value)
          }
        >
          <option value="">Seleccionar producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} (Stock: {p.stock})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button onClick={handleCrear}>
          Crear Pedido
        </button>
      </div>

      {/* Lista pedidos */}
     <div className="lista-pedidos">
  {pedidos.map((p) => (
    <div key={p.id} className="pedido-card">

      <div className="pedido-header">
        <strong>Pedido #{p.id}</strong>
        <button
          className="btn-delete"
          onClick={() => eliminarPedido(p.id)}
        >
          ✕
        </button>
      </div>

      <div className="pedido-body">
        <p><strong>Cliente:</strong> {p.cliente}</p>
        <p><strong>Fecha:</strong> {p.fecha}</p>

        <div className="pedido-items">
          {p.items.map((item, index) => (
            <div key={index} className="pedido-item">
              {item.nombre} x {item.cantidad} — $
              {(item.precio * item.cantidad).toLocaleString()}
            </div>
          ))}
        </div>

        <p><strong>Total:</strong> ${p.total.toLocaleString()}</p>

        <div className="pedido-acciones">
          <select
            value={p.estado}
            onChange={(e) =>
              cambiarEstadoPedido(p.id, e.target.value)
            }
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En camino">En camino</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          <select
            value={p.repartidor || ""}
            onChange={(e) =>
              asignarRepartidor(p.id, e.target.value)
            }
          >
            <option value="">Asignar repartidor</option>
            <option value="Carlos">Carlos</option>
            <option value="Luis">Luis</option>
            <option value="María">María</option>
          </select>
        </div>
      </div>
    </div>
  ))}
</div>


    </div>
  );
}

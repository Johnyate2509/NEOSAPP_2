import { useStore } from "../context/StoreContext";
import "../styles/pedidos.css";

export default function Pedidos() {
  const { pedidos, repartidores, cambiarEstadoPedido, eliminarPedido, asignarRepartidor } = useStore();

  return (
    <div className="pedidos-page">
      <h2>Pedidos</h2>
      <p>Gestión de pedidos creados desde la tienda</p>

      {/* Lista pedidos */}
      <div className="lista-pedidos">
        {pedidos.length === 0 ? (
          <p className="sin-pedidos">No hay pedidos aún. Crea uno desde la tienda de productos.</p>
        ) : (
          pedidos.map((p) => (
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
                <div className="pedido-info-cliente">
                  <p><strong>Cliente:</strong> {p.cliente}</p>
                  <p><strong>Dirección:</strong> {p.direccion}</p>
                  <p><strong>Fecha:</strong> {p.fecha}</p>
                  <p><strong>Forma de pago:</strong> <span className={`forma-pago ${p.formaPago.toLowerCase()}`}>{p.formaPago}</span></p>
                </div>

                <div className="pedido-items">
                  <h5>Productos:</h5>
                  {p.items.map((item, index) => (
                    <div key={index} className="pedido-item">
                      <span>{item.nombre}</span>
                      <span>x{item.cantidad}</span>
                      <span className="price">${(item.precio * item.cantidad).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <p className="pedido-total"><strong>Total:</strong> ${p.total.toLocaleString()}</p>

                <div className="pedido-acciones">
                  <div className="control">
                    <label>Estado:</label>
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
                  </div>

                  <div className="control">
                    <label>Repartidor:</label>
                    <select
                      value={p.repartidor || ""}
                      onChange={(e) =>
                        asignarRepartidor(p.id, e.target.value || null)
                      }
                    >
                      <option value="">Asignar repartidor</option>
                      {repartidores.map((r) => (
                        <option key={r.id} value={r.nombre}>
                          {r.nombre} - {r.zona}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

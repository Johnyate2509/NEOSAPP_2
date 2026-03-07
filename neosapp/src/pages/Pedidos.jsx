import { useState } from "react";
import { useStore } from "../context/StoreContext";
import "../styles/pedidos.css";

export default function Pedidos() {
  const { 
    pedidos, 
    repartidores, 
    productos,
    cambiarEstadoPedido, 
    eliminarPedido, 
    asignarRepartidor,
    agregarItemPedido,
    eliminarItemPedido,
    actualizarCantidadItemPedido
  } = useStore();

  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [pedidoTemp, setPedidoTemp] = useState({});

  const abrirEdicion = (pedido) => {
    setPedidoExpandido(pedido.id);
    setPedidoTemp({ ...pedido });
  };

  const cerrarEdicion = () => {
    setPedidoExpandido(null);
    setPedidoTemp({});
  };

  const handleAgregarItem = (pedidoId, productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    if (producto) {
      agregarItemPedido(pedidoId, productoId, producto.nombre, producto.precio, 1);
    }
  };

  const handleEliminarItem = (pedidoId, productoId) => {
    eliminarItemPedido(pedidoId, productoId);
  };

  const handleActualizarCantidad = (pedidoId, productoId, nuevaCantidad) => {
    if (nuevaCantidad > 0) {
      actualizarCantidadItemPedido(pedidoId, productoId, nuevaCantidad);
    }
  };

  const productosDisponibles = productos.filter(
    (p) => !pedidoTemp.items?.some((item) => item.id === p.id)
  );

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
                <div className="pedido-header-acciones">
                  <button
                    className="btn-editar"
                    onClick={() => abrirEdicion(p)}
                    title="Editar items"
                  >
                    ✎ Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => eliminarPedido(p.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="pedido-body">
                <div className="pedido-info-cliente">
                  <p><strong>Cliente:</strong> {p.cliente}</p>
                  <p><strong>Dirección:</strong> {p.direccion}</p>
                  <p><strong>Fecha:</strong> {p.fecha}</p>
                  <p><strong>Forma de pago:</strong> <span className={`forma-pago ${p.formaPago.toLowerCase()}`}>{p.formaPago}</span></p>
                </div>

                {/* Items con controles de edición si está expandido */}
                {pedidoExpandido === p.id ? (
                  <div className="pedido-items-editable">
                    <h5>Productos:</h5>
                    <div className="items-container">
                      {p.items.map((item, index) => (
                        <div key={index} className="pedido-item-editable">
                          <div className="item-info">
                            <span className="item-nombre">{item.nombre}</span>
                            <span className="item-precio-unitario">${item.precio.toLocaleString()}</span>
                          </div>
                          <div className="item-controls">
                            <button
                              className="btn-cantidad"
                              onClick={() => handleActualizarCantidad(p.id, item.id, item.cantidad - 1)}
                              disabled={item.cantidad === 1}
                              title="Disminuir cantidad"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.cantidad}
                              onChange={(e) => handleActualizarCantidad(p.id, item.id, parseInt(e.target.value) || 1)}
                              className="cantidad-input"
                            />
                            <button
                              className="btn-cantidad"
                              onClick={() => handleActualizarCantidad(p.id, item.id, item.cantidad + 1)}
                              title="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                          <span className="item-subtotal">${(item.precio * item.cantidad).toLocaleString()}</span>
                          <button
                            className="btn-eliminar-item"
                            onClick={() => handleEliminarItem(p.id, item.id)}
                            title="Eliminar este item"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Agregar nuevo item */}
                    {productosDisponibles.length > 0 && (
                      <div className="agregar-item-container">
                        <label>Agregar producto:</label>
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAgregarItem(p.id, parseInt(e.target.value));
                              e.target.value = "";
                            }
                          }}
                          className="select-agregar"
                        >
                          <option value="">Seleccionar producto...</option>
                          {productosDisponibles.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.nombre} - ${prod.precio.toLocaleString()} (Stock: {prod.stock})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="edicion-botones">
                      <button className="btn-guardar" onClick={cerrarEdicion}>
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
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
                )}

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

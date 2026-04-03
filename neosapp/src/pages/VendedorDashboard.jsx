import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import "../styles/vendedor-dashboard.css";

export default function VendedorDashboard() {
  const { obtenerDatosUsuario } = useAuth();
  const { clientes, pedidos, productos, crearPedido } = useStore();
  const vendedorData = obtenerDatosUsuario();
  
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [descripcionPago, setDescripcionPago] = useState("");
  const [mostrarCrearPedido, setMostrarCrearPedido] = useState(false);
  const [itemsPedido, setItemsPedido] = useState([]);
  const [formaPagoPedido, setFormaPagoPedido] = useState("Crédito");

  // Obtener clientes del vendedor
  const clientesVendedor = clientes.filter(
    c => c.vendedor_id === vendedorData?.id
  );

  const clienteSeleccionado = clienteSeleccionadoId
    ? clientesVendedor.find((c) => c.id === clienteSeleccionadoId)
    : null;

  const pedidosCliente = clienteSeleccionado
    ? pedidos.filter((p) => p.clienteCedula === clienteSeleccionado.cedula)
    : [];

  const handleAgregarProducto = (producto) => {
    const itemExistente = itemsPedido.find(item => item.id === producto.id);
    
    if (itemExistente) {
      setItemsPedido(
        itemsPedido.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setItemsPedido([
        ...itemsPedido,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1
        }
      ]);
    }
  };

  const handleEliminarProducto = (productoId) => {
    setItemsPedido(itemsPedido.filter(item => item.id !== productoId));
  };

  const handleCambiarCantidad = (productoId, cantidad) => {
    if (cantidad <= 0) {
      handleEliminarProducto(productoId);
      return;
    }
    setItemsPedido(
      itemsPedido.map(item =>
        item.id === productoId
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const handleCrearPedido = () => {
    if (!clienteSeleccionado || itemsPedido.length === 0) {
      alert("Por favor selecciona un cliente y agrega productos");
      return;
    }

    const resultado = crearPedido(
      clienteSeleccionado.cedula,
      clienteSeleccionado.nombre,
      clienteSeleccionado.direccion,
      itemsPedido,
      formaPagoPedido
    );

    if (resultado.success) {
      alert("Pedido creado correctamente");
      setItemsPedido([]);
      setMostrarCrearPedido(false);
    } else {
      alert("Error al crear el pedido");
    }
  };

  const totalPedido = itemsPedido.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="vendedor-dashboard">
      <div className="vendedor-header">
        <div>
          <h2>Mi Cartera de Clientes</h2>
          <p>Bienvenido, {vendedorData?.nombre} - Zona: {vendedorData?.zona}</p>
        </div>
        <div className="vendor-stats">
          <div className="stat-card">
            <span className="stat-label">Total Clientes</span>
            <span className="stat-value">{clientesVendedor.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pedidos Totales</span>
            <span className="stat-value">
              {pedidos.filter(p => 
                clientesVendedor.some(c => c.cedula === p.clienteCedula)
              ).length}
            </span>
          </div>
        </div>
      </div>

      <div className="vendedor-contenedor">
        {/* Lista de clientes */}
        <div className="clientes-lista">
          <h3>Mis Clientes ({clientesVendedor.length})</h3>
          <div className="clientes-scroll">
            {clientesVendedor.length === 0 ? (
              <p className="texto-vacio">No tienes clientes asignados</p>
            ) : (
              clientesVendedor.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`cliente-item ${clienteSeleccionadoId === cliente.id ? "activo" : ""}`}
                  onClick={() => setClienteSeleccionadoId(cliente.id)}
                >
                  <p className="cliente-nombre">{cliente.nombre}</p>
                  <p className="cliente-cedula">{cliente.cedula}</p>
                  <p className="cliente-saldo">
                    Saldo: <span className={cliente.saldo > 0 ? "debe" : cliente.saldo < 0 ? "favor" : "al-dia"}>
                      {cliente.saldo > 0 ? "$" : cliente.saldo < 0 ? "-$" : "$"}{Math.abs(cliente.saldo).toLocaleString()}
                    </span>
                  </p>
                  <p className="cliente-pedidos">{pedidos.filter((p) => p.clienteCedula === cliente.cedula).length} pedidos</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detalles del cliente */}
        {clienteSeleccionado && (
          <div className="cliente-detalle">
            <div className="detalle-header">
              <h3>{clienteSeleccionado.nombre}</h3>
              <button 
                className="btn-crear-pedido"
                onClick={() => setMostrarCrearPedido(!mostrarCrearPedido)}
              >
                {mostrarCrearPedido ? "Cancelar" : "➕ Crear Pedido"}
              </button>
            </div>

            {/* Información del cliente */}
            <div className="info-cliente">
              <div className="info-group">
                <label>Cédula:</label>
                <p>{clienteSeleccionado.cedula}</p>
              </div>

              <div className="info-group">
                <label>Dirección:</label>
                <p>{clienteSeleccionado.direccion}</p>
              </div>

              <div className="info-group">
                <label>Teléfono:</label>
                <p>{clienteSeleccionado.telefono || "No asignado"}</p>
              </div>

              <div className="info-group">
                <label>Saldo:</label>
                <p className={clienteSeleccionado.saldo > 0 ? "debe" : clienteSeleccionado.saldo < 0 ? "favor" : "al-dia"}>
                  {clienteSeleccionado.saldo > 0 ? "Debe: $" : clienteSeleccionado.saldo < 0 ? "A Favor: $" : "Al día: $"}
                  {Math.abs(clienteSeleccionado.saldo).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Crear Pedido */}
            {mostrarCrearPedido && (
              <div className="crear-pedido-section">
                <h4>Crear Nuevo Pedido</h4>
                
                <div className="productos-disponibles">
                  <h5>Productos Disponibles</h5>
                  <div className="productos-grid">
                    {productos.map((producto) => (
                      <div key={producto.id} className="producto-item">
                        <div className="producto-info">
                          <p className="producto-nombre">{producto.nombre}</p>
                          <p className="producto-precio">${producto.precio.toLocaleString()}</p>
                          <p className="producto-stock">Stock: {producto.stock}</p>
                        </div>
                        <button
                          className="btn-agregar"
                          onClick={() => handleAgregarProducto(producto)}
                          disabled={producto.stock === 0}
                        >
                          Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {itemsPedido.length > 0 && (
                  <div className="pedido-resumen">
                    <h5>Resumen del Pedido</h5>
                    <table className="tabla-pedido">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Precio</th>
                          <th>Cantidad</th>
                          <th>Subtotal</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsPedido.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>${item.precio.toLocaleString()}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                value={item.cantidad}
                                onChange={(e) =>
                                  handleCambiarCantidad(
                                    item.id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="input-cantidad"
                              />
                            </td>
                            <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                            <td>
                              <button
                                className="btn-eliminar"
                                onClick={() => handleEliminarProducto(item.id)}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="pedido-total">
                      <label>Total: ${totalPedido.toLocaleString()}</label>
                    </div>

                    <div className="forma-pago">
                      <label>Forma de Pago:</label>
                      <select
                        value={formaPagoPedido}
                        onChange={(e) => setFormaPagoPedido(e.target.value)}
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Crédito">Crédito</option>
                        <option value="Abono">Abono</option>
                      </select>
                    </div>

                    <button
                      className="btn-confirmar-pedido"
                      onClick={handleCrearPedido}
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Historial de pedidos */}
            <div className="pedidos-historial">
              <h4>Pedidos del Cliente ({pedidosCliente.length})</h4>
              {pedidosCliente.length === 0 ? (
                <p className="texto-vacio">No hay pedidos registrados</p>
              ) : (
                <div className="pedidos-list">
                  {pedidosCliente.map((pedido) => (
                    <div key={pedido.id} className="pedido-card">
                      <div className="pedido-header">
                        <span className="pedido-id">Pedido #{pedido.id}</span>
                        <span className={`estado-badge ${pedido.estado.toLowerCase().replace(" ", "-")}`}>
                          {pedido.estado}
                        </span>
                      </div>
                      <div className="pedido-info">
                        <p><strong>Fecha:</strong> {pedido.fecha}</p>
                        <p><strong>Total:</strong> ${pedido.total.toLocaleString()}</p>
                        <p><strong>Forma de Pago:</strong> {pedido.formaPago}</p>
                        <p><strong>Repartidor:</strong> {pedido.repartidor || "No asignado"}</p>
                      </div>
                      <div className="pedido-items">
                        <strong>Items:</strong>
                        <ul>
                          {pedido.items.map((item, idx) => (
                            <li key={idx}>
                              {item.nombre} x{item.cantidad} - ${(item.precio * item.cantidad).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useStore } from "../context/StoreContext";
import "./producto.css";

const CATEGORIAS = [
  "Ganchos para cabello",
  "Tratamientos",
  "Esmaltes",
  "Accesorios",
];

const FORMAS_PAGO = ["Efectivo", "Crédito", "Abono"];

export default function Producto() {
  const { productos, setProductos, crearPedido } = useStore();

  // Estados para crear nuevo producto
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    categoria: CATEGORIAS[0],
  });

  // Estados para el carrito
  const [carrito, setCarrito] = useState([]);
  const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
  const [datosCliente, setDatosCliente] = useState({
    cedula: "",
    nombre: "",
    direccion: "",
    formaPago: FORMAS_PAGO[0],
  });

  const crearProducto = () => {
    if (!nuevo.nombre || !nuevo.precio) return;

    setProductos([
      ...productos,
      {
        id: Date.now(),
        nombre: nuevo.nombre,
        precio: Number(nuevo.precio),
        categoria: nuevo.categoria,
        stock: 10,
      },
    ]);

    setNuevo({ nombre: "", precio: "", categoria: CATEGORIAS[0] });
    setMostrarModal(false);
  };

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) return;

    const productoEnCarrito = carrito.find((p) => p.id === producto.id);

    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad < producto.stock) {
        setCarrito(
          carrito.map((p) =>
            p.id === producto.id
              ? { ...p, cantidad: p.cantidad + 1 }
              : p
          )
        );
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter((p) => p.id !== productoId));
  };

  const actualizarCantidad = (productoId, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const producto = productos.find((p) => p.id === productoId);
    if (cantidad > producto.stock) return;

    setCarrito(
      carrito.map((p) =>
        p.id === productoId ? { ...p, cantidad } : p
      )
    );
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const finalizarPedido = () => {
    if (!datosCliente.cedula || !datosCliente.nombre || !datosCliente.direccion || carrito.length === 0) {
      alert("Por favor completa todos los datos (Cédula, Nombre, Dirección) y agrega productos");
      return;
    }

    crearPedido(datosCliente.cedula, datosCliente.nombre, datosCliente.direccion, carrito, datosCliente.formaPago);

    setCarrito([]);
    setDatosCliente({
      cedula: "",
      nombre: "",
      direccion: "",
      formaPago: FORMAS_PAGO[0],
    });
    setMostrarModalPedido(false);
    alert("Pedido creado exitosamente");
  };

  return (
    <div className="productos-page">
      <div className="productos-header">
        <h2>Tienda de Productos</h2>
        <div>
          <button
            className="btn-primary"
            onClick={() => setMostrarModal(true)}
          >
            + Nuevo producto
          </button>
          {carrito.length > 0 && (
            <button
              className="btn-carrito"
              onClick={() => setMostrarModalPedido(true)}
            >
              🛒 Carrito ({carrito.length})
            </button>
          )}
        </div>
      </div>

      {CATEGORIAS.map((categoria) => (
        <div className="categoria-bloque" key={categoria}>
          <h3 className="categoria-titulo">{categoria}</h3>

          <div className="productos-scroll">
            {productos
              .filter((p) => p.categoria === categoria)
              .map((p) => (
                <div className="producto-card" key={p.id}>
                  <div className="producto-imagen">Imagen</div>

                  <div className="producto-info">
                    <span className="producto-nombre">
                      {p.nombre}
                    </span>
                    <span className="producto-precio">
                      ${p.precio.toLocaleString()}
                    </span>
                    <span className={`producto-stock ${p.stock <= 0 ? "sinstock" : ""}`}>
                      Stock: {p.stock}
                    </span>
                  </div>

                  <div className="producto-acciones">
                    <button
                      className="btn-agregar-carrito"
                      onClick={() => agregarAlCarrito(p)}
                      disabled={p.stock <= 0}
                    >
                      Agregar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() =>
                        setProductos(
                          productos.filter((x) => x.id !== p.id)
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Modal para crear producto */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nuevo producto</h3>

            <input
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={(e) =>
                setNuevo({ ...nuevo, nombre: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Precio"
              value={nuevo.precio}
              onChange={(e) =>
                setNuevo({ ...nuevo, precio: e.target.value })
              }
            />

            <select
              value={nuevo.categoria}
              onChange={(e) =>
                setNuevo({ ...nuevo, categoria: e.target.value })
              }
            >
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={crearProducto}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para finalizar pedido */}
      {mostrarModalPedido && (
        <div className="modal-overlay">
          <div className="modal modal-grande">
            <h3>Finalizar Pedido</h3>

            <div className="modal-carrito">
              <h4>Productos en el carrito:</h4>
              <div className="carrito-items">
                {carrito.map((item) => (
                  <div key={item.id} className="carrito-item">
                    <div>
                      <p><strong>{item.nombre}</strong></p>
                      <p>${item.precio.toLocaleString()}</p>
                    </div>
                    <div className="cantidad-control">
                      <button
                        onClick={() =>
                          actualizarCantidad(item.id, item.cantidad - 1)
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(item.id, Number(e.target.value))
                        }
                      />
                      <button
                        onClick={() =>
                          actualizarCantidad(item.id, item.cantidad + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p><strong>${(item.precio * item.cantidad).toLocaleString()}</strong></p>
                    <button
                      className="btn-delete-small"
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="carrito-total">
                <h4>Total: ${calcularTotal().toLocaleString()}</h4>
              </div>
            </div>

            <div className="formulario-cliente">
              <h4>Datos del cliente:</h4>
              <input
                placeholder="Cédula o NIT"
                value={datosCliente.cedula}
                onChange={(e) =>
                  setDatosCliente({ ...datosCliente, cedula: e.target.value })
                }
              />

              <input
                placeholder="Nombre del cliente"
                value={datosCliente.nombre}
                onChange={(e) =>
                  setDatosCliente({ ...datosCliente, nombre: e.target.value })
                }
              />

              <input
                placeholder="Dirección"
                value={datosCliente.direccion}
                onChange={(e) =>
                  setDatosCliente({ ...datosCliente, direccion: e.target.value })
                }
              />

              <select
                value={datosCliente.formaPago}
                onChange={(e) =>
                  setDatosCliente({ ...datosCliente, formaPago: e.target.value })
                }
              >
                {FORMAS_PAGO.map((forma) => (
                  <option key={forma}>{forma}</option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => setMostrarModalPedido(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={finalizarPedido}
              >
                Crear Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

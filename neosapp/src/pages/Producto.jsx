import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import "./producto.css";

const CATEGORIAS = [
  "Ganchos para cabello",
  "Tratamientos",
  "Esmaltes",
  "Accesorios",
];

const FORMAS_PAGO = ["Efectivo", "Crédito", "Abono"];

export default function Producto() {
  const { productos, setProductos, crearProducto, actualizarStock, agotarProducto, crearPedido } = useStore();
  const { esAdmin } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    categoria: CATEGORIAS[0],
    stock: "",
    descripcion: "",
  });

  // Estados para ver detalles del producto
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [productoDetalles, setProductoDetalles] = useState(null);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [cantidadDetalles, setCantidadDetalles] = useState(1);

  // Estados para actualizar stock
  const [mostrarModalStock, setMostrarModalStock] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoStock, setNuevoStock] = useState("");

  // Estados para el carrito
  const [carrito, setCarrito] = useState([]);
  const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
  const [mostrarModalCantidad, setMostrarModalCantidad] = useState(false);
  const [productoCantidad, setProductoCantidad] = useState(null);
  const [cantidadInput, setCantidadInput] = useState(1);
  const [datosCliente, setDatosCliente] = useState({
    cedula: "",
    nombre: "",
    direccion: "",
    formaPago: FORMAS_PAGO[0],
  });

  const crearProductoHandler = () => {
    if (!nuevo.nombre || !nuevo.precio || !nuevo.stock) {
      alert("Por favor completa nombre, precio y stock");
      return;
    }

    const resultado = crearProducto(
      nuevo.nombre, 
      nuevo.precio, 
      nuevo.categoria, 
      nuevo.stock,
      nuevo.descripcion
    );

    if (resultado.error) {
      alert(`Error: ${resultado.error}`);
      return;
    }

    setNuevo({ nombre: "", precio: "", categoria: CATEGORIAS[0], stock: "", descripcion: "" });
    setMostrarModal(false);
    alert("✅ Producto creado exitosamente");
  };

  const abrirDetalles = (producto) => {
    setProductoDetalles(producto);
    setIndiceCarrusel(0);
    setCantidadDetalles(1);
    setMostrarDetalles(true);
  };

  const siguienteImagen = () => {
    setIndiceCarrusel(
      (prev) => (prev + 1) % productoDetalles.imagenes.length
    );
  };

  const imagenAnterior = () => {
    setIndiceCarrusel(
      (prev) => (prev - 1 + productoDetalles.imagenes.length) % productoDetalles.imagenes.length
    );
  };

  const abrirModalStock = (producto) => {
    setProductoSeleccionado(producto);
    setNuevoStock(producto.stock.toString());
    setMostrarModalStock(true);
  };

  const actualizarStockHandler = () => {
    if (!nuevoStock) return;

    const cantidad = Number(nuevoStock) - productoSeleccionado.stock;
    if (cantidad === 0) {
      alert("El stock es igual al actual");
      setMostrarModalStock(false);
      return;
    }

    const resultado = actualizarStock(productoSeleccionado.id, cantidad);
    if (resultado) {
      alert(`✅ Stock actualizado a ${nuevoStock} unidades`);
      setMostrarModalStock(false);
      setNuevoStock("");
    } else {
      alert("❌ No se puede establecer un stock negativo");
    }
  };

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) return;

    if (esAdmin()) {
      // Los administradores pueden agregar directamente
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
    } else {
      // Los clientes deben especificar la cantidad
      setProductoCantidad(producto);
      setCantidadInput(1);
      setMostrarModalCantidad(true);
    }
  };

  const confirmarAgregarCantidad = () => {
    if (!productoCantidad || cantidadInput <= 0) return;

    if (cantidadInput > productoCantidad.stock) {
      alert(`No hay suficiente stock. Stock disponible: ${productoCantidad.stock}`);
      return;
    }

    const productoEnCarrito = carrito.find((p) => p.id === productoCantidad.id);

    if (productoEnCarrito) {
      const nuevaCantidad = productoEnCarrito.cantidad + cantidadInput;
      if (nuevaCantidad > productoCantidad.stock) {
        alert(`No hay suficiente stock. Máximo disponible: ${productoCantidad.stock}`);
        return;
      }
      setCarrito(
        carrito.map((p) =>
          p.id === productoCantidad.id
            ? { ...p, cantidad: nuevaCantidad }
            : p
        )
      );
    } else {
      setCarrito([...carrito, { ...productoCantidad, cantidad: cantidadInput }]);
    }

    setMostrarModalCantidad(false);
    setProductoCantidad(null);
    setCantidadInput(1);
    alert("✅ Producto agregado al carrito");
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
          {esAdmin() && (
            <button
              className="btn-primary"
              onClick={() => setMostrarModal(true)}
            >
              + Nuevo producto
            </button>
          )}
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
                <div 
                  className="producto-card" 
                  key={p.id}
                  onClick={() => abrirDetalles(p)}
                  role="button"
                  tabIndex="0"
                >
                  <div className="producto-imagen">
                    <img 
                      src={p.imagenes?.[0] || "https://images.unsplash.com/photo-1522338242592-cb0acf6f85a2?w=500&h=500&fit=crop"} 
                      alt={p.nombre}
                    />
                  </div>

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
                    {esAdmin() && (
                      <>
                        <button
                          className="btn-stock"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalStock(p);
                          }}
                          title="Actualizar stock"
                        >
                          Actualizar stock
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductos(
                              productos.filter((x) => x.id !== p.id)
                            );
                          }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Modal para crear producto */}
      {mostrarModal && esAdmin() && (
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

            <input
              type="number"
              placeholder="Stock inicial"
              value={nuevo.stock}
              onChange={(e) =>
                setNuevo({ ...nuevo, stock: e.target.value })
              }
              min="0"
            />

            <textarea
              placeholder="Descripción del producto (opcional)"
              value={nuevo.descripcion}
              onChange={(e) =>
                setNuevo({ ...nuevo, descripcion: e.target.value })
              }
              rows="3"
              style={{ fontFamily: "inherit", resize: "vertical" }}
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
                onClick={crearProductoHandler}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para actualizar stock */}
      {mostrarModalStock && productoSeleccionado && esAdmin() && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Actualizar Stock</h3>
            <p><strong>{productoSeleccionado.nombre}</strong></p>
            <p>Stock actual: <strong>{productoSeleccionado.stock}</strong> unidades</p>

            <input
              type="number"
              placeholder="Nuevo stock"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value)}
              min="0"
            />

            <div className="modal-actions">
              <button onClick={() => setMostrarModalStock(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={actualizarStockHandler}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del producto */}
      {mostrarDetalles && productoDetalles && (
        <div className="modal-overlay" onClick={() => setMostrarDetalles(false)}>
          <div className="modal-detalles" onClick={(e) => e.stopPropagation()}>
            <button 
              className="btn-cerrar"
              onClick={() => setMostrarDetalles(false)}
            >
              ✕
            </button>

            <div className="detalles-contenedor">
              {/* Carrusel de imágenes */}
              <div className="detalles-carrusel">
                <img 
                  src={productoDetalles.imagenes[indiceCarrusel]} 
                  alt={productoDetalles.nombre}
                  className="imagen-principal"
                />
                
                {productoDetalles.imagenes.length > 1 && (
                  <>
                    <button 
                      className="btn-carrusel-prev"
                      onClick={imagenAnterior}
                    >
                      ❮
                    </button>
                    <button 
                      className="btn-carrusel-next"
                      onClick={siguienteImagen}
                    >
                      ❯
                    </button>
                  </>
                )}

                <div className="indicadores-carrusel">
                  {productoDetalles.imagenes.map((_, index) => (
                    <button
                      key={index}
                      className={`indicador ${index === indiceCarrusel ? "activo" : ""}`}
                      onClick={() => setIndiceCarrusel(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Información del producto */}
              <div className="detalles-info">
                <h2>{productoDetalles.nombre}</h2>
                
                <div className="detalles-categoria">
                  <span className="badge-categoria">{productoDetalles.categoria}</span>
                </div>

                <p className="detalles-descripcion">
                  {productoDetalles.descripcion || "No hay descripción disponible"}
                </p>

                <div className="detalles-precio-stock">
                  <div className="precio-grande">
                    ${productoDetalles.precio.toLocaleString()}
                  </div>
                  <div className={`stock-info ${productoDetalles.stock <= 0 ? "sinstock" : "constock"}`}>
                    {productoDetalles.stock <= 0 
                      ? "❌ Sin stock" 
                      : `✓ ${productoDetalles.stock} disponibles`}
                  </div>
                </div>

                <div className="detalles-acciones">
                  <div className="cantidad-detalles">
                    <label>Cantidad:</label>
                    <div className="cantidad-input-group-detalles">
                      <button
                        onClick={() => setCantidadDetalles(Math.max(1, cantidadDetalles - 1))}
                        className="btn-cantidad-detalles"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={cantidadDetalles}
                        onChange={(e) => {
                          const valor = Number(e.target.value);
                          if (valor > 0 && valor <= productoDetalles.stock) {
                            setCantidadDetalles(valor);
                          }
                        }}
                        min="1"
                        max={productoDetalles.stock}
                        className="cantidad-input-detalles"
                      />
                      <button
                        onClick={() => setCantidadDetalles(Math.min(productoDetalles.stock, cantidadDetalles + 1))}
                        className="btn-cantidad-detalles"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn-agregar-grande"
                    onClick={() => {
                      if (cantidadDetalles <= 0 || cantidadDetalles > productoDetalles.stock) {
                        alert("Cantidad inválida");
                        return;
                      }

                      const productoEnCarrito = carrito.find((p) => p.id === productoDetalles.id);
                      if (productoEnCarrito) {
                        const nuevaCantidad = productoEnCarrito.cantidad + cantidadDetalles;
                        if (nuevaCantidad > productoDetalles.stock) {
                          alert(`No hay suficiente stock. Máximo disponible: ${productoDetalles.stock}`);
                          return;
                        }
                        setCarrito(
                          carrito.map((p) =>
                            p.id === productoDetalles.id
                              ? { ...p, cantidad: nuevaCantidad }
                              : p
                          )
                        );
                      } else {
                        setCarrito([...carrito, { ...productoDetalles, cantidad: cantidadDetalles }]);
                      }

                      alert("✅ Producto agregado al carrito");
                      setMostrarDetalles(false);
                      setCantidadDetalles(1);
                    }}
                    disabled={productoDetalles.stock <= 0}
                  >
                    🛒 Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para seleccionar cantidad */}
      {mostrarModalCantidad && productoCantidad && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cantidad de productos</h3>
            <p style={{ marginBottom: "16px", color: "#666" }}>
              <strong>{productoCantidad.nombre}</strong>
            </p>
            <p style={{ marginBottom: "16px", fontSize: "14px", color: "#888" }}>
              Stock disponible: {productoCantidad.stock} unidades
            </p>

            <div className="cantidad-selector">
              <label>¿Cuántos deseas agregar?</label>
              <div className="cantidad-input-group">
                <button
                  onClick={() => setCantidadInput(Math.max(1, cantidadInput - 1))}
                  className="btn-cantidad"
                >
                  −
                </button>
                <input
                  type="number"
                  value={cantidadInput}
                  onChange={(e) => {
                    const valor = Number(e.target.value);
                    if (valor > 0) setCantidadInput(valor);
                  }}
                  min="1"
                  max={productoCantidad.stock}
                  className="cantidad-input"
                />
                <button
                  onClick={() => setCantidadInput(Math.min(productoCantidad.stock, cantidadInput + 1))}
                  className="btn-cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setMostrarModalCantidad(false);
                  setProductoCantidad(null);
                  setCantidadInput(1);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={confirmarAgregarCantidad}
              >
                Agregar al carrito
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

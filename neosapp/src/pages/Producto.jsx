import { useState } from "react";
import "./producto.css";

const CATEGORIAS = [
  "Ganchos para cabello",
  "Tratamientos",
  "Esmaltes",
  "Accesorios",
];

export default function Producto() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Gancho Dorado", categoria: "Ganchos para cabello", precio: 8000 },
    { id: 2, nombre: "Gancho Perla", categoria: "Ganchos para cabello", precio: 9500 },
    { id: 3, nombre: "Keratina Pro", categoria: "Tratamientos", precio: 45000 },
    { id: 4, nombre: "Esmalte Rojo", categoria: "Esmaltes", precio: 12000 },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    categoria: CATEGORIAS[0],
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
      },
    ]);

    setNuevo({ nombre: "", precio: "", categoria: CATEGORIAS[0] });
    setMostrarModal(false);
  };

  return (
    <div className="productos-page">
      {/* HEADER */}
      <div className="productos-header">
        <h2>Productos</h2>
        <button className="btn-primary" onClick={() => setMostrarModal(true)}>
          + Nuevo producto
        </button>
      </div>

      {/* CATEGORÍAS */}
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
                    <span className="producto-nombre">{p.nombre}</span>
                    <span className="producto-precio">
                      ${p.precio.toLocaleString()}
                    </span>
                  </div>

                  <div className="producto-acciones">
                    <button className="btn-edit">Editar</button>
                    <button
                      className="btn-delete"
                      onClick={() =>
                        setProductos(productos.filter((x) => x.id !== p.id))
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

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nuevo producto</h3>

            <input
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            />

            <input
              type="number"
              placeholder="Precio"
              value={nuevo.precio}
              onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
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
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={crearProducto}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

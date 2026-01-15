import { useState } from "react";
import "./producto.css";

const CATEGORIAS = [
  "Ganchos para cabello",
  "Tratamientos",
  "Esmaltes",
  "Accesorios",
];

export default function Producto() {
  const [productos] = useState([
    {
      id: 1,
      nombre: "Gancho Dorado",
      categoria: "Ganchos para cabello",
      precio: 8000,
      imagen: "",
    },
    {
      id: 2,
      nombre: "Gancho Perla",
      categoria: "Ganchos para cabello",
      precio: 9500,
      imagen: "",
    },
    {
      id: 3,
      nombre: "Keratina Pro",
      categoria: "Tratamientos",
      precio: 45000,
      imagen: "",
    },
    {
      id: 4,
      nombre: "Esmalte Rojo",
      categoria: "Esmaltes",
      precio: 12000,
      imagen: "",
    },
  ]);

  return (
    <div className="productos-page">
      {/* HEADER */}
      <div className="productos-header">
        <h2>Productos</h2>
        <button className="btn-primary">+ Nuevo producto</button>
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
                  <div className="producto-imagen">
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} />
                    ) : (
                      <span>Imagen</span>
                    )}
                  </div>

                  <div className="producto-info">
                    <span className="producto-nombre">{p.nombre}</span>
                    <span className="producto-precio">
                      ${p.precio.toLocaleString()}
                    </span>
                  </div>

                  {/* ACCIONES ADMIN */}
                  <div className="producto-acciones">
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete">Eliminar</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

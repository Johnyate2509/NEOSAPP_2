import { useState } from "react";
import { useStore } from "../context/StoreContext";
import "../styles/repartidores.css";

export default function Repartidores() {
  const { repartidores, crearRepartidor, eliminarRepartidor } = useStore();
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("");

  const agregarRepartidor = () => {
    crearRepartidor(nombre, zona);
    setNombre("");
    setZona("");
  };

  return (
    <>
      <div className="repartidores-header">
        <h2>Repartidores</h2>
        <p>Panel de repartidores.</p>
      </div>

      {/* Formulario */}
      <div className="repartidores-form">
        <input
          type="text"
          className="repartidores-input"
          placeholder="Nombre del repartidor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          className="repartidores-input"
          placeholder="Zona"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
        />

        <button className="btn-agregar" onClick={agregarRepartidor}>
          Agregar Repartidor
        </button>
      </div>

      {/* Tarjetas */}
      <div className="repartidores-container">
        {repartidores.map((repartidor) => (
          <div key={repartidor.id} className="tarjeta-repartidor">
            <h4>{repartidor.nombre}</h4>
            <p>Zona: {repartidor.zona}</p>

            <button
              className="btn-eliminar"
              onClick={() => eliminarRepartidor(repartidor.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

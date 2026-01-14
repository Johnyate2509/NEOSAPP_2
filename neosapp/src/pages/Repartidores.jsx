import { useState } from "react";

export default function Repartidores() {
  const [repartidores, setRepartidores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("");

  const agregarRepartidor = () => {
    if (!nombre || !zona) return;

    setRepartidores([
      ...repartidores,
      {
        id: Date.now(),
        nombre,
        zona
      }
    ]);

    setNombre("");
    setZona("");
  };

  const eliminarRepartidor = (id) => {
    setRepartidores(
      repartidores.filter(repartidor => repartidor.id !== id)
    );
  };

  return (
    <>
      <h2>Repartidores</h2>
      <p>Panel de repartidores.</p>

      {/* Formulario */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre del repartidor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Zona"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
        />

        <button onClick={agregarRepartidor}>
          Agregar
        </button>
      </div>

      {/* Tarjetas */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {repartidores.map((repartidor) => (
          <div
            key={repartidor.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "220px"
            }}
          >
            <h4>{repartidor.nombre}</h4>
            <p>Zona: {repartidor.zona}</p>

            <button
              onClick={() => eliminarRepartidor(repartidor.id)}
              style={{
                background: "#e63946",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

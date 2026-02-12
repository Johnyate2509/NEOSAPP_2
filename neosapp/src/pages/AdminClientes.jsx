import { useState } from "react";
import { useStore } from "../context/StoreContext";
import "../styles/admin-clientes.css";

export default function AdminClientes() {
  const { clientes, crearCliente } = useStore();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    cedula: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleCrearCliente = () => {
    if (!nuevoCliente.cedula || !nuevoCliente.nombre || !nuevoCliente.direccion) {
      setMensaje("❌ Cédula, nombre y dirección son requeridos");
      return;
    }

    const resultado = crearCliente(
      nuevoCliente.nombre,
      nuevoCliente.cedula,
      nuevoCliente.direccion,
      nuevoCliente.telefono
    );

    if (resultado.error) {
      setMensaje(`❌ ${resultado.error}`);
      return;
    }

    setMensaje(`✅ Cliente ${nuevoCliente.nombre} creado correctamente`);
    setNuevoCliente({
      cedula: "",
      nombre: "",
      direccion: "",
      telefono: "",
    });
    setTimeout(() => {
      setMostrarForm(false);
      setMensaje("");
    }, 2000);
  };

  return (
    <div className="admin-clientes-page">
      <div className="admin-header">
        <h2>Administración de Clientes</h2>
        <button className="btn-crear" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? "✕ Cancelar" : "+ Crear Cliente"}
        </button>
      </div>

      {/* Formulario de creación */}
      {mostrarForm && (
        <div className="form-crear-cliente">
          <h3>Registrar Nuevo Cliente</h3>
          {mensaje && <div className={`mensaje ${mensaje.includes("✅") ? "exito" : "error"}`}>{mensaje}</div>}
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Cédula o NIT"
              value={nuevoCliente.cedula}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, cedula: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nombre Completo"
              value={nuevoCliente.nombre}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dirección"
              value={nuevoCliente.direccion}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Teléfono (Opcional)"
              value={nuevoCliente.telefono}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
            />
          </div>

          <button className="btn-guardar" onClick={handleCrearCliente}>
            Guardar Cliente
          </button>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="clientes-grid">
        <h3>Total de Clientes: {clientes.length}</h3>
        <div className="clientes-table">
          <div className="table-header">
            <div className="col-cedula">Cédula</div>
            <div className="col-nombre">Nombre</div>
            <div className="col-direccion">Dirección</div>
            <div className="col-telefono">Teléfono</div>
          </div>

          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <div key={cliente.id} className="table-row">
                <div className="col-cedula">{cliente.cedula}</div>
                <div className="col-nombre">{cliente.nombre}</div>
                <div className="col-direccion">{cliente.direccion}</div>
                <div className="col-telefono">{cliente.telefono || "-"}</div>
              </div>
            ))
          ) : (
            <div className="table-empty">No hay clientes registrados</div>
          )}
        </div>
      </div>
    </div>
  );
}

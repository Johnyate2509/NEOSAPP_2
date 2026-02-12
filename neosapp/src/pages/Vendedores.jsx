import { useState } from "react";
import { useStore } from "../context/StoreContext";
import "../styles/vendedores.css";

export default function Vendedores() {
  const { vendedores, obtenerClientesPorVendedor, calcularVentasPorVendedor } = useStore();
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);

  const handleSeleccionarVendedor = (vendedorId) => {
    setVendedorSeleccionado(vendedorSeleccionado === vendedorId ? null : vendedorId);
  };

  return (
    <div className="vendedores-page">
      <div className="vendedores-header">
        <h2>Gestión de Vendedores</h2>
        <p className="total-vendedores">Total de vendedores: {vendedores.length}</p>
      </div>

      <div className="vendedores-grid">
        {vendedores.map((vendedor) => {
          const clientesVendedor = obtenerClientesPorVendedor(vendedor.id);
          const totalVentas = calcularVentasPorVendedor(vendedor.id);
          const isSeleccionado = vendedorSeleccionado === vendedor.id;

          return (
            <div key={vendedor.id} className="vendedor-card">
              <div
                className="vendedor-header"
                onClick={() => handleSeleccionarVendedor(vendedor.id)}
              >
                <div className="vendedor-info">
                  <h3>{vendedor.nombre}</h3>
                  <div className="zona-badge">{vendedor.zona}</div>
                </div>
                <div className="vendedor-stats">
                  <div className="stat">
                    <span className="stat-label">Clientes</span>
                    <span className="stat-value">{clientesVendedor.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Ventas</span>
                    <span className="stat-value">
                      ${totalVentas.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
                <span className={`expand-icon ${isSeleccionado ? "expanded" : ""}`}>
                  ▼
                </span>
              </div>

              {isSeleccionado && (
                <div className="vendedor-clientes">
                  {clientesVendedor.length > 0 ? (
                    <div className="clientes-list">
                      <h4>Clientes Asignados</h4>
                      <div className="clientes-table">
                        <div className="table-header">
                          <div className="col-nombre">Nombre</div>
                          <div className="col-cedula">Cédula</div>
                          <div className="col-correo">Correo</div>
                          <div className="col-ventas">Ventas</div>
                        </div>
                        {clientesVendedor.map((cliente) => {
                          const ventasCliente = cliente.transacciones
                            .filter((t) => t.tipo === "pedido")
                            .reduce((sum, t) => sum + t.monto, 0);

                          return (
                            <div key={cliente.id} className="table-row">
                              <div className="col-nombre">{cliente.nombre}</div>
                              <div className="col-cedula">{cliente.cedula}</div>
                              <div className="col-correo">
                                {cliente.correo || "-"}
                              </div>
                              <div className="col-ventas">
                                ${ventasCliente.toLocaleString("es-CO")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="sin-clientes">
                      <p>📭 Este vendedor no tiene clientes asignados</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {vendedores.length === 0 && (
        <div className="empty-state">
          <p>No hay vendedores registrados</p>
        </div>
      )}
    </div>
  );
}

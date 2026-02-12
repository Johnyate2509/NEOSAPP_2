import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Gancho Dorado", categoria: "Ganchos para cabello", precio: 8000, stock: 10 },
    { id: 2, nombre: "Keratina Pro", categoria: "Tratamientos", precio: 45000, stock: 5 },
  ]);

  const [repartidores, setRepartidores] = useState([]);

  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: "Ana Pérez",
      cedula: "1234567890",
      direccion: "Calle Principal 123",
      telefono: "3001234567",
      saldo: 30000,
      transacciones: [
        { id: 1, tipo: "pedido", monto: 45000, fecha: "10/02/2026", descripcion: "Pedido #1 - Crédito", pedidoId: 1 },
        { id: 2, tipo: "pago", monto: 15000, fecha: "11/02/2026", descripcion: "Abono parcial" }
      ]
    },
    {
      id: 2,
      nombre: "Laura Gómez",
      cedula: "0987654321",
      direccion: "Avenida Central 456",
      telefono: "3109876543",
      saldo: 0,
      transacciones: [
        { id: 1, tipo: "pedido", monto: 30000, fecha: "10/02/2026", descripcion: "Pedido #2 - Efectivo", pedidoId: 2 }
      ]
    }
  ]);

  const [pedidos, setPedidos] = useState([
  {
    id: 1,
    cliente: "Ana Pérez",
    direccion: "Calle Principal 123",
    items: [{ id: 1, nombre: "Gancho Dorado", precio: 8000, cantidad: 1 }],
    total: 45000,
    estado: "En camino",
    fecha: "10/02/2026",
    formaPago: "Crédito",
    repartidor: "Carlos"
  },
  {
    id: 2,
    cliente: "Laura Gómez",
    direccion: "Avenida Central 456",
    items: [{ id: 2, nombre: "Keratina Pro", precio: 45000, cantidad: 1 }],
    total: 30000,
    estado: "Pendiente",
    fecha: "10/02/2026",
    formaPago: "Efectivo",
    repartidor: null
  }
]);

  const crearPedido = (clienteCedula, clienteNombre, direccion, items, formaPago) => {
    const total = items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    

    const nuevoIdPedido =
  pedidos.length > 0
    ? Math.max(...pedidos.map((p) => p.id)) + 1
    : 1;

    const nuevoPedido = {
      id: nuevoIdPedido,
      cliente: clienteNombre,
      clienteCedula,
      direccion,
      items,
      total,
      estado: "Pendiente",
      fecha: new Date().toLocaleDateString(),
      formaPago,
      repartidor: null
    };


    // Descontar stock
    const productosActualizados = productos.map((p) => {
      const itemPedido = items.find((i) => i.id === p.id);
      if (itemPedido) {
        return { ...p, stock: p.stock - itemPedido.cantidad };
      }
      return p;
    });

    // Manejar cliente por cédula
    let clientesActualizados = [...clientes];
    let clienteExistente = clientesActualizados.find(
      (c) => c.cedula === clienteCedula
    );

    if (!clienteExistente) {
      // Crear nuevo cliente
      const nuevoClienteId = clientes.length > 0
        ? Math.max(...clientes.map((c) => c.id)) + 1
        : 1;

      clienteExistente = {
        id: nuevoClienteId,
        nombre: clienteNombre,
        cedula: clienteCedula,
        direccion,
        telefono: "",
        saldo: 0,
        transacciones: []
      };
      clientesActualizados.push(clienteExistente);
    } else {
      // Actualizar dirección si es diferente
      clienteExistente.direccion = direccion;
    }

    // Registrar transacción según forma de pago
    const transaccionId = clienteExistente.transacciones.length > 0
      ? Math.max(...clienteExistente.transacciones.map((t) => t.id)) + 1
      : 1;

    const nuevaTransaccion = {
      id: transaccionId,
      tipo: "pedido",
      monto: total,
      fecha: new Date().toLocaleDateString(),
      descripcion: `Pedido #${nuevoIdPedido} - ${formaPago}`,
      pedidoId: nuevoIdPedido
    };

    // Actualizar saldo según forma de pago
    if (formaPago === "Efectivo") {
      // No suma al saldo, es pago inmediato
    } else if (formaPago === "Crédito" || formaPago === "Abono") {
      clienteExistente.saldo += total;
    }

    clienteExistente.transacciones.push(nuevaTransaccion);
    clientesActualizados = clientesActualizados.map((c) =>
      c.id === clienteExistente.id ? clienteExistente : c
    );

    setProductos(productosActualizados);
    setClientes(clientesActualizados);
    setPedidos([...pedidos, nuevoPedido]);
  };

  const cambiarEstadoPedido = (id, estado) => {
    setPedidos(
      pedidos.map((p) =>
        p.id === id ? { ...p, estado } : p
      )
    );
  };

  const eliminarPedido = (id) => {
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return;

  // Restaurar stock
  const productosActualizados = productos.map((prod) => {
    const item = pedido.items.find((i) => i.id === prod.id);
    if (item) {
      return { ...prod, stock: prod.stock + item.cantidad };
    }
    return prod;
  });

  setProductos(productosActualizados);
  setPedidos(pedidos.filter((p) => p.id !== id));
};
const asignarRepartidor = (id, repartidorNombre) => {
  setPedidos(
    pedidos.map((p) =>
      p.id === id ? { ...p, repartidor: repartidorNombre } : p
    )
  );
};

const crearRepartidor = (nombre, zona) => {
  if (!nombre || !zona) return;

  const nuevoId =
    repartidores.length > 0
      ? Math.max(...repartidores.map((r) => r.id)) + 1
      : 1;

  const nuevoRepartidor = {
    id: nuevoId,
    nombre,
    zona,
    pedidosAsignados: 0
  };

  setRepartidores([...repartidores, nuevoRepartidor]);
};

const eliminarRepartidor = (id) => {
  // Limpiar asignaciones de este repartidor en los pedidos
  setPedidos(
    pedidos.map((p) => 
      p.repartidor && 
      repartidores.find((r) => r.id === id)?.nombre === p.repartidor 
        ? { ...p, repartidor: null }
        : p
    )
  );
  
  setRepartidores(repartidores.filter((r) => r.id !== id));
};

const registrarPago = (clienteId, monto, descripcion = "Pago") => {
  const clientesActualizados = clientes.map((c) => {
    if (c.id === clienteId && monto > 0) {
      const transaccionId = c.transacciones.length > 0
        ? Math.max(...c.transacciones.map((t) => t.id)) + 1
        : 1;

      return {
        ...c,
        saldo: c.saldo - monto,
        transacciones: [
          ...c.transacciones,
          {
            id: transaccionId,
            tipo: "pago",
            monto: monto,
            fecha: new Date().toLocaleDateString(),
            descripcion
          }
        ]
      };
    }
    return c;
  });

  setClientes(clientesActualizados);
};

const actualizarClienteTelefono = (clienteId, telefono) => {
  const clientesActualizados = clientes.map((c) =>
    c.id === clienteId ? { ...c, telefono } : c
  );
  setClientes(clientesActualizados);
};

const crearCliente = (nombre, cedula, direccion, telefono = "") => {
  if (!nombre || !cedula) {
    return { error: "Nombre y cédula son requeridos" };
  }

  // Verificar si la cédula ya existe
  const clienteExistente = clientes.find((c) => c.cedula === cedula);
  if (clienteExistente) {
    return { error: "Este cliente ya está registrado" };
  }

  const nuevoClienteId = clientes.length > 0
    ? Math.max(...clientes.map((c) => c.id)) + 1
    : 1;

  const nuevoCliente = {
    id: nuevoClienteId,
    nombre,
    cedula,
    direccion,
    telefono,
    saldo: 0,
    transacciones: []
  };

  setClientes([...clientes, nuevoCliente]);
  return { success: true, cliente: nuevoCliente };
};

const buscarClientePorCedula = (cedula) => {
  return clientes.find((c) => c.cedula === cedula) || null;
};

  return (
    <StoreContext.Provider
      value={{
        productos,
        setProductos,
        repartidores,
        crearRepartidor,
        eliminarRepartidor,
        clientes,
        crearCliente,
        buscarClientePorCedula,
        registrarPago,
        actualizarClienteTelefono,
        pedidos,
        crearPedido,
        cambiarEstadoPedido,
        eliminarPedido,
        asignarRepartidor
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

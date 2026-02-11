import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Gancho Dorado", categoria: "Ganchos", precio: 8000, stock: 10 },
    { id: 2, nombre: "Keratina Pro", categoria: "Tratamientos", precio: 45000, stock: 5 },
  ]);

  const [pedidos, setPedidos] = useState([
  {
    id: 1,
    cliente: "Ana Pérez",
    items: [],
    total: 45000,
    estado: "En camino",
    fecha: "10/02/2026",
    repartidor: "Carlos"
  },
  {
    id: 2,
    cliente: "Laura Gómez",
    items: [],
    total: 30000,
    estado: "Pendiente",
    fecha: "10/02/2026",
    repartidor: null
  }
]);

  const crearPedido = (cliente, items) => {
    const total = items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    

    const nuevoId =
  pedidos.length > 0
    ? Math.max(...pedidos.map((p) => p.id)) + 1
    : 1;

    const nuevoPedido = {
      id: nuevoId,
      cliente,
      items,
      total,
      estado: "Pendiente",
      fecha: new Date().toLocaleDateString(),
    };


    // Descontar stock
    const productosActualizados = productos.map((p) => {
      const itemPedido = items.find((i) => i.id === p.id);
      if (itemPedido) {
        return { ...p, stock: p.stock - itemPedido.cantidad };
      }
      return p;
    });

    setProductos(productosActualizados);
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
const asignarRepartidor = (id, repartidor) => {
  setPedidos(
    pedidos.map((p) =>
      p.id === id ? { ...p, repartidor } : p
    )
  );
};

  return (
    <StoreContext.Provider
      value={{
        productos,
        setProductos,
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

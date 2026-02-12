import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // ============================================
  // 📦 PRODUCTOS - Gestión de inventario
  // ============================================
  const [productos, setProductos] = useState([
    { 
      id: 1, 
      nombre: "Gancho Dorado", 
      categoria: "Ganchos para cabello", 
      precio: 8000, 
      stock: 10,
      descripcion: "Gancho para cabello de alta calidad, resistente y duradero. Ideal para diferentes tipos de cabello.",
      imagenes: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1594975519620-37eb173d6204?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1615996001375-cd0ecfef5d3a?w=500&h=500&fit=crop"
      ]
    },
    { 
      id: 2, 
      nombre: "Keratina Pro", 
      categoria: "Tratamientos", 
      precio: 45000, 
      stock: 5,
      descripcion: "Tratamiento de keratina profesional que fortalece y suaviza el cabello. Restaura la vitalidad natural.",
      imagenes: [
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1596462502278-af823e5b7a0e?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop"
      ]
    },
  ]);

  // ============================================
  // 📦 FUNCIONES - PRODUCTOS
  // ============================================

  /**
   * Crea un nuevo producto con su stock inicial
   * @param {string} nombre - Nombre del producto
   * @param {number} precio - Precio del producto
   * @param {string} categoria - Categoría del producto
   * @param {number} stock - Stock inicial (cantidad disponible)
   * @param {string} descripcion - Descripción del producto (opcional)
   * @param {array} imagenes - Array de URLs de imágenes (opcional)
   * @returns {object} El producto creado
   */
  const crearProducto = (nombre, precio, categoria, stock = 10, descripcion = "", imagenes = []) => {
    if (!nombre || !precio || !categoria) {
      return { error: "Nombre, precio y categoría son requeridos" };
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio: Number(precio),
      categoria,
      stock: Number(stock),
      descripcion,
      imagenes: imagenes.length > 0 ? imagenes : ["https://images.unsplash.com/photo-1522338242592-cb0acf6f85a2?w=500&h=500&fit=crop"]
    };

    setProductos([...productos, nuevoProducto]);
    return { success: true, producto: nuevoProducto };
  };

  /**
   * Actualiza el stock de un producto (suma o resta)
   * @param {number} productoId - ID del producto
   * @param {number} cantidad - Cantidad a sumar (positivo) o restar (negativo)
   * @returns {boolean} true si se actualizó exitosamente
   */
  const actualizarStock = (productoId, cantidad) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return false;

    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) return false; // No permitir negativos

    setProductos(
      productos.map((p) =>
        p.id === productoId ? { ...p, stock: nuevoStock } : p
      )
    );
    return true;
  };

  /**
   * Agota el stock de un producto (lo pone en 0)
   * @param {number} productoId - ID del producto a agotar
   * @returns {boolean} true si se completó exitosamente
   */
  const agotarProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return false;

    setProductos(
      productos.map((p) =>
        p.id === productoId ? { ...p, stock: 0 } : p
      )
    );
    return true;
  };

  // ============================================
  // 🚗 REPARTIDORES - Gestión de entregas
  // ============================================
  const [repartidores, setRepartidores] = useState([]);

  // ============================================
  // 👨‍💼 VENDEDORES - Gestión por zonas
  // ============================================
  const [vendedores, setVendedores] = useState([
    { id: 1, nombre: "Carlos Rodríguez", zona: "Norte", clientesIds: [1] },
    { id: 2, nombre: "María López", zona: "Sur", clientesIds: [2] },
    { id: 3, nombre: "Juan Martínez", zona: "Oriente", clientesIds: [] },
    { id: 4, nombre: "Sandra García", zona: "Occidente", clientesIds: [] }
  ]);

  // ============================================
  // 👥 CLIENTES - Datos de clientes y transacciones
  // ============================================
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: "Ana Pérez",
      cedula: "1234567890",
      direccion: "Calle Principal 123",
      telefono: "3001234567",
      correo: "ana.perez@email.com",
      vendedor_id: 1,
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
      correo: "laura.gomez@email.com",
      vendedor_id: 2,
      saldo: 0,
      transacciones: [
        { id: 1, tipo: "pedido", monto: 30000, fecha: "10/02/2026", descripcion: "Pedido #2 - Efectivo", pedidoId: 2 }
      ]
    }
  ]);

  // ============================================
  // 📋 PEDIDOS - Órdenes y seguimiento
  // ============================================
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

  // ============================================
  // 📋 FUNCIONES - PEDIDOS
  // ============================================
  
  /**
   * Crea un nuevo pedido
   * @param {string} clienteCedula - Cédula del cliente
   * @param {string} clienteNombre - Nombre del cliente
   * @param {string} direccion - Dirección de entrega
   * @param {array} items - Items del pedido [{id, nombre, precio, cantidad}]
   * @param {string} formaPago - Forma de pago: "Efectivo", "Crédito", "Abono"
   */
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

    // Descontar stock de productos
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
      // Crear nuevo cliente automáticamente
      const nuevoClienteId = clientes.length > 0
        ? Math.max(...clientes.map((c) => c.id)) + 1
        : 1;

      clienteExistente = {
        id: nuevoClienteId,
        nombre: clienteNombre,
        cedula: clienteCedula,
        direccion,
        telefono: "",
        correo: "",
        vendedor_id: null,
        saldo: 0,
        transacciones: []
      };
      clientesActualizados.push(clienteExistente);
    } else {
      // Actualizar dirección si es diferente
      clienteExistente.direccion = direccion;
    }

    // Registrar transacción
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

  /**
   * Cambia el estado de un pedido
   * @param {number} id - ID del pedido
   * @param {string} estado - Nuevo estado (Pendiente, En camino, Entregado, etc)
   */
  const cambiarEstadoPedido = (id, estado) => {
    setPedidos(
      pedidos.map((p) =>
        p.id === id ? { ...p, estado } : p
      )
    );
  };

  /**
   * Elimina un pedido y restaura el stock
   * @param {number} id - ID del pedido a eliminar
   */
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

  /**
   * Asigna un repartidor a un pedido
   * @param {number} id - ID del pedido
   * @param {string} repartidorNombre - Nombre del repartidor
   */
  const asignarRepartidor = (id, repartidorNombre) => {
    setPedidos(
      pedidos.map((p) =>
        p.id === id ? { ...p, repartidor: repartidorNombre } : p
      )
    );
  };

  // ============================================
  // 🚗 FUNCIONES - REPARTIDORES
  // ============================================

  /**
   * Crea un nuevo repartidor
   * @param {string} nombre - Nombre del repartidor
   * @param {string} zona - Zona de cobertura
   */
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

  /**
   * Elimina un repartidor y limpia sus asignaciones
   * @param {number} id - ID del repartidor a eliminar
   */
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

  // ============================================
  // 👥 FUNCIONES - CLIENTES
  // ============================================

  /**
   * Crea un nuevo cliente
   * @param {string} nombre - Nombre del cliente
   * @param {string} cedula - Cédula o NIT del cliente
   * @param {string} direccion - Dirección del cliente
   * @param {string} telefono - Teléfono (opcional)
   * @param {string} correo - Correo electrónico (opcional)
   * @param {number} vendedor_id - ID del vendedor asignado (opcional)
   * @returns {object} Resultado {success: true, cliente} o {error: mensaje}
   */
  const crearCliente = (nombre, cedula, direccion, telefono = "", correo = "", vendedor_id = null) => {
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
      correo,
      vendedor_id,
      saldo: 0,
      transacciones: []
    };

    setClientes([...clientes, nuevoCliente]);

    // Asignar cliente a vendedor si se proporciona
    if (vendedor_id) {
      const vendedoresActualizados = vendedores.map((v) =>
        v.id === vendedor_id
          ? { ...v, clientesIds: [...v.clientesIds, nuevoClienteId] }
          : v
      );
      setVendedores(vendedoresActualizados);
    }

    return { success: true, cliente: nuevoCliente };
  };

  /**
   * Busca un cliente por su cédula
   * @param {string} cedula - Cédula del cliente
   * @returns {object|null} Cliente encontrado o null
   */
  const buscarClientePorCedula = (cedula) => {
    return clientes.find((c) => c.cedula === cedula) || null;
  };

  /**
   * Registra un pago para un cliente
   * @param {number} clienteId - ID del cliente
   * @param {number} monto - Monto a pagar
   * @param {string} descripcion - Descripción del pago
   */
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

  /**
   * Actualiza el teléfono de un cliente
   * @param {number} clienteId - ID del cliente
   * @param {string} telefono - Nuevo teléfono
   */
  const actualizarClienteTelefono = (clienteId, telefono) => {
    const clientesActualizados = clientes.map((c) =>
      c.id === clienteId ? { ...c, telefono } : c
    );
    setClientes(clientesActualizados);
  };

  // ============================================
  // 👨‍💼 FUNCIONES - VENDEDORES
  // ============================================

  /**
   * Asigna un cliente a un vendedor
   * @param {number} clienteId - ID del cliente
   * @param {number} vendedorId - ID del vendedor
   */
  const asignarClienteAVendedor = (clienteId, vendedorId) => {
    // Actualizar cliente
    const clientesActualizados = clientes.map((c) =>
      c.id === clienteId ? { ...c, vendedor_id: vendedorId } : c
    );

    // Actualizar vendedores
    const vendedoresActualizados = vendedores.map((v) => {
      // Remover cliente de su vendedor anterior
      if (v.clientesIds.includes(clienteId)) {
        return { ...v, clientesIds: v.clientesIds.filter((id) => id !== clienteId) };
      }
      // Agregar cliente al nuevo vendedor
      if (v.id === vendedorId) {
        return { ...v, clientesIds: [...v.clientesIds, clienteId] };
      }
      return v;
    });

    setClientes(clientesActualizados);
    setVendedores(vendedoresActualizados);
  };

  /**
   * Obtiene todos los clientes de un vendedor
   * @param {number} vendedorId - ID del vendedor
   * @returns {array} Array de clientes del vendedor
   */
  const obtenerClientesPorVendedor = (vendedorId) => {
    const vendedor = vendedores.find((v) => v.id === vendedorId);
    if (!vendedor) return [];
    return clientes.filter((c) => vendedor.clientesIds.includes(c.id));
  };

  /**
   * Calcula el total de ventas de un vendedor
   * @param {number} vendedorId - ID del vendedor
   * @returns {number} Total de ventas en pesos
   */
  const calcularVentasPorVendedor = (vendedorId) => {
    const clientesVendedor = obtenerClientesPorVendedor(vendedorId);
    return clientesVendedor.reduce((totalVentas, cliente) => {
      const ventasCliente = cliente.transacciones
        .filter((t) => t.tipo === "pedido")
        .reduce((sum, t) => sum + t.monto, 0);
      return totalVentas + ventasCliente;
    }, 0);
  };


  // ============================================
  // 🔌 PROVIDER - Exportar contexto
  // ============================================
  return (
    <StoreContext.Provider
      value={{
        // 📦 Productos
        productos,
        setProductos,
        crearProducto,
        actualizarStock,
        agotarProducto,

        // 🚗 Repartidores
        repartidores,
        crearRepartidor,
        eliminarRepartidor,

        // 👨‍💼 Vendedores
        vendedores,
        asignarClienteAVendedor,
        obtenerClientesPorVendedor,
        calcularVentasPorVendedor,

        // 👥 Clientes
        clientes,
        crearCliente,
        buscarClientePorCedula,
        registrarPago,
        actualizarClienteTelefono,

        // 📋 Pedidos
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

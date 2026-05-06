//Obtener productos
const obtenerProductos = async () => {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (!error) setProductos(data);
};

// Actualizar stok
const actualizarStock = async (id, cantidad) => {
  const { data: producto } = await supabase
    .from("productos")
    .select("stock")
    .eq("id", id)
    .single();

  const nuevoStock = producto.stock + cantidad;

  if (nuevoStock < 0) return false;

  const { error } = await supabase
    .from("productos")
    .update({ stock: nuevoStock })
    .eq("id", id);

  if (error) return false;

  // actualizar estado local
  setProductos((prev) =>
    prev.map((p) =>
      p.id === id ? { ...p, stock: nuevoStock } : p
    )
  );

  return true;
};

//Crear pedido
const crearPedido = async (cedula, nombre, direccion, carrito, formaPago) => {
  const { error } = await supabase
    .from("pedidos")
    .insert([
      {
        cedula,
        nombre,
        direccion,
        productos: carrito,
        forma_pago: formaPago
      }
    ]);

  return !error;
};

// Clientes
const obtenerClientes = async () => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*");

  if (!error) setClientes(data);
};
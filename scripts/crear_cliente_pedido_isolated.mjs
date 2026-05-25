import { supabase } from '../neosapp/src/context/supabaseClient.js';

const DEFAULTS = {
  password: 'Test1234!',
  formaPago: 'Efectivo',
  estadoPedido: 'Pendiente',
  cantidad: 1,
};

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith('--')) continue;

    const key = current.slice(2);
    const value = argv[i + 1];

    if (value && !value.startsWith('--')) {
      args[key] = value;
      i += 1;
    } else {
      args[key] = true;
    }
  }

  return args;
}

function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

function formatError(error) {
  if (!error) return 'Error desconocido';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return JSON.stringify(error);
}

async function getExistingClienteById(clienteId) {
  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre, cedula, direccion, telefono, correo, usuario_id')
    .eq('id', clienteId)
    .maybeSingle();

  if (error) {
    throw new Error(`Error consultando cliente ${clienteId}: ${formatError(error)}`);
  }

  if (!data) {
    throw new Error(`No existe cliente con id ${clienteId} en la tabla clientes`);
  }

  return data;
}

async function getOrCreateUserForCliente({ nombre, cedula, email, password }) {
  const { data: usuarioExistenteEmail, error: errorUsuarioExistenteEmail } = await supabase
    .from('usuarios')
    .select('id, email, cedula, rol')
    .eq('email', email)
    .maybeSingle();

  if (errorUsuarioExistenteEmail) {
    throw new Error(`Error buscando usuario por email: ${formatError(errorUsuarioExistenteEmail)}`);
  }

  const { data: usuarioExistenteCedula, error: errorUsuarioExistenteCedula } = await supabase
    .from('usuarios')
    .select('id, email, cedula, rol')
    .eq('cedula', cedula)
    .maybeSingle();

  if (errorUsuarioExistenteCedula) {
    throw new Error(`Error buscando usuario por cédula: ${formatError(errorUsuarioExistenteCedula)}`);
  }

  if (usuarioExistenteEmail || usuarioExistenteCedula) {
    const userId = usuarioExistenteEmail?.id || usuarioExistenteCedula?.id;
    return { userId, created: false, usuario: usuarioExistenteEmail || usuarioExistenteCedula };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(`Error creando usuario en Auth: ${formatError(authError)}`);
  }

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error('No se pudo obtener el ID del usuario creado en Auth');
  }

  const { data: usuarioInsertado, error: errorUsuario } = await supabase
    .from('usuarios')
    .insert([{ id: userId, nombre, cedula, email, rol: 'cliente' }])
    .select('id, email, cedula, rol')
    .single();

  if (errorUsuario) {
    throw new Error(`Error insertando usuario en tabla usuarios: ${formatError(errorUsuario)}`);
  }

  return { userId, created: true, usuario: usuarioInsertado };
}

async function crearClienteNuevo({ nombre, cedula, direccion, telefono, email, password }) {
  logSection('Crear cliente');

  const { userId, created } = await getOrCreateUserForCliente({
    nombre,
    cedula,
    email,
    password,
  });

  const clienteInsertPayload = {
    usuario_id: userId,
    nombre,
    cedula,
    direccion,
    telefono,
    correo: email,
  };

  const { data: clienteCreado, error: errorCliente } = await supabase
    .from('clientes')
    .insert([clienteInsertPayload])
    .select('id, nombre, cedula, direccion, telefono, correo, usuario_id')
    .single();

  if (errorCliente) {
    throw new Error(`Error insertando cliente en tabla clientes: ${formatError(errorCliente)}`);
  }

  console.log('Cliente creado / confirmado:');
  console.log(JSON.stringify({
    usuarioCreado: created,
    usuarioId,
    cliente: clienteCreado,
  }, null, 2));

  return clienteCreado;
}

async function getProductoParaPedido(productoId) {
  if (productoId) {
    const { data, error } = await supabase
      .from('productos')
      .select('id, nombre, precio, stock')
      .eq('id', productoId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error consultando producto ${productoId}: ${formatError(error)}`);
    }

    if (!data) {
      throw new Error(`No existe producto con id ${productoId} en la tabla productos`);
    }

    return data;
  }

  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, stock')
    .limit(1);

  if (error) {
    throw new Error(`Error consultando productos disponibles: ${formatError(error)}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No hay productos disponibles para crear el pedido');
  }

  return data[0];
}

async function crearPedidoParaCliente({ clienteId, formaPago, estadoPedido, productoId, cantidad, precioOverride }) {
  logSection('Crear pedido');

  const cliente = await getExistingClienteById(clienteId);
  const producto = await getProductoParaPedido(productoId);

  const cantidadFinal = Number(cantidad || DEFAULTS.cantidad);
  const precioFinal = Number(precioOverride ?? producto.precio ?? 0);
  const total = precioFinal * cantidadFinal;

  const pedidoPayload = {
    cliente_id: cliente.id,
    cedula: cliente.cedula,
    nombre: cliente.nombre,
    direccion: cliente.direccion,
    forma_pago: formaPago,
    estado: estadoPedido,
    total,
  };

  console.log('Payload del pedido que se insertará en pedidos:');
  console.log(JSON.stringify(pedidoPayload, null, 2));

  const { data: pedidoCreado, error: errorPedido } = await supabase
    .from('pedidos')
    .insert([pedidoPayload])
    .select('id, cliente_id, cedula, nombre, direccion, forma_pago, estado, total')
    .single();

  if (errorPedido) {
    throw new Error(`Error insertando pedido en tabla pedidos: ${formatError(errorPedido)}`);
  }

  const detallePayload = {
    pedido_id: pedidoCreado.id,
    producto_id: producto.id,
    cantidad: cantidadFinal,
    precio: precioFinal,
  };

  console.log('Payload del detalle que se insertará en pedido_detalle:');
  console.log(JSON.stringify(detallePayload, null, 2));

  const { data: detalleCreado, error: errorDetalle } = await supabase
    .from('pedido_detalle')
    .insert([detallePayload]);

  if (errorDetalle) {
    throw new Error(`Error insertando detalle en tabla pedido_detalle: ${formatError(errorDetalle)}`);
  }

  console.log('Pedido creado / confirmado:');
  console.log(JSON.stringify({ pedido: pedidoCreado, detalle: detalleCreado }, null, 2));

  return { pedido: pedidoCreado, detalle: detalleCreado };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(`
Uso:
  node scripts/crear_cliente_pedido_isolated.mjs --nombre="Cliente Demo" --cedula="123456789" --direccion="Calle 123" --telefono="3000000000" --email="demo@example.com" --password="123456" --forma-pago="Efectivo" --producto-id=1 --cantidad=1

Opcional:
  --cliente-id=22   Usa un cliente ya existente en la tabla clientes
  --precio=10000     Precio manual para el pedido
  --estado-pedido="Pendiente"
`);
    return;
  }

  const timestamp = Date.now();
  const nombre = args.nombre || `Cliente aislado ${timestamp}`;
  const cedula = args.cedula || `ISO-${timestamp}`;
  const direccion = args.direccion || 'Dirección aislada';
  const telefono = args.telefono || '3000000000';
  const email = args.email || `aislado_${timestamp}@example.com`;
  const password = args.password || DEFAULTS.password;
  const formaPago = args['forma-pago'] || args.formaPago || DEFAULTS.formaPago;
  const estadoPedido = args['estado-pedido'] || args.estadoPedido || DEFAULTS.estadoPedido;
  const cantidad = args.cantidad || DEFAULTS.cantidad;
  const precioOverride = args.precio ? Number(args.precio) : undefined;
  const productoId = args['producto-id'] || args.productoId || undefined;

  let cliente;

  if (args['cliente-id'] || args.clienteId) {
    cliente = await getExistingClienteById(Number(args['cliente-id'] || args.clienteId));
  } else {
    cliente = await crearClienteNuevo({
      nombre,
      cedula,
      direccion,
      telefono,
      email,
      password,
    });
  }

  await crearPedidoParaCliente({
    clienteId: cliente.id,
    formaPago,
    estadoPedido,
    productoId,
    cantidad,
    precioOverride,
  });
}

run().catch((error) => {
  console.error('\nError en la ejecución del script aislado:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

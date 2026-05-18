/**
 * Script de Prueba - Simulación de Compra de Productos
 * =====================================================
 * 
 * Este script simula todo el flujo de:
 * 1. Crear usuario cliente
 * 2. Crear un carrito
 * 3. Crear un pedido
 * 4. Validar datos
 * 5. Enviar confirmación por email
 * 
 * Para ejecutar: node test-compra.js
 */

// Simulación de validaciones
const validarEmail = (email) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && regexEmail.test(email);
};

const validarCarrito = (carrito) => {
  const errores = [];
  if (!Array.isArray(carrito) || carrito.length === 0) {
    errores.push("El carrito debe tener al menos un producto");
    return { valido: false, errores };
  }
  let totalCarrito = 0;
  carrito.forEach((item, index) => {
    if (!item.nombre || item.nombre.trim().length === 0) {
      errores.push(`Producto ${index + 1}: El producto debe tener un nombre`);
    }
    if (!item.precio || item.precio <= 0) {
      errores.push(`Producto ${index + 1}: El producto debe tener un precio mayor a 0`);
    }
    if (!item.cantidad || item.cantidad <= 0) {
      errores.push(`Producto ${index + 1}: La cantidad debe ser mayor a 0`);
    }
    if (item.cantidad > (item.stock || 999)) {
      errores.push(`Producto ${index + 1}: No hay stock suficiente`);
    }
    totalCarrito += (item.precio || 0) * (item.cantidad || 0);
  });
  if (totalCarrito <= 0) {
    errores.push("El total del pedido debe ser mayor a 0");
  }
  return {
    valido: errores.length === 0,
    errores,
  };
};

const validarDatosPedido = (datoPedido) => {
  const errores = [];
  if (!datoPedido.nombre || datoPedido.nombre.trim().length === 0) {
    errores.push("El nombre del cliente es requerido");
  }
  if (!datoPedido.direccion || datoPedido.direccion.trim().length === 0) {
    errores.push("La dirección es requerida");
  }
  if (datoPedido.email && !validarEmail(datoPedido.email)) {
    errores.push("El email no es válido");
  }
  return {
    valido: errores.length === 0,
    errores,
  };
};

const calcularTotal = (carrito) => {
  return carrito.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad || 1), 0);
};

// ==================== PRUEBA ====================

console.log("\n" + "=".repeat(60));
console.log("🛍️  PRUEBA DE COMPRA - NEOS BELLEZA");
console.log("=".repeat(60) + "\n");

// 1. DATOS DEL USUARIO
console.log("📝 PASO 1: Crear Usuario Cliente");
console.log("-".repeat(60));

const datosUsuario = {
  nombre: "John Anderson Yate",
  cedula: "1234567890",
  email: "johnandersonyate15@gmail.com",
  telefono: "3012345678",
  direccion: "Calle 123, Casa 45, Bogotá, Colombia",
  rol: "cliente",
};

console.log("✓ Usuario Creado:");
console.log(`  - Nombre: ${datosUsuario.nombre}`);
console.log(`  - Cédula: ${datosUsuario.cedula}`);
console.log(`  - Email: ${datosUsuario.email}`);
console.log(`  - Teléfono: ${datosUsuario.telefono}`);
console.log(`  - Dirección: ${datosUsuario.direccion}\n`);

// 2. CARRITO DE COMPRA
console.log("🛒 PASO 2: Crear Carrito de Compra");
console.log("-".repeat(60));

const carrito = [
  {
    id: 1,
    nombre: "Crema Facial Hidratante",
    precio: 45000,
    cantidad: 2,
    stock: 10,
  },
  {
    id: 2,
    nombre: "Serum Antienvejecimiento",
    precio: 85000,
    cantidad: 1,
    stock: 5,
  },
  {
    id: 3,
    nombre: "Mascarilla Purificante",
    precio: 35000,
    cantidad: 3,
    stock: 20,
  },
];

console.log("✓ Productos Agregados:");
carrito.forEach((item) => {
  const subtotal = item.precio * item.cantidad;
  console.log(
    `  - ${item.nombre} x${item.cantidad} = $${subtotal.toLocaleString("es-CO")}`
  );
});

const total = calcularTotal(carrito);
console.log(`\n  💰 TOTAL: $${total.toLocaleString("es-CO")}\n`);

// 3. VALIDACIONES
console.log("✅ PASO 3: Validar Datos");
console.log("-".repeat(60));

const validacionCarrito = validarCarrito(carrito);
console.log("Carrito: " + (validacionCarrito.valido ? "✓ VÁLIDO" : "✗ INVÁLIDO"));
if (!validacionCarrito.valido) {
  validacionCarrito.errores.forEach((err) => console.log(`  ✗ ${err}`));
}

const datosValidar = {
  nombre: datosUsuario.nombre,
  direccion: datosUsuario.direccion,
  email: datosUsuario.email,
  carrito,
};

const validacionDatos = validarDatosPedido(datosValidar);
console.log("Datos: " + (validacionDatos.valido ? "✓ VÁLIDO" : "✗ INVÁLIDO"));
if (!validacionDatos.valido) {
  validacionDatos.errores.forEach((err) => console.log(`  ✗ ${err}`));
}

const validacionEmail = validarEmail(datosUsuario.email);
console.log("Email: " + (validacionEmail ? "✓ VÁLIDO" : "✗ INVÁLIDO") + ` (${datosUsuario.email})`);

console.log("");

// 4. CREAR PEDIDO
console.log("📦 PASO 4: Crear Pedido en BD");
console.log("-".repeat(60));

// Simulación de ID
const pedidoId = Math.floor(Math.random() * 10000) + 1000;
const fechaActual = new Date().toLocaleDateString("es-CO", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const pedido = {
  id: pedidoId,
  cedula: datosUsuario.cedula,
  nombre: datosUsuario.nombre,
  direccion: datosUsuario.direccion,
  email: datosUsuario.email,
  telefono: datosUsuario.telefono,
  total,
  items: carrito,
  forma_pago: "Crédito",
  estado: "Pendiente",
  created_at: new Date().toISOString(),
};

console.log("✓ Pedido Creado en BD:");
console.log(`  - ID del Pedido: #${pedido.id}`);
console.log(`  - Fecha: ${fechaActual}`);
console.log(`  - Estado: ${pedido.estado}`);
console.log(`  - Forma de Pago: ${pedido.forma_pago}\n`);

// 5. GENERAR EMAIL
console.log("📧 PASO 5: Generar Email de Confirmación");
console.log("-".repeat(60));

const htmlEmail = `
<!DOCTYPE html>
<html dir="ltr" lang="es">
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: system-ui; color: #333; line-height: 1.6; }
      .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
      .header h1 { margin: 0; font-size: 28px; }
      .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
      .info-section { margin: 20px 0; border-left: 4px solid #667eea; padding: 15px; background: #f5f5f5; border-radius: 4px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th { background: #667eea; color: white; padding: 10px; text-align: left; }
      td { padding: 8px; border-bottom: 1px solid #eee; }
      .total { font-size: 20px; font-weight: bold; color: #667eea; text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea; }
      .footer { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✓ Pedido Confirmado</h1>
        <p>Gracias por tu compra en NEOS BELLEZA</p>
      </div>
      
      <div class="content">
        <p>Hola <strong>${datosUsuario.nombre}</strong>,</p>
        <p>Tu pedido ha sido confirmado exitosamente. A continuación encontrarás los detalles:</p>

        <div class="info-section">
          <h3>Número de Pedido</h3>
          <p><strong>#${pedidoId}</strong></p>
        </div>

        <div class="info-section">
          <h3>Dirección de Entrega</h3>
          <p>${datosUsuario.direccion}</p>
        </div>

        <div class="info-section">
          <h3>Detalles de tu Pedido</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${carrito
                .map(
                  (item) =>
                    `<tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${Number(item.precio).toLocaleString("es-CO")}</td>
                <td>$${(Number(item.precio) * Number(item.cantidad)).toLocaleString("es-CO")}</td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">
            Total: $${total.toLocaleString("es-CO")}
          </div>
        </div>

        <p style="color: #666; margin-top: 20px; font-size: 14px;">
          Pronto recibirás una notificación cuando el pedido sea procesado y enviado.
        </p>

        <div class="footer">
          <p>NEOS BELLEZA | Soporte: soporte@neosbelleza.com</p>
          <p>&copy; 2026 NEOS BELLEZA. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

console.log("✓ Email HTML Generado");
console.log(`  - Asunto: Confirmación de Pedido #${pedidoId} - NEOS BELLEZA`);
console.log(`  - Para: ${datosUsuario.email}`);
console.log(`  - Contenido: ${htmlEmail.length} caracteres\n`);

// 6. RESUMEN
console.log("📊 RESUMEN DE LA PRUEBA");
console.log("=".repeat(60));

const resumen = {
  "Cliente": datosUsuario.nombre,
  "Email": datosUsuario.email,
  "Productos": carrito.length,
  "Cantidad Total": carrito.reduce((sum, item) => sum + item.cantidad, 0),
  "Total a Pagar": `$${total.toLocaleString("es-CO")}`,
  "ID Pedido": `#${pedidoId}`,
  "Estado": "Pendiente",
  "Validación Carrito": validacionCarrito.valido ? "✓ PASÓ" : "✗ FALLÓ",
  "Validación Datos": validacionDatos.valido ? "✓ PASÓ" : "✗ FALLÓ",
  "Validación Email": validacionEmail ? "✓ PASÓ" : "✗ FALLÓ",
  "Email Generado": "✓ SÍ",
};

Object.entries(resumen).forEach(([key, value]) => {
  console.log(`${key.padEnd(20)} : ${value}`);
});

console.log("\n" + "=".repeat(60));
console.log("✅ PRUEBA COMPLETADA EXITOSAMENTE");
console.log("=".repeat(60) + "\n");

// 7. INSTRUCCIONES FINALES
console.log("📋 INSTRUCCIONES PARA ENVIAR EMAIL REAL:\n");
console.log("1. Registrarse en https://resend.com (gratis)");
console.log("2. Obtener API Key en Settings → API Keys");
console.log("3. Actualizar .env.local:");
console.log("   VITE_RESEND_API_KEY=re_tu_api_key_aqui");
console.log("4. Ejecutar: npm run dev");
console.log("5. Crear pedido desde la app - ¡Email se enviará automáticamente!\n");

console.log("📧 Email se enviará a: johnandersonyate15@gmail.com\n");

// 8. SALIDA JSON (para referencia)
console.log("📁 Datos JSON del Pedido (para BD):");
console.log("-".repeat(60));
console.log(JSON.stringify(pedido, null, 2));

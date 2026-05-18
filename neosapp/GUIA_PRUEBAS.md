# 🧪 GUÍA DE PRUEBAS - Confirmación de Pedidos

## Requisitos Previos
- [ ] `VITE_RESEND_API_KEY` configurada en `.env.local`
- [ ] Base de datos con datos de prueba
- [ ] Cliente logueado como vendedor
- [ ] Cliente con email asignado en BD

## 📋 Suite de Pruebas

### PRUEBA 1: Crear Pedido Exitoso ✅
**Objetivo**: Verificar flujo completo de creación y email

**Pasos**:
1. Iniciar sesión como vendedor
2. Ir a "Mi Cartera de Clientes"
3. Seleccionar un cliente que tenga email
4. Hacer clic en "Crear Pedido"
5. Verificar que aparezcan campos de email y teléfono
6. Email debe estar pre-llenado con `cliente.correo`
7. Agregar al menos 1 producto
8. Seleccionar forma de pago
9. Hacer clic en "Confirmar Pedido"

**Resultados Esperados**:
- [ ] Botón se deshabilita mientras procesa
- [ ] Mensaje "✓ Pedido creado correctamente y confirmación enviada"
- [ ] Pedido aparece en historial del cliente
- [ ] Email recibido en bandeja del cliente

**Email debe contener**:
- [ ] Número de pedido (#xxx)
- [ ] Nombre del cliente
- [ ] Lista de productos con cantidades
- [ ] Total calculado correctamente
- [ ] Dirección de entrega
- [ ] Forma de pago
- [ ] Diseño profesional

---

### PRUEBA 2: Validación - Email Inválido ❌
**Objetivo**: Verificar que rechaza email inválido

**Pasos**:
1. Seleccionar un cliente
2. Agregar productos
3. Cambiar email a valor inválido: "notanemail"
4. Hacer clic en "Confirmar Pedido"

**Resultados Esperados**:
- [ ] No se crea el pedido
- [ ] Aparece mensaje de error: "El email no es válido"
- [ ] Carrito se mantiene con productos

---

### PRUEBA 3: Validación - Carrito Vacío ❌
**Objetivo**: Verificar que rechaza pedido sin productos

**Pasos**:
1. Seleccionar un cliente
2. Dejar carrito vacío
3. Hacer clic en "Confirmar Pedido"

**Resultados Esperados**:
- [ ] Aparece mensaje: "El carrito debe tener al menos un producto"
- [ ] No se crea el pedido

---

### PRUEBA 4: Validación - Stock Insuficiente ❌
**Objetivo**: Verificar control de stock

**Pasos**:
1. Seleccionar un cliente
2. Agregar producto con cantidad mayor al stock disponible
3. Por ejemplo: producto tiene 5 de stock, agregar cantidad 10
4. Hacer clic en "Confirmar Pedido"

**Resultados Esperados**:
- [ ] Aparece error: "No hay stock suficiente para [Producto]"
- [ ] Pedido no se crea
- [ ] Stock original se mantiene

---

### PRUEBA 5: Validación - Cantidad 0 ❌
**Objetivo**: Verificar cantidad válida

**Pasos**:
1. Seleccionar cliente
2. Agregar producto
3. Cambiar cantidad a 0
4. Intentar hacer clic en "Confirmar Pedido"

**Resultados Esperados**:
- [ ] El producto se elimina automáticamente
- [ ] O aparece error: "La cantidad debe ser mayor a 0"

---

### PRUEBA 6: Edición de Email ✏️
**Objetivo**: Verificar que se puede cambiar email antes de confirmar

**Pasos**:
1. Seleccionar cliente
2. Cambiar email en el campo
3. Agregar productos
4. Confirmar pedido

**Resultados Esperados**:
- [ ] Email se envía al nuevo email (no al original del cliente)
- [ ] Confirmación exitosa

---

### PRUEBA 7: Múltiples Productos 🛒
**Objetivo**: Verificar pedido con múltiples items

**Pasos**:
1. Seleccionar cliente
2. Agregar 3+ productos diferentes
3. Diferentes cantidades: 1, 5, 10
4. Confirmar pedido

**Resultados Esperados**:
- [ ] Email muestra todos los productos
- [ ] Total se calcula correctamente
- [ ] Cantidades son precisas
- [ ] Stock se actualiza para todos

---

### PRUEBA 8: Cambio de Cantidad en Carrito ⚡
**Objetivo**: Verificar edición de cantidades

**Pasos**:
1. Agregar producto (cantidad 1)
2. Cambiar cantidad en tabla a 5
3. Cambiar nuevamente a 3
4. Verificar que total se actualiza
5. Confirmar pedido

**Resultados Esperados**:
- [ ] Total se recalcula en tiempo real
- [ ] Cantidad correcta en email
- [ ] Email muestra cantidad final (3)

---

### PRUEBA 9: Eliminación de Item ✕
**Objetivo**: Verificar que se puede quitar productos

**Pasos**:
1. Agregar 2 productos
2. Hacer clic en botón "✕" para eliminar uno
3. Verificar que solo queda 1 producto
4. Confirmar pedido

**Resultados Esperados**:
- [ ] Producto se elimina del carrito
- [ ] Total se recalcula
- [ ] Email solo muestra producto que quedó

---

### PRUEBA 10: Manejo de Errores de BD ⚠️
**Objetivo**: Verificar que se maneja error si BD falla

**Pasos**:
1. Desconectar internet (simular error)
2. Intentar crear pedido
3. Restaurar conexión

**Resultados Esperados**:
- [ ] Mensaje de error descriptivo
- [ ] No se crea pedido incompleto
- [ ] Usuario puede intentar nuevamente

---

### PRUEBA 11: Validación de Cédula 📝
**Objetivo**: Verificar que cédula es requerida

**Pasos**:
1. Intentar crear cliente sin cédula (si es posible)
2. Seleccionar cliente
3. Confirmar pedido

**Resultados Esperados**:
- [ ] Sistema valida cédula
- [ ] No permite pedidos sin cédula

---

### PRUEBA 12: Validación de Dirección 📍
**Objetivo**: Verificar que dirección es requerida

**Pasos**:
1. Si cliente no tiene dirección asignada
2. Completar datos e intentar confirmar

**Resultados Esperados**:
- [ ] Aparece error: "La dirección es requerida"
- [ ] Pedido no se crea

---

## 📊 Matriz de Pruebas Rápida

| # | Escenario | Entrada | Resultado Esperado | ✓/✗ |
|---|-----------|---------|-------------------|-----|
| 1 | Pedido válido | Email, 2+ items | Crear + Email | |
| 2 | Email inválido | "notanemail" | Error validación | |
| 3 | Sin productos | Carrito vacío | Error carrito | |
| 4 | Stock insuficiente | Qty > stock | Error stock | |
| 5 | Cantidad cero | 0 items | Error cantidad | |
| 6 | Email modificado | Email diferente | Enviar a nuevo | |
| 7 | Múltiples items | 3+ productos | Todos en email | |
| 8 | Cambiar cantidad | 1→5→3 | Total correcto | |
| 9 | Eliminar item | Quitar producto | Recalcular | |
| 10 | Error BD | Simular desconexión | Mensaje error | |

---

## 🔍 Verificación del Email

### Contenido a verificar en el email recibido:

```
✓ Encabezado: "✓ Pedido Confirmado"
✓ Saludo personalizado: "Hola [NOMBRE],"
✓ Número de pedido: "#123"
✓ Tabla de productos:
  - Nombres correctos
  - Cantidades correctas
  - Precios unitarios correctos
  - Subtotales correctos
✓ Total final: "$XXX.XXX"
✓ Dirección de entrega: Correcta
✓ Método de pago: Correcto
✓ Diseño profesional y responsive
✓ Footer con info de contacto
✓ Link de respuesta: soporte@neosbelleza.com
```

---

## 📝 Notas para Pruebas

1. **Usar datos reales**: Probar con clientes que tienen email real
2. **Revisar spam**: Si no ves el email, revisar carpeta de spam
3. **Logs**: Ver console del navegador (F12) para ver detalles
4. **BD**: Verificar que se crea en tabla `pedidos` y `pedido_detalle`
5. **Stock**: Confirmar que se actualiza en tabla `productos`

---

## 🚀 Automatización Futura

Cuando esté en producción, considerar:
- [ ] Tests unitarios para validaciones
- [ ] Tests e2e para flujo completo
- [ ] Pruebas de carga
- [ ] Monitoreo de email delivery
- [ ] Alertas si email falla

---

**Última revisión**: Mayo 18, 2026
**Estado**: Listo para pruebas

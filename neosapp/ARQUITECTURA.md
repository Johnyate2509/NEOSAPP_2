# 🏗️ ARQUITECTURA DEL SISTEMA - Confirmación de Pedidos

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    VENDEDOR DASHBOARD                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. Seleccionar Cliente                                  │   │
│  │  2. Ingresar Email y Teléfono                            │   │
│  │  3. Agregar Productos al Carrito                         │   │
│  │  4. Seleccionar Forma de Pago                            │   │
│  │  5. Confirmar Pedido                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDACIONES                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  validarEmail()              validarCarrito()            │   │
│  │  validarTelefono()           validarItemPedido()         │   │
│  │  validarCedula()             validarDatosPedido()        │   │
│  │  calcularTotal()                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           src/utils/validaciones.js              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      ✓ Todas válidas ✓
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STORE CONTEXT                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  crearPedido(                                            │   │
│  │    cedula, nombre, direccion, carrito,                  │   │
│  │    formaPago, emailCliente, telefonoCliente             │   │
│  │  )                                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                  src/context/StoreContext.jsx                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┬─────────────────────┐
        ↓                     ↓                     ↓
   ┌─────────┐          ┌──────────┐         ┌──────────┐
   │ SUPABASE│          │ SUPABASE │         │ SUPABASE │
   │ pedidos │          │pedido_   │         │productos │
   │         │          │detalle   │         │          │
   │ CREATE  │          │ CREATE   │         │ UPDATE   │
   │ INSERT  │          │ INSERT   │         │ stock    │
   └─────────┘          └──────────┘         └──────────┘
        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL SERVICE                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  enviarConfirmacionPedido({                              │   │
│  │    pedidoId, cliente, email, telefono,                  │   │
│  │    items, total, formaPago, direccion                   │   │
│  │  })                                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                  src/services/emailService.js                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RESEND API                                    │
│  POST https://api.resend.com/emails                             │
│  Header: Authorization: Bearer VITE_RESEND_API_KEY             │
│  Body: {                                                        │
│    from: VITE_EMAIL_FROM,                                       │
│    to: email,                                                   │
│    subject: "Confirmación de Pedido #xxxxx",                   │
│    html: "<HTML_PROFESIONAL>"                                  │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTE EMAIL                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Asunto: Confirmación de Pedido #12345                  │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ ✓ Pedido Confirmado                              │    │   │
│  │  │ Gracias por tu compra en NEOS BELLEZA           │    │   │
│  │  │                                                  │    │   │
│  │  │ Número de Pedido: #12345                         │    │   │
│  │  │ Dirección: Calle 123                             │    │   │
│  │  │                                                  │    │   │
│  │  │ Productos:                                       │    │   │
│  │  │ - Producto 1  x2  $100.000                       │    │   │
│  │  │ - Producto 2  x1  $50.000                        │    │   │
│  │  │                                                  │    │   │
│  │  │ Total: $150.000                                  │    │   │
│  │  │ Método de Pago: Crédito                          │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

```
Usuario Frontend                    Backend/BD                  Externo
     │                                  │                           │
     │─── 1. Selecciona Cliente ───────→│                           │
     │                                  │                           │
     │─── 2. Completa Email/Teléfono ──→│ (estado local)            │
     │                                  │                           │
     │─── 3. Agrega Productos ─────────→│ (estado local)            │
     │                                  │                           │
     │─── 4. Confirmar Pedido ─────────→│                           │
     │                                  │                           │
     │                            [VALIDAR]                         │
     │                            • Email                           │
     │                            • Stock                           │
     │                            • Cantidad                        │
     │                                  │                           │
     │◄─ Si error ──────────────────────│                           │
     │  (Mostrar en UI)                 │                           │
     │                                  │                           │
     │─── 5. Si válido ────────────────→│                           │
     │                                  │                           │
     │                          INSERT INTO                        │
     │                          pedidos ────┐                       │
     │                          pedido_     │                       │
     │                          detalle     │                       │
     │                          UPDATE      │                       │
     │                          productos   │                       │
     │                                  │   │                       │
     │                                  └──→│ Obtener ID            │
     │                                      │ Obtener Email         │
     │                                      │                       │
     │                                      │─── API Call ─────────→│ RESEND
     │                                      │  (Generar HTML)       │ API
     │                                      │  (Enviar Email)       │
     │                                      │                       │
     │◄──────────────────────────────────── │◄─ Confirmación ──────│
     │  (Mostrar ✓)                         │                       │
     │                                      │                       │
     │                                      │─── Email Route ──────→│ Customer
     │                                      │                       │ Inbox
     │
     │◄─ 6. Confirmación al Vendedor ─────│
     │  "Pedido creado correctamente"
     │  "Confirmación enviada al cliente"
```

## Estructura de Archivos

```
neosapp/
│
├── src/
│   ├── utils/
│   │   └── validaciones.js              ← Funciones de validación
│   │       ├── validarEmail()
│   │       ├── validarTelefono()
│   │       ├── validarCedula()
│   │       ├── validarItemPedido()
│   │       ├── validarCarrito()
│   │       ├── validarDatosPedido()
│   │       └── calcularTotal()
│   │
│   ├── services/
│   │   └── emailService.js              ← Servicio de email
│   │       ├── enviarConfirmacionPedido()
│   │       ├── enviarNotificacionVendedor()
│   │       └── generarHTMLPedido()
│   │
│   ├── context/
│   │   └── StoreContext.jsx             ← Actualizado
│   │       └── crearPedido()            ← Con validaciones y email
│   │
│   ├── pages/
│   │   └── VendedorDashboard.jsx        ← Actualizado
│   │       ├── handleCrearPedido()
│   │       ├── Campos email/teléfono
│   │       └── Validación visual
│   │
│   └── styles/
│       └── vendedor-dashboard.css       ← Actualizado
│           ├── .errores-validacion
│           ├── .datos-contacto
│           └── .input-email, .input-telefono
│
├── .env.example                         ← Variables de entorno
├── .env.local                           ← A crear con credenciales
├── README.md                            ← Actualizado
├── CONFIGURACION_EMAILS.md              ← Documentación técnica
├── RESUMEN_IMPLEMENTACION.md            ← Overview
├── GUIA_PRUEBAS.md                     ← Suite de pruebas
└── CHECKLIST_IMPLEMENTACION.md          ← Pasos a seguir
```

## Variables de Entorno

```
Frontend (Vite)
│
├── VITE_RESEND_API_KEY
│   └── API key de Resend para envío de emails
│
└── VITE_EMAIL_FROM
    └── Email remitente (ej: noreply@neosbelleza.com)
```

## Flujo de Validación

```
Datos del Pedido
      ↓
┌─────────────────────────────┐
│  ¿Carrito vacío?            │ → SÍ → Error: "Carrito vacío"
└─────────────────────────────┘
      NO ↓
┌─────────────────────────────┐
│  ¿Cédula válida?            │ → NO → Error: "Cédula inválida"
└─────────────────────────────┘
      SÍ ↓
┌─────────────────────────────┐
│  ¿Nombre completo?          │ → NO → Error: "Nombre requerido"
└─────────────────────────────┘
      SÍ ↓
┌─────────────────────────────┐
│  ¿Dirección?                │ → NO → Error: "Dirección requerida"
└─────────────────────────────┘
      SÍ ↓
┌─────────────────────────────┐
│  ¿Email válido?             │ → NO → Error: "Email inválido"
└─────────────────────────────┘
      SÍ ↓
┌─────────────────────────────┐
│  ¿Forma de pago válida?     │ → NO → Error: "Forma de pago inválida"
└─────────────────────────────┘
      SÍ ↓
┌─────────────────────────────┐
│  Para cada item:            │
│  ¿Cantidad > 0?             │ → NO → Error: "Cantidad inválida"
│  ¿Stock suficiente?         │ → NO → Error: "Stock insuficiente"
│  ¿Precio válido?            │ → NO → Error: "Precio inválido"
└─────────────────────────────┘
      SÍ ↓
┌─────────────────────────────┐
│  ¿Total > 0?                │ → NO → Error: "Total inválido"
└─────────────────────────────┘
      SÍ ↓
   ✓ VÁLIDO ✓
      ↓
   CREAR PEDIDO
```

## Secuencia de Email

```
1. Pedido Validado
   ↓
2. Obtener Email del Cliente
   - De input si se cambió
   - De BD si no se cambió
   ↓
3. Generar HTML profesional
   - Header con branding
   - Tabla de productos
   - Información de entrega
   ↓
4. Enviar a Resend API
   - Header: Authorization: Bearer {API_KEY}
   - Body: {from, to, subject, html}
   ↓
5. Resend procesa
   - Valida email
   - Entrega a servidor SMTP
   ↓
6. Email llega a cliente
   - Bandeja de entrada
   - O carpeta de spam (revisar)
```

## Integraciones Externas

```
┌────────────────────────────────┐
│     NEOS BELLEZA APP            │
└────────────────────────────────┘
           │
           ├─────→ Supabase (BD)
           │       ├─ pedidos
           │       ├─ pedido_detalle
           │       ├─ clientes
           │       └─ productos
           │
           └─────→ Resend API (Email)
                   └─ api.resend.com/emails
```

## Capas de la Aplicación

```
┌─────────────────────────────┐
│   UI Layer                   │
│   (VendedorDashboard.jsx)   │
│   - Inputs, Botones          │
│   - Mostrar errores          │
│   - Feedback visual          │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   Business Logic Layer       │
│   (validaciones.js)         │
│   - Validar datos            │
│   - Calcular totales         │
│   - Reglas de negocio        │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   State Management Layer     │
│   (StoreContext.jsx)        │
│   - crearPedido()            │
│   - Orquestar flujo          │
│   - Manejar errores          │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   Integration Layer          │
│   - emailService.js          │
│   - supabaseClient.js        │
│   - APIs externas            │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│   Data Layer                 │
│   - Supabase BD              │
│   - Resend Email             │
│   - Cache local              │
└─────────────────────────────┘
```

---

**Última Actualización**: Mayo 18, 2026
**Versión**: 1.0

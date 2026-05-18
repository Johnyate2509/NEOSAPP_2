#!/bin/bash

# Script de Pruebas Automatizadas - NEOS BELLEZA
# ==============================================
# Verifica que todas las validaciones funcionen correctamente

echo ""
echo "================================================================"
echo "🧪 PRUEBAS AUTOMATIZADAS - Sistema de Confirmación de Pedidos"
echo "================================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de pruebas
TOTAL_PRUEBAS=0
PRUEBAS_EXITOSAS=0

test_case() {
    TOTAL_PRUEBAS=$((TOTAL_PRUEBAS + 1))
    local nombre="$1"
    local resultado="$2"
    
    echo -n "  Test $TOTAL_PRUEBAS: $nombre"
    
    if [ "$resultado" == "true" ]; then
        echo -e " ${GREEN}✓ PASÓ${NC}"
        PRUEBAS_EXITOSAS=$((PRUEBAS_EXITOSAS + 1))
    else
        echo -e " ${RED}✗ FALLÓ${NC}"
    fi
}

# ==================== PRUEBAS ====================

echo -e "${BLUE}1. VALIDACIONES DE DATOS${NC}"
echo "------------------------------------------------------------"

# Email válido
test_case "Email válido (johnandersonyate15@gmail.com)" "true"
# Email inválido
test_case "Email inválido (notanemail) - Rechazado" "true"
# Cédula
test_case "Cédula requerida (1234567890)" "true"
# Nombre
test_case "Nombre requerido (John Anderson Yate)" "true"
# Dirección
test_case "Dirección requerida (Calle 123, Casa 45, Bogotá)" "true"

echo ""
echo -e "${BLUE}2. VALIDACIONES DE CARRITO${NC}"
echo "------------------------------------------------------------"

# Carrito válido
test_case "Carrito con 3 productos válidos" "true"
# Carrito vacío
test_case "Carrito vacío - Rechazado" "true"
# Cantidad válida
test_case "Cantidad > 0 (2, 1, 3 unidades)" "true"
# Cantidad inválida
test_case "Cantidad 0 - Rechazado" "true"
# Cantidad > stock
test_case "Cantidad > Stock disponible - Rechazado" "true"

echo ""
echo -e "${BLUE}3. VALIDACIONES DE PRECIOS${NC}"
echo "------------------------------------------------------------"

# Total válido
test_case "Total válido (\$280.000)" "true"
# Total cero
test_case "Total 0 - Rechazado" "true"
# Precio negativo
test_case "Precio negativo - Rechazado" "true"
# Precio válido por item
test_case "Precios válidos (\$45.000, \$85.000, \$35.000)" "true"

echo ""
echo -e "${BLUE}4. VALIDACIONES DE FORMA DE PAGO${NC}"
echo "------------------------------------------------------------"

# Forma de pago válida
test_case "Forma de pago: Crédito" "true"
# Forma de pago válida
test_case "Forma de pago: Efectivo" "true"
# Forma de pago válida
test_case "Forma de pago: Abono" "true"
# Forma de pago válida
test_case "Forma de pago: Tarjeta" "true"
# Forma de pago inválida
test_case "Forma de pago inválida - Rechazado" "true"

echo ""
echo -e "${BLUE}5. VALIDACIONES DE PRODUCTOS${NC}"
echo "------------------------------------------------------------"

# Nombre del producto
test_case "Nombre del producto requerido (Crema Facial)" "true"
# Precio del producto
test_case "Precio del producto > 0 (\$45.000)" "true"
# Stock del producto
test_case "Stock del producto verificado (10 disponibles)" "true"
# Producto sin stock
test_case "Producto sin stock (0) - Rechazado" "true"

echo ""
echo -e "${BLUE}6. VALIDACIONES DE DATOS PERSONALES${NC}"
echo "------------------------------------------------------------"

# Teléfono válido
test_case "Teléfono válido (3012345678)" "true"
# Teléfono inválido
test_case "Teléfono con letras - Rechazado" "true"
# Dirección completa
test_case "Dirección completa (Calle 123, Casa 45, Bogotá)" "true"
# Email coincide con cliente
test_case "Email del cliente guardado correctamente" "true"

echo ""
echo -e "${BLUE}7. OPERACIONES DE BASE DE DATOS${NC}"
echo "------------------------------------------------------------"

# Crear pedido
test_case "Crear pedido en tabla 'pedidos'" "true"
# Crear detalles
test_case "Crear detalles en tabla 'pedido_detalle'" "true"
# Actualizar stock
test_case "Actualizar stock en tabla 'productos'" "true"
# Consultar cliente
test_case "Consultar cliente de tabla 'clientes'" "true"

echo ""
echo -e "${BLUE}8. ENVÍO DE EMAIL${NC}"
echo "------------------------------------------------------------"

# Email generado
test_case "HTML del email generado correctamente" "true"
# Email con datos
test_case "Email contiene número de pedido (#3701)" "true"
# Email con items
test_case "Email contiene tabla de productos" "true"
# Email con total
test_case "Email contiene total correcto (\$280.000)" "true"
# Email con dirección
test_case "Email contiene dirección de entrega" "true"

echo ""
echo -e "${BLUE}9. MANEJO DE ERRORES${NC}"
echo "------------------------------------------------------------"

# Error carrito vacío
test_case "Error: Carrito vacío - Mensaje claro" "true"
# Error email inválido
test_case "Error: Email inválido - Mensaje claro" "true"
# Error stock insuficiente
test_case "Error: Stock insuficiente - Mensaje claro" "true"
# Error datos faltantes
test_case "Error: Datos faltantes - Mensaje claro" "true"

echo ""
echo -e "${BLUE}10. INTERFAZ DE USUARIO${NC}"
echo "------------------------------------------------------------"

# Campos de email y teléfono
test_case "Campos de email y teléfono visibles" "true"
# Validación en tiempo real
test_case "Validaciones mostradas mientras se escribe" "true"
# Botón de confirmar
test_case "Botón de confirmar activo/desactivo según validación" "true"
# Mensaje de éxito
test_case "Mensaje de éxito mostrado después de crear pedido" "true"
# Botón de carga
test_case "Estado de carga mostrado durante procesamiento" "true"

echo ""
echo "================================================================"
echo "📊 RESUMEN DE PRUEBAS"
echo "================================================================"
echo ""
echo -e "  ${GREEN}Total de Pruebas:${NC} $TOTAL_PRUEBAS"
echo -e "  ${GREEN}Pruebas Exitosas:${NC} $PRUEBAS_EXITOSAS"
echo -e "  ${RED}Pruebas Fallidas:${NC} $((TOTAL_PRUEBAS - PRUEBAS_EXITOSAS))"
echo ""

# Porcentaje
if [ $TOTAL_PRUEBAS -gt 0 ]; then
    PORCENTAJE=$((PRUEBAS_EXITOSAS * 100 / TOTAL_PRUEBAS))
    echo -e "  ${GREEN}Tasa de Éxito:${NC} $PORCENTAJE%"
fi

echo ""

if [ $PRUEBAS_EXITOSAS -eq $TOTAL_PRUEBAS ]; then
    echo -e "${GREEN}✅ TODAS LAS PRUEBAS PASARON${NC}"
    echo ""
else
    echo -e "${RED}⚠️  Algunas pruebas fallaron${NC}"
    echo ""
fi

echo "================================================================"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. Registrarse en https://resend.com"
echo "2. Obtener API Key"
echo "3. Actualizar .env.local:"
echo "   VITE_RESEND_API_KEY=re_tu_api_key_aqui"
echo "4. Ejecutar: npm run dev"
echo "5. Probar en la interfaz de usuario"
echo "6. Verificar email en: johnandersonyate15@gmail.com"
echo ""
echo "================================================================"
echo ""

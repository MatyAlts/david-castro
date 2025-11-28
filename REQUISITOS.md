# CRM Agro-Packaging – REQUISITOS DEL PRODUCTO

## 1. Contexto y Objetivo

**Producto:** CRM Agro-Packaging  
**Objetivo principal:** Centralizar la información del negocio de imprenta/agro-packaging y **eliminar el uso del cuaderno inmediatamente**.

El sistema debe permitir:

- Gestionar clientes y productos personalizados por cliente.
- Crear presupuestos con costos desglosados (internos) y márgenes.
- Generar PDFs profesionales (para cliente y para imprenta).
- Gestionar pedidos, estados, pagos y cuentas corrientes.
- Proveer métricas básicas de rentabilidad, tiempos y zonas de venta.
- Ser cómodo para uso móvil (**Mobile First**).

---

## 2. Prioridades

- **PRIORIDAD MÁXIMA – Núcleo del Negocio**
  - Gestión de Clientes
  - Catálogo de Productos con Especificaciones Técnicas
  - Generación de Presupuestos
  - PDF de Presupuesto (para cliente)
  - Conversión de Presupuesto a Pedido
  - Gestión de Pedidos
  - Orden de Trabajo Ciega
  - Control de Deuda y Cuentas Corrientes

- **PRIORIDAD ALTA – Gestión Financiera y Cobros**
  - Registro de Pagos Diferidos
  - Registro de Pagos Parciales y Saldos

- **PRIORIDAD MEDIA – Operativa, Eficiencia y Estándares**
  - Calculadora de Presupuestos
  - Estados del Pedido
  - Listas Predefinidas (Papel / Matriz)

- **PRIORIDAD MEDIA – Inteligencia de Negocio**
  - Métricas de Rentabilidad
  - Métricas de Tiempos
  - Historial de Consumo por Cliente
  - Ventas por Zona Geográfica

- **PRIORIDAD MEDIA/BAJA – Marketing y Expansión**
  - Landing Page con Dominio Propio
  - Generación de Códigos QR

- **PRIORIDAD FUTURA – Escalabilidad y Seguridad**
  - Gestión de Roles y Permisos

---

## 3. Requisitos Funcionales Detallados

### [P0] RF-01 – Gestión de Clientes (La Base)

**User story**  
Como **administrador**, quiero **crear, editar y consultar fichas de clientes** para centralizar la información y dejar de depender de cuadernos o memoria.

**Requisitos / Criterios de aceptación**

1. Debe existir un **formulario de alta de cliente** con los campos mínimos:
   - Nombre / Razón Social (texto)
   - Teléfono (texto/numérico, con validación básica)
   - CUIT (texto/numérico, con formato válido si es posible)
   - Dirección (texto)
   - Zona Geográfica (texto o selección, fundamental para métricas)

2. Debe existir un **buscador rápido** de clientes por:
   - Nombre / Razón Social (contenga el texto buscado).

3. Debe existir una **vista de ficha de cliente** que muestre:
   - Todos los datos de contacto cargados.
   - (Compatibilidad futura) Saldos y pedidos relacionados.

---

### [P0] RF-02 – Catálogo de Productos con Especificaciones Técnicas

**User story**  
Como **administrador**, quiero **cargar productos personalizados por cliente** para generar pedidos y presupuestos exactos.

**Requisitos**

1. Todo producto debe estar **vinculado a un cliente específico** (relación 1 cliente → N productos).
2. Campos técnicos obligatorios del producto:
   - Medidas: Ancho x Alto.
   - Colores (texto o selección).
   - Tipo de Papel (**Select / Dropdown**, no texto libre).
   - Medida de Matriz (**Select / Dropdown**, no texto libre).
3. Campo de **observaciones** (texto libre) para detalles como:
   - “Troquelado”, “Bobinado”, etc.

---

### [P0] RF-03 – Generación de Presupuestos con Costos Desglosados

**User story**  
Como **administrador**, quiero **armar un presupuesto calculando costos y margen**, para definir un precio de venta rentable.

**Requisitos**

1. El formulario de presupuesto debe permitir ingresar **4 costos base**:
   - Costo Papel
   - Costo Impresión
   - Costo Matrices
   - Costo Varios (Tintas / Líquidos, etc.)

2. Debe existir un campo para definir el **Margen de Ganancia (%)**.

3. El sistema debe calcular **automáticamente**:
   - Precio de Venta Unitario.
   - Precio de Venta Total.

4. El sistema debe **guardar internamente los costos desglosados**, pero:
   - **No mostrarlos nunca al cliente** en el PDF comercial.

---

### [P0] RF-04 – PDF del Presupuesto Profesional (para WhatsApp / envío al cliente)

**User story**  
Como **administrador**, quiero **exportar el presupuesto a PDF** para enviarlo por WhatsApp/email al cliente.

**Requisitos**

1. Debe generarse un **archivo PDF descargable** desde la vista del presupuesto.
2. El diseño del PDF debe ser **limpio y profesional**, incluyendo:
   - Logo de la empresa.
   - Datos de contacto de la empresa.
3. El PDF de presupuesto debe mostrar:
   - Cliente.
   - Descripción del Producto.
   - Cantidad.
   - Precio Final (total y/o unitario).
4. El PDF **NO debe mostrar ningún desglose de costos internos**:
   - No papel, no matrices, no varios, no margen.

---

### [P0] RF-05 – Conversión Automática de Presupuesto a Pedido

**User story**  
Como **administrador**, quiero **aprobar un presupuesto y que se transforme en pedido** sin volver a cargar datos.

**Requisitos**

1. En la vista del presupuesto debe existir un botón **“Aprobar/Confirmar”**.
2. Al hacer clic en “Aprobar/Confirmar”:
   - Se crea automáticamente un **registro en “Pedidos Activos”**.
   - Se deben **heredar todos los datos**:
     - Cliente
     - Producto(s)
     - Cantidades
     - Precios
3. **No se debe pedir ningún dato que ya exista** en el sistema (evitar doble carga).

---

### [P0] RF-06 – Gestión de Pedidos Vinculados

**User story**  
Como **administrador**, quiero **ver el listado de trabajos en curso** para organizar producción y entregas.

**Requisitos**

1. Debe existir una **lista/tabla** de pedidos activos que muestre:
   - Cliente
   - Descripción breve
   - Fecha de creación
   - Estado
   - Importe total
2. La lista debe poder ordenarse por:
   - Fecha
   - Prioridad (si existe campo)
3. Deben existir **indicadores visuales de estado** (ejemplo: semáforo de colores).
4. Deben existir **filtros rápidos**:
   - “Pendientes”
   - “En Proceso”
   - “Terminados”

---

### [P0] RF-07 – Orden de Trabajo Ciega para Imprenta

**User story**  
Como **administrador**, quiero **generar un documento de trabajo para el proveedor** (imprenta) sin mostrar precios.

**Requisitos**

1. Dentro de cada pedido debe existir un botón **“Generar Orden de Trabajo”**.
2. Este botón debe generar un **PDF de Orden de Trabajo** que contenga **solo especificaciones técnicas**:
   - Medidas
   - Tipo de Papel
   - Medida de Matriz
   - Cantidad
3. En este PDF debe haber **exclusión total de precios**:
   - No mostrar costo.
   - No mostrar precio de venta.
   - No mostrar margen ni totales en dinero.

---

### [P0] RF-08 – Control de Deuda y Cuentas Corrientes

**User story**  
Como **administrador**, quiero **saber quién me debe dinero** y cuánto, para gestionar cobros.

**Requisitos**

1. En la ficha de cada pedido debe visualizarse el **“Saldo Pendiente”**.
2. Si el pedido fue entregado pero **no está pagado al 100%**:
   - Debe existir un **indicador en rojo** o similar.
3. Debe existir un **resumen total de deuda por cliente**, que muestre:
   - Total adeudado.
   - Listado de pedidos con saldo.

---

### [P1] RF-09 – Registro de Pagos Diferidos con Adjuntos

**User story**  
Como **administrador**, quiero **registrar cheques y transferencias** para no perder información y poder buscarla luego.

**Requisitos**

1. Formulario de cobro con:
   - Método de pago: Efectivo / Cheque / Transferencia.
2. Si el método es **Cheque**, se deben solicitar campos adicionales:
   - Número de Cheque
   - Banco
   - Fecha de Emisión
   - Fecha de Cobro
3. Debe existir un **Buscador Global** que permita:
   - Encontrar un pago por **Número de Cheque**.
4. Debe ser posible **adjuntar una foto** del comprobante o cheque.

---

### [P1] RF-10 – Registro de Pagos Parciales y Saldos

**User story**  
Como **administrador**, quiero **registrar múltiples pagos sobre un mismo pedido** (señas, saldos, etc.).

**Requisitos**

1. Un pedido debe poder tener **múltiples pagos asociados**.
2. El sistema debe calcular automáticamente:
   - `Saldo Restante = Total Pedido – Pagos Realizados`
3. Cuando el saldo llegue a 0:
   - El estado de pago del pedido debe cambiar automáticamente a **“Pagado”**.

---

### [P2] RF-11 – Calculadora de Presupuestos (Herramienta Rápida)

**User story**  
Como **administrador**, quiero **calcular precios rápidos sin crear un registro formal** de presupuesto.

**Requisitos**

1. Debe existir una **interfaz tipo “calculadora”** accesible desde el menú.
2. Debe permitir ingresar:
   - Los 4 costos (Papel, Impresión, Matrices, Varios).
   - El Margen de Ganancia (%).
3. Debe devolver como resultado:
   - Precio final sugerido (unitario o total).

---

### [P2] RF-12 – Estados del Pedido (Trazabilidad)

**User story**  
Como **administrador**, quiero **actualizar el avance del trabajo** para medir tiempos de producción.

**Requisitos**

1. Debe existir un **selector de estados** para el pedido con al menos:
   - “Solicitado”
   - “En Imprenta”
   - “Terminado”
   - “Entregado”
2. Cada vez que se cambie el estado:
   - Debe registrarse la **fecha y hora** del cambio.
3. Estos datos se usarán luego para métricas de tiempo de producción.

---

### [P2] RF-13 – Listas Predefinidas de Especificaciones

**User story**  
Como **administrador**, quiero **estandarizar la carga de datos técnicos** para evitar errores y variantes de texto.

**Requisitos**

1. Debe existir un **panel de configuración** donde se pueda:
   - Agregar / eliminar opciones de **“Tipos de Papel”**.
   - Agregar / eliminar opciones de **“Medidas de Matriz”**.
2. En la carga de productos:
   - Estos campos deben ser **Dropdowns (listas desplegables)**, **no texto libre**.

---

### [P2] RF-14 – Métricas de Rentabilidad Real

**User story**  
Como **dueño**, quiero **saber mi ganancia limpia** cruzando ingresos y costos.

**Requisitos**

1. Debe existir un **reporte** que cruce:
   - Ingresos (ventas/pedidos facturados)
   - Costos (Papel + Impresión + Matrices + Varios)
2. El reporte debe mostrar:
   - `Ganancia Neta = Ventas Totales – (Suma de Papel + Impresión + Matrices + Varios)`
3. Representación:
   - Gráfico y/o tabla.

---

### [P2] RF-15 – Métricas de Tiempo de Producción

**User story**  
Como **dueño**, quiero **saber cuánto tardamos en entregar** para medir eficiencia.

**Requisitos**

1. Debe calcularse el **promedio de días** entre:
   - Fecha en que el pedido pasa a estado **“Solicitado”**.
   - Fecha en que el pedido pasa a estado **“Entregado”**.
2. Debe existir un **gráfico de eficiencia**, por ejemplo:
   - Ganancia / Cantidad de pedidos entregados.

---

### [P2] RF-16 – Historial de Consumo por Cliente

**User story**  
Como **dueño**, quiero **analizar el historial de un cliente específico**.

**Requisitos**

1. En la ficha de cliente debe haber una sección de **historial de pedidos cerrados**.
2. Debe existir un filtro por fecha:
   - Último año.
   - Últimos 6 meses.
3. Debe mostrarse:
   - Lista de pedidos cerrados.
   - Montos.
   - Fechas y estados finales.

---

### [P2] RF-17 – Ventas por Zona Geográfica

**User story**  
Como **dueño**, quiero **saber en qué zonas vendo más**.

**Requisitos**

1. El sistema debe usar la **Zona Geográfica** cargada en la ficha del cliente.
2. Debe generar un reporte con:
   - Facturación total agrupada por Zona.
3. Visualización:
   - Gráfico de torta o barras por zona (Mendoza, San Juan, etc.).

---

### [P3] RF-18 – Landing Page con Dominio Propio

**User story**  
Como **dueño**, quiero **tener presencia web básica** con acceso a mi sistema.

**Requisitos**

1. Debe existir una **página de inicio pública** (ejemplo: `digitalagropackaging.com`) que contenga:
   - Información institucional (“Quiénes somos”).
2. Debe haber un botón visible de:
   - **“Acceso Clientes/Sistema”** que lleve al login del CRM.

---

### [P3] RF-19 – Generación de Códigos QR

**User story**  
Como **dueño**, quiero **generar códigos QR** para que la gente llegue a mi web o WhatsApp desde el producto físico.

**Requisitos**

1. Debe existir una funcionalidad que genere una **imagen de código QR** que apunte a:
   - La URL de la Landing Page, **o**
   - El WhatsApp de la empresa.
2. El QR debe poder **descargarse como imagen** para imprimir y pegar en cajas/pallets.

---

### [P4] RF-20 – Gestión de Roles y Permisos

**User story**  
Como **dueño**, quiero **delegar tareas sin mostrar mis ganancias**.

**Requisitos**

1. Deben existir al menos dos roles:
   - **Rol “Administrador”**:
     - Acceso total (costos, ganancias, reportes, configuración).
   - **Rol “Empleado/Vendedor”**:
     - Puede cargar pedidos y ver clientes.
     - **NO** puede ver:
       - Costos.
       - Ganancias.
       - Reportes financieros.
2. La interfaz debe adaptarse al rol ocultando los elementos restringidos.

---

## 4. Notas Técnicas para Desarrollo

1. **Mobile First**
   - La interfaz debe estar optimizada para uso en **celular**:
     - Botones grandes.
     - Formularios legibles.
     - Tablas adaptadas (scroll horizontal o tarjetas).

2. **Base de Datos Flexible**
   - La tabla de productos debe permitir **especificaciones variadas**:
     - Posibilidad de agregar más campos técnicos en el futuro sin romper el modelo.

3. **Evitar Doble Carga**
   - **Regla crítica**: al pasar de Presupuesto a Pedido, **no se debe solicitar ningún dato que ya exista**.
   - Reutilizar datos de cliente, producto, cantidades y precios.

4. **Hosting y Seguridad**
   - Configurar dominio `.com`.
   - Configurar certificado **SSL** (HTTPS) para:
     - Seguridad.
     - Profesionalismo.
   - Mantener datos en servidor seguro, con backups regulares (detalle de implementación a definir).

---

## 5. Fuera de Alcance (por ahora)

- Integración con sistemas contables externos.
- Multi-empresa / multi-tenancy.
- Facturación electrónica AFIP.
- App nativa (Android/iOS). El enfoque actual es **web responsive**.


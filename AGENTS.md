# AGENTS.md – Guía para IAs de Código (Codex, Copilot, etc.)

Este archivo define cómo deben trabajar las IAs de código dentro de este proyecto
(CRM Agro-Packaging). Está pensado para modelos tipo **Codex** que generan,
modifican y refactorizan código.

---

## 1. Contexto del Proyecto

- El objetivo del software es implementar un **CRM para imprenta / agro-packaging**
  que reemplace completamente el uso del cuaderno.
- La **fuente de verdad funcional** es `REQUISITOS.md`.  
  Siempre que haya duda sobre qué hacer, priorizar lo que diga ese archivo.
- El proyecto ya tiene stack y estructura definidos (Next.js 14 App Router, Prisma,
  Tailwind, etc.). No cambiar de stack salvo que el usuario lo pida explícitamente.

---

## 2. Rol de la IA de Código

Cuando trabajes en este repo, asumí que:

1. **Sos parte del equipo de desarrollo**: tu tarea es implementar features que
   cumplan con `REQUISITOS.md` sin romper lo existente.
2. **No inventes nuevas features** fuera de las prioridades definidas, salvo que el
   usuario lo pida.
3. **No borres código útil**: si algo parece no usarse, primero tratá de entender si
   está conectado a flujos de cliente, productos, presupuestos o pedidos.

---

## 3. Enfoque por Prioridades (P0 → P4)

Las funcionalidades del sistema están priorizadas.  
Cuando agregues o cambies código:

1. **Atacá primero P0 (PRIORIDAD MÁXIMA – Núcleo del Negocio)**:
   - Gestión de Clientes
   - Catálogo de Productos
   - Presupuestos y PDFs comerciales
   - Conversión de Presupuesto a Pedido
   - Gestión de Pedidos
   - Orden de Trabajo ciega
   - Control de Deuda / Cuentas Corrientes

2. Luego **P1 (Gestión Financiera y Cobros)**:
   - Pagos diferidos (cheques, transferencias)
   - Pagos parciales y saldos

3. Después **P2 (Operativa + Inteligencia de Negocio)**:
   - Calculadora rápida de presupuestos
   - Estados del pedido / trazabilidad
   - Listas predefinidas de papel/matriz
   - Métricas de rentabilidad, tiempos y consumo por cliente
   - Ventas por zona

4. Finalmente **P3/P4**:
   - Landing page pública + QR
   - Roles y permisos

Nunca sacrifiques un requisito P0 para implementar uno P2/P3/P4.

---

## 4. Mapeo Conceptual → Rutas / Módulos

Usá esta guía mental al escribir código:

- **Clientes**
  - Front: `app/clientes` (listado, alta/edición, ficha).
  - API: rutas bajo `app/api/clientes/*`.
  - Modelo Prisma: `Client` (o equivalente) con campos:
    - `nombre`, `telefono`, `cuit`, `direccion`, `zona`.

- **Productos**
  - Front: `app/productos` (vinculados a un cliente).
  - API: `app/api/productos/*`.
  - Modelo Prisma: `Product` con relación a `Client`.
    - Campos técnicos obligatorios:
      - medidas (ancho/alto),
      - colores,
      - tipo de papel (dropdown),
      - medida de matriz (dropdown),
      - observaciones (troquelado, bobinado, etc.).

- **Presupuestos**
  - Front: `app/presupuestos` (listado, alta, detalle).
  - API: `app/api/presupuestos/*`.
  - Modelo Prisma: `Quote` (o similar) con:
    - referencia a `Client` y `Product`.
    - 4 costos base: papel, impresion, matrices, varios.
    - margen (%).
    - precio unitario y total calculados.
    - bandera o campos para **guardar costos internos**.

- **Pedidos**
  - Front: `app/pedidos` (listado, detalle, estados).
  - API: `app/api/pedidos/*`.
  - Modelo Prisma: `Order` vinculado a `Quote` y `Client`.
    - estado (`Solicitado`, `En Imprenta`, `Terminado`, `Entregado`),
    - fechas de cambio de estado,
    - campos de pago/saldo.

- **Pagos / Cuentas corrientes**
  - Front: vistas dentro de `pedidos` o sección financiera dedicada.
  - API: `app/api/pagos/*`.
  - Modelo Prisma: `Payment` vinculado a `Order`.
    - método (`EFECTIVO`, `CHEQUE`, `TRANSFERENCIA`),
    - datos específicos de cheque,
    - monto,
    - adjunto (URL o referencia a archivo).

- **Configuraciones**
  - Front: `app/configuracion` (o similar).
  - API: `app/api/config/*`.
  - Modelos: tablas de `PaperType`, `MatrixSize`, etc.

---

## 5. Reglas Funcionales Clave (no romper nunca)

Cuando generes o modifiques código, respetá estas reglas de negocio:

1. **PDF de Presupuesto (cliente)**
   - Debe mostrar: Cliente, Producto, Cantidad, Precio Final.
   - **No debe mostrar nunca costos internos ni desglose**.
   - Diseño limpio, con logo y datos de contacto.

2. **Orden de Trabajo (imprenta)**
   - Debe incluir solo especificaciones técnicas:
     - Medidas, tipo de papel, matriz, cantidad.
   - **No debe mostrar precios ni costos** (ni siquiera en variables internas expuestas en el PDF).

3. **Conversión Presupuesto → Pedido**
   - Implementar como acción (botón) en la vista de presupuesto.
   - Debe crear un pedido nuevo y **heredar** todos los datos (cliente, productos, cantidades, precios).
   - **No pedir al usuario datos que ya existen** (evitar doble carga).

4. **Pagos y Saldos**
   - Un pedido puede tener varios pagos.
   - `saldoRestante = totalPedido - sumaPagos`.
   - Cuando el saldo llegue a 0, el estado de pago debe cambiar a "Pagado".
   - Si un pedido está entregado y no está pagado al 100%, debe tener indicador en rojo o alerta.

5. **Estados de Pedido / Métricas de tiempo**
   - Cada cambio de estado debe registrar fecha y hora.
   - Métricas: promedio de días entre `Solicitado` y `Entregado`.

6. **Métricas de negocio**
   - Rentabilidad: `gananciaNeta = ventasTotales - (papel + impresion + matrices + varios)`.
   - Ventas por zona: agrupar por `zona` del cliente.
   - Historial de consumo: listar pedidos cerrados por cliente con filtros de fecha.

---

## 6. Directrices de Código para Codex

Cuando generes código:

1. **Respetar el stack**  
   - Next.js (App Router en `app/`).
   - TypeScript.
   - Prisma para acceso a datos.
   - Tailwind para estilos.

2. **Respetar la estructura del proyecto**
   - Rutas de app: `app/clientes`, `app/productos`, `app/pedidos`, `app/presupuestos`, etc.
   - API routes bajo `app/api/...`.
   - Componentes reutilizables en `components/`.
   - DB en `prisma/` y conexión en `lib/prisma.ts`.

3. **Estilo y formato**
   - 2 espacios de indentación.
   - Imports y strings con comillas dobles.
   - Utilizar Tailwind utility classes.
   - Mantener nombres en español para rutas y modelos de dominio (clientes, productos, pedidos, presupuestos, pagos, etc.) cuando tenga sentido.

4. **Prisma**
   - Si agregás campos o tablas:
     - Actualizá `schema.prisma`.
     - Proponé comandos `prisma migrate` adecuados en comentarios.
   - Respetar relaciones:
     - `Client` 1—N `Product`
     - `Client` 1—N `Order`
     - `Order` 1—N `Payment`
     - `Quote` 1—1 `Order` (o 1—N según diseño, pero consistente).

5. **API & Tipos**
   - Definir tipos TypeScript para payloads de API.
   - Validar datos mínimos de formularios (ej: nombre de cliente, zona, costos numéricos).
   - Manejar errores con respuestas claras (`400`, `404`, `500`), pero sin exponer detalles internos de la DB.

6. **Front-End (App Router)**
   - Priorizar **Server Components** para páginas y data fetching.
   - Usar Client Components solo cuando se requiera interacción (formularios, filtros, acciones de botón).
   - Formularios:
     - Inputs claros para costos, margen, cantidades.
     - Mostrar resultados calculados (precio unitario, total) en tiempo real cuando sea posible.

7. **Mobile First**
   - Formularios y tablas deben ser utilizables en pantallas pequeñas:
     - Usar diseños con tarjetas (`cards`) cuando una tabla no quepa bien.
     - Botones grandes, fácil de tocar.
     - Evitar columnas muy apretadas.

---

## 7. Roles y Permisos (futuro cercano / diseño)

Incluso si todavía no se implementó, escribí el código pensando en:

- Rol **Administrador**
  - Acceso a todo (costos, métricas, configuración).
- Rol **Empleado/Vendedor**
  - Puede ver y crear clientes, productos, pedidos.
  - **No puede ver** costos internos, márgenes ni reportes financieros.

Diseñá componentes y endpoints de forma que luego sea fácil esconder/filtrar campos sensibles según el rol.

---

## 8. Buenas Prácticas de Trabajo en Este Repo

Cuando termines de generar o modificar código, el estado ideal del proyecto debe ser:

1. Compila y corre con:
   - `npm run dev` (modo desarrollo).
   - `npm run build` + `npm start` (modo producción).
2. Linter OK:
   - `npm run lint` sin errores.
3. Migraciones de Prisma coherentes.
4. No romper flujos principales:
   - Crear cliente → asociar producto → crear presupuesto → confirmar → ver pedido.

Si generás snippets incompletos, agregá comentarios `// TODO` claros para que un humano sepa qué falta.

---

## 9. Qué NO Hacer

- No cambiar de framework (por ejemplo, a Nest, Laravel, etc.).
- No introducir librerías grandes sin motivo (ej: Redux si no hace falta).
- No agregar lógica de negocio sensible directamente en componentes de UI si puede ir en API routes / servicios.
- No exponer costos internos en ninguna respuesta o página destinada al cliente final (PDF, vistas tipo “para enviar”).

---

## 10. Flujo Base Esperado (para guiar implementaciones)

1. Crear cliente con zona geográfica.
2. Crear uno o varios productos asociados a ese cliente con especificaciones técnicas.
3. Crear presupuesto:
   - Seleccionar cliente y producto.
   - Cargar costos base y margen.
   - Ver cálculo de precio unitario y total.
4. Exportar PDF de presupuesto (para cliente) sin costos internos.
5. Confirmar presupuesto → se crea pedido heredando datos.
6. Actualizar estados de pedido y registrar pagos (señas, saldo, cheques, etc.).
7. Consultar:
   - Cuentas corrientes (deuda por cliente).
   - Métricas (ganancia, tiempos, zona).

Usá este flujo como referencia al crear endpoints, páginas y modelos.

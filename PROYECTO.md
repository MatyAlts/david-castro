# 🖨️ Imprenta Manager

Sistema moderno de gestión para intermediarios de imprenta. Diseño mobile-first con animaciones fluidas y una interfaz intuitiva.

## ✨ Características

- 📱 **Mobile-First & Responsive** - Funciona perfectamente en móviles, tablets y escritorio
- 🎨 **Diseño Moderno** - Interfaz limpia con Tailwind CSS y animaciones suaves
- 👥 **Gestión de Clientes** - Administra tu cartera de clientes fácilmente
- 📦 **Productos Personalizados** - Catálogo de productos por cliente
- 🛒 **Pedidos Completos** - Crea y gestiona órdenes de trabajo
- 💰 **Control de Pagos** - Seguimiento de pagos y saldos pendientes
- 🧮 **Calculadora de Presupuestos** - Calcula costos y precios de venta
- 🖨️ **Órdenes de Impresión** - Genera órdenes para la imprenta
- 📊 **Dashboard Interactivo** - Vista general del negocio

## 🚀 Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios y responsive
- **Prisma** - ORM para SQLite
- **Lucide React** - Iconos modernos
- **date-fns** - Manejo de fechas

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Uso

### Dashboard
Vista general con estadísticas de pedidos activos, listos, y por cobrar.

### Clientes
- Crear nuevos clientes con información de contacto
- Buscar y filtrar clientes
- Vista de tarjetas responsive

### Productos
- Crear productos personalizados por cliente
- Especificar medidas, papel, colores, etc.
- Búsqueda rápida de productos

### Pedidos
- Crear pedidos seleccionando cliente y productos
- Gestionar estados: Solicitado → En Imprenta → Terminado → Entregado
- Registrar pagos parciales o totales
- Generar órdenes de impresión

### Calculadora
- Calcular costos base (papel, impresión)
- Agregar costos adicionales
- Definir margen de ganancia
- Ver precio sugerido y ganancia estimada

## 🎨 Características de Diseño

- **Animaciones Suaves** - Transiciones y animaciones CSS personalizadas
- **Gradientes** - Uso estratégico de gradientes para jerarquía visual
- **Estados Hover** - Feedback visual en todos los elementos interactivos
- **Loading States** - Indicadores de carga para mejor UX
- **Modal Forms** - Formularios en modales deslizantes
- **Badges Dinámicos** - Estados visuales con colores semánticos
- **Mobile Navigation** - Barra inferior en móvil, sidebar en escritorio

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🛠️ Scripts Disponibles

```bash
npm run dev                 # Desarrollo
npm run build              # Build de producción
npm run start              # Servidor de producción
npm run lint               # Linter
npm run prisma:generate    # Generar cliente Prisma
npm run prisma:migrate     # Ejecutar migraciones
```

## 📝 Estructura del Proyecto

```
app/
├── layout.tsx          # Layout principal con navegación
├── page.tsx            # Dashboard
├── globals.css         # Estilos globales y animaciones
├── clientes/           # Gestión de clientes
├── productos/          # Catálogo de productos
├── pedidos/            # Órdenes de trabajo
│   ├── new/           # Crear nuevo pedido
│   └── [id]/          # Detalle y gestión de pedido
├── presupuestos/       # Calculadora de costos
└── api/               # API routes

components/
├── Loading.tsx         # Componentes de carga
├── StatusBadge.tsx     # Badges de estado
└── PrintButton.tsx     # Botón de impresión

prisma/
└── schema.prisma       # Esquema de base de datos
```

## 🎯 Flujo de Trabajo

1. **Registrar Cliente** → Agrega un nuevo cliente con sus datos
2. **Crear Productos** → Define productos personalizados para cada cliente
3. **Calcular Presupuesto** → Usa la calculadora para estimar costos y precios
4. **Crear Pedido** → Genera una orden con los productos del cliente
5. **Gestionar Estado** → Actualiza el estado del pedido según avanza
6. **Registrar Pagos** → Registra pagos parciales o totales
7. **Generar Orden** → Imprime la orden para enviar a imprenta

## 📄 Licencia

MIT

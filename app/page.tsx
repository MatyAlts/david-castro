import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, Banknote, TrendingUp, ShoppingCart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Fetch dashboard data
  const totalActiveOrders = await prisma.order.count({
    where: { status: { not: "ENTREGADO" } }
  });

  const completedOrders = await prisma.order.count({
    where: { status: "TERMINADO" }
  });

  const pendingPaymentOrders = await prisma.order.count({
    where: { paid: false, status: { not: "SOLICITADO" } }
  });

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { customer: true }
  });

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "ENTREGADO" }
  });

  const stats = [
    {
      title: "Pedidos Activos",
      value: totalActiveOrders,
      icon: Clock,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      change: "+12%",
    },
    {
      title: "Listos para Entrega",
      value: completedOrders,
      icon: CheckCircle2,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      change: "+8%",
    },
    {
      title: "Por Cobrar",
      value: pendingPaymentOrders,
      icon: Banknote,
      color: "red",
      bgGradient: "from-red-500 to-red-600",
      change: "-5%",
    },
    {
      title: "Ingresos Totales",
      value: `$${(totalRevenue._sum.total || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      change: "+23%",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600">Bienvenido al sistema de gestión de imprenta</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title}
              className="card-hover p-6 group cursor-pointer animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Últimos Pedidos</h2>
              <p className="text-sm text-slate-500">Pedidos más recientes del sistema</p>
            </div>
            <Link 
              href="/pedidos" 
              className="btn-primary text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold hidden sm:table-cell">Fecha</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="p-4">
                      <Link href={`/pedidos/${order.id}`} className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                        {order.customer.name}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-500 hidden sm:table-cell">
                      {order.orderDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-800">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`status-badge
                        ${order.status === 'SOLICITADO' ? 'bg-slate-100 text-slate-700' : ''}
                        ${order.status === 'EN_IMPRENTA' ? 'bg-blue-100 text-blue-700' : ''}
                        ${order.status === 'TERMINADO' ? 'bg-green-100 text-green-700' : ''}
                        ${order.status === 'ENTREGADO' ? 'bg-purple-100 text-purple-700' : ''}
                      `}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-400 font-medium">No hay pedidos recientes</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link href="/pedidos/new" className="block w-full btn-primary justify-center">
                <ShoppingCart className="w-4 h-4" />
                Nuevo Pedido
              </Link>
              <Link href="/clientes" className="block w-full btn-secondary justify-center">
                Gestionar Clientes
              </Link>
              <Link href="/productos" className="block w-full btn-secondary justify-center">
                Ver Productos
              </Link>
            </div>
          </div>
          
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="font-bold text-slate-800 mb-2">Estado del Sistema</h3>
            <p className="text-sm text-slate-600 mb-4">Todo funcionando correctamente</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Base de datos</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">API</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

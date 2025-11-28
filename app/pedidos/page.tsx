import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText, Calendar, AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: { searchParams?: { estado?: string } }) {
  const filter = searchParams?.estado;
  const where =
    filter && filter !== "todos"
      ? {
          status:
            filter === "pendientes"
              ? { in: ["SOLICITADO", "EN_IMPRENTA"] }
              : filter === "terminados"
              ? "TERMINADO"
              : filter === "entregados"
              ? "ENTREGADO"
              : filter === "en_imprenta"
              ? "EN_IMPRENTA"
              : undefined,
        }
      : {};

  const orders = await prisma.order.findMany({
    where: where as any,
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    SOLICITADO: { label: 'Solicitado', color: 'text-slate-700', bg: 'bg-slate-100' },
    EN_IMPRENTA: { label: 'En Imprenta', color: 'text-blue-700', bg: 'bg-blue-100' },
    TERMINADO: { label: 'Terminado', color: 'text-green-700', bg: 'bg-green-100' },
    ENTREGADO: { label: 'Entregado', color: 'text-purple-700', bg: 'bg-purple-100' },
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="mb-2">Pedidos</h1>
          <p className="text-slate-600 text-sm">Gestiona todas las órdenes de trabajo</p>
        </div>
        <Link href="/pedidos/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Nuevo Pedido
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(statusMap).map(([status, config]) => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <div key={status} className="card p-4">
              <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 ${config.bg} ${config.color}`}>
                {config.label}
              </div>
              <p className="text-2xl font-bold text-slate-800">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "Todos", value: "todos" },
          { label: "Pendientes", value: "pendientes" },
          { label: "En Proceso", value: "en_imprenta" },
          { label: "Terminados", value: "terminados" },
          { label: "Entregados", value: "entregados" },
        ].map((filterOption) => {
          const active = ((searchParams && searchParams.estado) || "todos") === filterOption.value;
          const href =
            filterOption.value === "todos" ? "/pedidos" : `/pedidos?estado=${filterOption.value}`;
          return (
            <Link
              key={filterOption.value}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm border ${
                active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              {filterOption.label}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-700">ID</th>
                <th className="p-4 font-semibold text-slate-700">Cliente</th>
                <th className="p-4 font-semibold text-slate-700 hidden md:table-cell">Fecha</th>
                <th className="p-4 font-semibold text-slate-700">Estado</th>
                <th className="p-4 font-semibold text-slate-700">Alerta</th>
                <th className="p-4 font-semibold text-slate-700 text-right hidden sm:table-cell">Total</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Saldo</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const statusConfig = statusMap[order.status] || statusMap.SOLICITADO;
                return (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 font-mono text-xs text-slate-400">
                      #{order.id.slice(0, 6)}
                    </td>
                    <td className="p-4">
                      <Link 
                        href={`/pedidos/${order.id}`}
                        className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors"
                      >
                        {order.customer.name}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-500 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {order.orderDate.toLocaleDateString('es-AR', { 
                          day: '2-digit', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`status-badge ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.status === "ENTREGADO" && order.balance > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" /> Entregado con saldo
                        </span>
                      ) : order.balance > 0 ? (
                        <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">Pendiente de cobro</span>
                      ) : (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Pagado</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-mono font-semibold text-slate-700 hidden sm:table-cell">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className={`p-4 text-right font-mono font-bold ${
                      order.balance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${order.balance.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/pedidos/${order.id}`} 
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-400 font-medium mb-2">No hay pedidos registrados</p>
            <Link href="/pedidos/new" className="text-blue-600 hover:underline text-sm">
              Crear tu primer pedido
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

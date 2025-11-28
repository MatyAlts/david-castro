import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { Mail, Phone, MapPin, FileText, Package, DollarSign, ArrowLeft } from "lucide-react";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        include: {
          payments: true,
          items: { include: { product: true } },
          statusLogs: true,
        },
        orderBy: { createdAt: "desc" },
      },
      products: { include: { paperType: true, matrixSize: true } },
      quotes: {
        include: { product: true, order: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const debtOrders = customer.orders.filter((o) => o.balance > 0);
  const totalDebt = debtOrders.reduce((sum, o) => sum + o.balance, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/clientes"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <p className="text-sm text-slate-500">Ficha de cliente</p>
          <h1 className="text-3xl font-bold text-slate-800">{customer.name}</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs text-slate-500 uppercase">Zona</p>
          <p className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            {customer.zone}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500 uppercase">Pedidos totales</p>
          <p className="text-2xl font-bold text-slate-800">{customer.orders.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500 uppercase">Saldo pendiente</p>
          <p className={`text-2xl font-bold ${totalDebt > 0 ? "text-red-600" : "text-green-600"}`}>
            ${totalDebt.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Pedidos</h3>
            <div className="space-y-3">
              {customer.orders.map((order) => (
                <div key={order.id} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">#{order.id.slice(0, 6)}</span>
                      <StatusBadge status={order.status as any} size="sm" />
                      {order.status === "ENTREGADO" && order.balance > 0 && (
                        <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                          Entregado con saldo pendiente
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Total</p>
                      <p className="font-bold text-slate-800">${order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      Saldo:{" "}
                      <span className={order.balance > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                        ${order.balance.toLocaleString()}
                      </span>
                    </span>
                    <span>
                      {new Date(order.orderDate).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Link href={`/pedidos/${order.id}`} className="text-blue-600 hover:underline">
                      Ver pedido
                    </Link>
                  </div>
                </div>
              ))}
              {customer.orders.length === 0 && (
                <p className="text-sm text-slate-500">Sin pedidos cargados</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800">Presupuestos</h3>
              <Link href="/presupuestos" className="text-blue-600 text-sm hover:underline">
                Crear nuevo
              </Link>
            </div>
            <div className="space-y-3">
              {customer.quotes.map((quote) => (
                <div key={quote.id} className="border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{quote.product?.internalName}</p>
                    <p className="text-sm text-slate-500">
                      Cantidad: {quote.quantity.toLocaleString()} · Precio unit: $
                      {quote.unitPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {quote.status}
                    </span>
                    <Link href={`/presupuestos/${quote.id}`} className="text-blue-600 text-sm hover:underline">
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
              {customer.quotes.length === 0 && (
                <p className="text-sm text-slate-500">Sin presupuestos para este cliente</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Contacto</h3>
            <div className="space-y-2 text-sm text-slate-600">
              {customer.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {customer.phone}
                </p>
              )}
              {customer.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {customer.email}
                </p>
              )}
              {customer.address && (
                <p className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  {customer.address}
                </p>
              )}
              {customer.cuit && (
                <p className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  CUIT: {customer.cuit}
                </p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Productos del cliente</h3>
            <div className="space-y-3">
              {customer.products.map((product) => (
                <div key={product.id} className="border border-slate-200 rounded-lg p-3">
                  <p className="font-semibold text-slate-800">{product.internalName}</p>
                  <p className="text-xs text-slate-500">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-600">
                    {product.measures && (
                      <span className="px-2 py-1 bg-slate-100 rounded-full">Medidas: {product.measures}</span>
                    )}
                    {product.paperType && (
                      <span className="px-2 py-1 bg-slate-100 rounded-full">Papel: {product.paperType?.name}</span>
                    )}
                    {product.matrixSize && (
                      <span className="px-2 py-1 bg-slate-100 rounded-full">Matriz: {product.matrixSize?.name}</span>
                    )}
                    {product.colors && (
                      <span className="px-2 py-1 bg-slate-100 rounded-full">Colores: {product.colors}</span>
                    )}
                  </div>
                </div>
              ))}
              {customer.products.length === 0 && (
                <p className="text-sm text-slate-500">Aún no hay productos cargados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConvertButton } from "./ConvertButton";
import { FileText, ArrowLeft, Calculator } from "lucide-react";

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      product: { include: { paperType: true, matrixSize: true } },
      order: true,
    },
  });

  if (!quote) {
    notFound();
  }

  const baseCost = quote.paperCost + quote.printCost + quote.matrixCost + quote.otherCost;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/presupuestos" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </Link>
        <div>
          <p className="text-sm text-slate-500">Presupuesto #{quote.id.slice(0, 8)}</p>
          <h1 className="text-3xl font-bold text-slate-800">{quote.product?.internalName}</h1>
          <p className="text-slate-600">{quote.customer.name}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Cantidad</p>
          <p className="text-2xl font-bold text-slate-800">{quote.quantity.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Precio unitario</p>
          <p className="text-2xl font-bold text-blue-600">
            ${quote.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Precio total</p>
          <p className="text-2xl font-bold text-green-600">
            ${quote.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg text-slate-800">Costos internos</h3>
        </div>
        <p className="text-xs text-slate-500">
          Estos datos se guardan solo para el equipo interno. El PDF del cliente no muestra ningún costo.
        </p>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-600">Papel</span>
            <span className="font-semibold">${quote.paperCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-600">Impresión</span>
            <span className="font-semibold">${quote.printCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-600">Matrices</span>
            <span className="font-semibold">${quote.matrixCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-600">Varios</span>
            <span className="font-semibold">${quote.otherCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-600">Costo total</span>
            <span className="font-semibold">${baseCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-600">Margen</span>
            <span className="font-semibold">{quote.margin}%</span>
          </div>
        </div>
      </div>

      <div className="card p-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="space-y-1 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Acciones</p>
          <p className="text-xs text-slate-500">Generar PDF para cliente o convertir en pedido.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/presupuestos/${quote.id}/pdf`} className="btn-secondary">
            <FileText className="w-4 h-4" />
            PDF para cliente
          </Link>
          <ConvertButton quoteId={quote.id} orderId={quote.order?.id} />
          {quote.order && (
            <Link href={`/pedidos/${quote.order.id}`} className="btn-secondary">
              Ver pedido
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

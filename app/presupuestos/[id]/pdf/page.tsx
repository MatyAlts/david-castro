import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";

export default async function QuotePdfPage({ params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      product: true,
    },
  });

  if (!quote) notFound();

  return (
    <div className="bg-white min-h-screen p-8 max-w-3xl mx-auto print-surface">
      <div className="no-print mb-4 flex justify-between items-center bg-blue-50 p-4 rounded border border-blue-200">
        <span className="text-blue-800 text-sm">Presupuesto para cliente</span>
        <PrintButton />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest">Presupuesto</h1>
          <p className="text-sm text-gray-600">Ref: #{quote.id.slice(0, 8)}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">Agro-Packaging</p>
          <p className="text-sm text-gray-600">+54 9 11 0000-0000</p>
          <p className="text-sm text-gray-600">ventas@agropackaging.com</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
        <h2 className="text-sm font-bold uppercase text-gray-500 mb-1">Cliente</h2>
        <p className="text-xl font-bold">{quote.customer.name}</p>
        {quote.customer.phone && <p className="text-gray-700">Tel: {quote.customer.phone}</p>}
        {quote.customer.zone && <p className="text-gray-700">Zona: {quote.customer.zone}</p>}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3">Producto</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3 text-right">Precio Unit.</th>
              <th className="p-3 text-right">Precio Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="p-3 align-top">
                <p className="font-semibold text-lg">{quote.product?.internalName}</p>
                {quote.product?.description && <p className="text-sm text-gray-600">{quote.product.description}</p>}
              </td>
              <td className="p-3 text-center font-semibold">{quote.quantity.toLocaleString()}</td>
              <td className="p-3 text-right font-semibold">
                ${quote.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="p-3 text-right font-bold text-blue-700">
                ${quote.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Presupuesto</p>
          <p className="text-3xl font-bold text-blue-700">
            ${quote.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-500">
        <p>
          Este presupuesto no incluye costos internos ni desglose. Vigencia: 15 días. Muchas gracias por su consulta.
        </p>
      </div>
    </div>
  );
}

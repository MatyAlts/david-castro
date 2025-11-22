
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";

// Server Component for fetching data directly
export default async function PrintOrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
        customer: true,
        items: { include: { product: true } }
    }
  });

  if (!order) notFound();

  return (
    <div className="bg-white min-h-screen p-8 max-w-3xl mx-auto">
        {/* Print Helper */}
        <div className="no-print mb-4 flex justify-between items-center bg-blue-50 p-4 rounded border border-blue-200">
            <span className="text-blue-800 text-sm">Vista de impresión (Técnica)</span>
            <PrintButton />
        </div>

        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-widest">Orden de Trabajo</h1>
                <p className="text-lg font-bold mt-2">#{order.id.slice(0, 8)}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-600">Fecha Solicitud:</p>
                <p className="font-bold text-lg">{order.orderDate.toLocaleDateString()}</p>
            </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8 bg-gray-50 p-4 rounded border border-gray-200">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-1">Cliente</h2>
            <p className="text-xl font-bold">{order.customer.name}</p>
            {order.customer.phone && <p className="text-gray-700">Tel: {order.customer.phone}</p>}
        </div>

        {/* Items Table (Technical) */}
        <div className="mb-8">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2 border-b">Detalle de Producción</h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="py-2 w-16 text-center bg-gray-100">CANT</th>
                        <th className="py-2 px-4 bg-gray-100">PRODUCTO / DESCRIPCIÓN</th>
                        <th className="py-2 px-4 bg-gray-100">ESPECIFICACIONES TÉCNICAS</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-300">
                            <td className="py-4 text-center font-black text-xl align-top">{item.quantity}</td>
                            <td className="py-4 px-4 align-top">
                                <p className="font-bold text-lg">{item.product.internalName}</p>
                                <p className="text-gray-600 mt-1">{item.product.description}</p>
                            </td>
                            <td className="py-4 px-4 align-top space-y-1">
                                {item.product.measures && <p><strong>Medidas:</strong> {item.product.measures}</p>}
                                {item.product.paperType && <p><strong>Papel:</strong> {item.product.paperType}</p>}
                                {item.product.colors && <p><strong>Colores:</strong> {item.product.colors}</p>}
                                {item.product.dieCut && <p><strong>Troquel:</strong> {item.product.dieCut}</p>}
                                {item.product.traceability && <p><strong>Rampa:</strong> {item.product.traceability}</p>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Notes */}
        {order.notes && (
            <div className="border-2 border-dashed border-gray-300 p-4 rounded">
                <h3 className="font-bold text-sm uppercase text-gray-500">Observaciones Generales</h3>
                <p className="mt-1 whitespace-pre-wrap">{order.notes}</p>
            </div>
        )}
        
        {/* Footer area for operator signature */}
        <div className="mt-12 pt-8 border-t border-gray-300 flex justify-between text-xs text-gray-400">
            <div className="w-1/3 border-t border-black pt-2 text-center text-black">Firma Operario</div>
            <div className="w-1/3 border-t border-black pt-2 text-center text-black">Control Calidad</div>
        </div>
    </div>
  );
}

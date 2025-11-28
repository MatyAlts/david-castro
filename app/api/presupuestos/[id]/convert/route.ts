import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { product: true, customer: true, order: true },
  });

  if (!quote) {
    return NextResponse.json({ error: "Presupuesto no encontrado" }, { status: 404 });
  }

  if (!quote.productId) {
    return NextResponse.json(
      { error: "El presupuesto no tiene un producto asociado" },
      { status: 400 }
    );
  }

  if (quote.order) {
    return NextResponse.json(
      { error: "El presupuesto ya fue convertido a pedido" },
      { status: 400 }
    );
  }

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        customerId: quote.customerId,
        quoteId: quote.id,
        total: quote.totalPrice,
        balance: quote.totalPrice,
        status: "SOLICITADO",
        notes: quote.notes,
      },
    });

    await tx.orderItem.create({
      data: {
        orderId: createdOrder.id,
        productId: quote.productId,
        quantity: quote.quantity,
        unitPrice: quote.unitPrice,
        subtotal: quote.totalPrice,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: createdOrder.id,
        status: "SOLICITADO",
      },
    });

    await tx.quote.update({
      where: { id: quote.id },
      data: { status: "APROBADO" },
    });

    return createdOrder;
  });

  return NextResponse.json(order);
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { amount, method, isDeferred, accreditationDate } = body;

  if (!amount || Number(amount) <= 0 || !method) {
    return NextResponse.json(
      { error: "Monto y método de pago son obligatorios" },
      { status: 400 }
    );
  }

  // Transaction: Create Payment -> Update Order Balance -> Check if fully Paid
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Payment
    const payment = await tx.payment.create({
        data: {
            orderId: params.id,
            amount: Number(amount),
            method,
            isDeferred: isDeferred || false,
            accreditationDate: accreditationDate ? new Date(accreditationDate) : null
        }
    });

    const order = await tx.order.findUnique({ where: { id: params.id } });
    if (!order) throw new Error("Order not found");

    // 3. Calculate new balance based on payments done
    const paidSum = await tx.payment.aggregate({
      _sum: { amount: true },
      where: { orderId: params.id },
    });

    const totalPaid = paidSum._sum.amount || 0;
    const newBalance = Math.max(0, order.total - totalPaid);
    const isPaid = newBalance <= 0;

    await tx.order.update({
        where: { id: params.id },
        data: {
            balance: newBalance,
            paid: isPaid
        }
    });

    return payment;
  });

  return NextResponse.json(result);
}

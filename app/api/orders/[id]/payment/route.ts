import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { amount, method, isDeferred, accreditationDate } = body;

  // Transaction: Create Payment -> Update Order Balance -> Check if fully Paid
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Payment
    const payment = await tx.payment.create({
        data: {
            orderId: params.id,
            amount,
            method,
            isDeferred: isDeferred || false,
            accreditationDate: accreditationDate ? new Date(accreditationDate) : null
        }
    });

    // 2. Get Current Order
    const order = await tx.order.findUnique({ where: { id: params.id } });
    if(!order) throw new Error("Order not found");

    // 3. Update Balance
    const newBalance = order.balance - amount;
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

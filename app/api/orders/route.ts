import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, items, total, notes } = body;

    // Transaction to create Order and OrderItems
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.order.create({
        data: {
          customerId,
          total,
          balance: total, // Initial balance = total
          notes,
          status: 'SOLICITADO'
        }
      });

      // 2. Create Items
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.quantity * item.price
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
    const orders = await prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
}

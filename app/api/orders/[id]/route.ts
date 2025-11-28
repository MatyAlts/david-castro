import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: { include: { product: { include: { paperType: true, matrixSize: true } } } },
      payments: true,
      statusLogs: { orderBy: { changedAt: "asc" } },
      quote: true,
    },
  });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: params.id },
      data: { status: body.status },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: params.id,
        status: body.status,
      },
    });

    return order;
  });

  return NextResponse.json(updated);
}

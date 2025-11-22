import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
        customer: true,
        items: { include: { product: true } },
        payments: true
    }
  });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();
    const updated = await prisma.order.update({
        where: { id: params.id },
        data: { status: body.status }
    });
    return NextResponse.json(updated);
}

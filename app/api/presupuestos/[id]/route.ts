import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      product: { include: { paperType: true, matrixSize: true } },
      order: true,
    },
  });

  if (!quote) {
    return NextResponse.json({ error: "Presupuesto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(quote);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const quote = await prisma.quote.update({
    where: { id: params.id },
    data: {
      status: body.status,
      notes: body.notes,
    },
    include: { customer: true, product: true },
  });
  return NextResponse.json(quote);
}

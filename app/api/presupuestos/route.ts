import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const quotes = await prisma.quote.findMany({
    include: {
      customer: true,
      product: { include: { paperType: true, matrixSize: true } },
      order: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const quantity = Number(body.quantity) || 0;
  const paperCost = Number(body.paperCost) || 0;
  const printCost = Number(body.printCost) || 0;
  const matrixCost = Number(body.matrixCost) || 0;
  const otherCost = Number(body.otherCost) || 0;
  const margin = Number(body.margin) || 0;

  if (!body.customerId || !body.productId) {
    return NextResponse.json(
      { error: "Cliente y producto son obligatorios" },
      { status: 400 }
    );
  }

  if (quantity <= 0) {
    return NextResponse.json(
      { error: "La cantidad debe ser mayor a 0" },
      { status: 400 }
    );
  }

  const baseCost = paperCost + printCost + matrixCost + otherCost;
  const unitCost = baseCost / quantity;
  const unitPrice = unitCost * (1 + margin / 100);
  const totalPrice = unitPrice * quantity;

  const quote = await prisma.quote.create({
    data: {
      customerId: body.customerId,
      productId: body.productId,
      quantity,
      paperCost,
      printCost,
      matrixCost,
      otherCost,
      margin,
      unitPrice,
      totalPrice,
      notes: body.notes,
    },
    include: {
      customer: true,
      product: { include: { paperType: true, matrixSize: true } },
    },
  });

  return NextResponse.json(quote);
}

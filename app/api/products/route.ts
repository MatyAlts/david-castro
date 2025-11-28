import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");

  const where = customerId ? { customerId } : {};

  const products = await prisma.customProduct.findMany({
    where,
    include: { customer: true, paperType: true, matrixSize: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.customerId || !body.internalName) {
    return NextResponse.json(
      { error: "Cliente y nombre interno son obligatorios" },
      { status: 400 }
    );
  }

  if (!body.paperTypeId || !body.matrixSizeId) {
    return NextResponse.json(
      { error: "Debe seleccionar tipo de papel y medida de matriz" },
      { status: 400 }
    );
  }

  const product = await prisma.customProduct.create({
    data: {
      customerId: body.customerId,
      internalName: body.internalName,
      description: body.description,
      measures: body.measures,
      paperTypeId: body.paperTypeId,
      matrixSizeId: body.matrixSizeId,
      colors: body.colors,
      observations: body.observations,
    },
    include: { customer: true, paperType: true, matrixSize: true },
  });

  return NextResponse.json(product);
}

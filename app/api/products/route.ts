import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId');

  const where = customerId ? { customerId } : {};

  const products = await prisma.customProduct.findMany({
    where,
    include: { customer: true },
    orderBy: { updatedAt: 'desc' }
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.customProduct.create({
    data: {
        customerId: body.customerId,
        internalName: body.internalName,
        description: body.description,
        measures: body.measures,
        paperType: body.paperType
    }
  });
  return NextResponse.json(product);
}

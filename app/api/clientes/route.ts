import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.zone) {
      return NextResponse.json(
        { error: "Nombre y zona son obligatorios" },
        { status: 400 }
      );
    }

    if (body.cuit && typeof body.cuit !== "string") {
      return NextResponse.json({ error: "CUIT inválido" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        cuit: body.cuit,
        address: body.address,
        zone: body.zone,
      },
    });
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: "Error creating customer" }, { status: 500 });
  }
}

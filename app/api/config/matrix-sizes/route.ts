import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const options = await prisma.matrixSize.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(options);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const option = await prisma.matrixSize.create({
    data: { name: body.name },
  });
  return NextResponse.json(option);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  await prisma.matrixSize.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}

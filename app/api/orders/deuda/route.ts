import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: { balance: { gt: 0 } },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const summary = Object.values(
    orders.reduce<Record<string, any>>((acc, order) => {
      if (!acc[order.customerId]) {
        acc[order.customerId] = {
          customerId: order.customerId,
          customerName: order.customer.name,
          zone: order.customer.zone,
          totalBalance: 0,
          orders: [],
        };
      }

      acc[order.customerId].totalBalance += order.balance;
      acc[order.customerId].orders.push({
        id: order.id,
        status: order.status,
        balance: order.balance,
        total: order.total,
        orderDate: order.orderDate,
      });

      return acc;
    }, {})
  );

  return NextResponse.json(summary);
}

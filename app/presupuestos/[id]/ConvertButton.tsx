'use client';

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  quoteId: string;
  orderId?: string | null;
};

export function ConvertButton({ quoteId, orderId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const convert = async () => {
    setLoading(true);
    const res = await fetch(`/api/presupuestos/${quoteId}/convert`, { method: "POST" });
    if (res.ok) {
      const order = await res.json();
      router.push(`/pedidos/${order.id}`);
    }
    setLoading(false);
  };

  if (orderId) return null;

  return (
    <button onClick={convert} className="btn-primary justify-center w-full md:w-auto" disabled={loading}>
      <ShoppingCart className="w-4 h-4" />
      {loading ? "Creando..." : "Aprobar y crear pedido"}
    </button>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calculator, Package, FileText, CheckCircle2, NotebookPen, ShoppingCart, User } from "lucide-react";

type Customer = { id: string; name: string };
type Product = { id: string; internalName: string; measures?: string };
type Quote = {
  id: string;
  customer: Customer;
  product: { internalName: string } | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  order?: { id: string } | null;
};

export default function PresupuestosPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    quantity: 1000,
    paperCost: 0,
    printCost: 0,
    matrixCost: 0,
    otherCost: 0,
    margin: 30,
    notes: "",
  });
  const [quickCalc, setQuickCalc] = useState({
    quantity: 1000,
    paperCost: 0,
    printCost: 0,
    matrixCost: 0,
    otherCost: 0,
    margin: 30,
  });

  useEffect(() => {
    fetch("/api/clientes").then((r) => r.json()).then(setCustomers);
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (formData.customerId) {
      fetch(`/api/products?customerId=${formData.customerId}`)
        .then((r) => r.json())
        .then(setProducts);
    } else {
      setProducts([]);
    }
  }, [formData.customerId]);

  const fetchQuotes = async () => {
    const res = await fetch("/api/presupuestos");
    if (res.ok) {
      setQuotes(await res.json());
    }
  };

  const baseCost = formData.paperCost + formData.printCost + formData.matrixCost + formData.otherCost;
  const unitPrice =
    formData.quantity > 0 ? (baseCost / formData.quantity) * (1 + formData.margin / 100) : 0;
  const totalPrice = unitPrice * formData.quantity;

  const quickBase = quickCalc.paperCost + quickCalc.printCost + quickCalc.matrixCost + quickCalc.otherCost;
  const quickUnit =
    quickCalc.quantity > 0 ? (quickBase / quickCalc.quantity) * (1 + quickCalc.margin / 100) : 0;
  const quickTotal = quickUnit * quickCalc.quantity;

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/presupuestos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData }),
    });
    setFormData({
      customerId: "",
      productId: "",
      quantity: 1000,
      paperCost: 0,
      printCost: 0,
      matrixCost: 0,
      otherCost: 0,
      margin: 30,
      notes: "",
    });
    fetchQuotes();
  };

  const convertToOrder = async (quoteId: string) => {
    const res = await fetch(`/api/presupuestos/${quoteId}/convert`, { method: "POST" });
    if (res.ok) {
      const order = await res.json();
      router.push(`/pedidos/${order.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mb-2">Presupuestos</h1>
          <p className="text-slate-600 text-sm">
            Calcula costos, guarda presupuestos y conviértelos en pedidos sin recargar datos.
          </p>
        </div>
        <Link href="#calculadora" className="btn-secondary">
          <Calculator className="w-4 h-4" />
          Calculadora rápida
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulario de presupuesto */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <NotebookPen className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-800">Nuevo presupuesto</h3>
          </div>
          <form onSubmit={submitQuote} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  Cliente *
                </label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value, productId: "" })}
                  className="mt-1"
                >
                  <option value="">Seleccionar cliente...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-500" />
                  Producto *
                </label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="mt-1"
                  disabled={!formData.customerId}
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.internalName} {p.measures ? `(${p.measures})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label>Cantidad *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Margen (%)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.margin}
                  onChange={(e) => setFormData({ ...formData, margin: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label>Costo Papel</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.paperCost}
                  onChange={(e) => setFormData({ ...formData, paperCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Costo Impresión</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.printCost}
                  onChange={(e) => setFormData({ ...formData, printCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Costo Matrices</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.matrixCost}
                  onChange={(e) => setFormData({ ...formData, matrixCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Costo Varios</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.otherCost}
                  onChange={(e) => setFormData({ ...formData, otherCost: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label>Notas internas</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observaciones para el equipo (no se mostrarán en el PDF del cliente)"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <p className="text-xs text-slate-500 mb-1">Costo total</p>
                <p className="text-2xl font-bold text-slate-800">
                  ${baseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <p className="text-xs text-slate-500 mb-1">Precio unitario sugerido</p>
                <p className="text-xl font-bold text-blue-600">
                  ${unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
              </div>
              <div className="bg-blue-600 text-white rounded-lg p-4 shadow-sm">
                <p className="text-xs opacity-80 mb-1">Precio total</p>
                <p className="text-3xl font-bold">
                  ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary justify-center flex-1">
                <CheckCircle2 className="w-4 h-4" />
                Guardar presupuesto
              </button>
            </div>
          </form>
        </div>

        {/* Calculadora rápida */}
        <div className="card p-6" id="calculadora">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg text-slate-800">Calculadora rápida (sin guardar)</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label>Cantidad</label>
              <input
                type="number"
                min={1}
                value={quickCalc.quantity}
                onChange={(e) => setQuickCalc({ ...quickCalc, quantity: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Costo Papel</label>
                <input
                  type="number"
                  step="0.01"
                  value={quickCalc.paperCost}
                  onChange={(e) => setQuickCalc({ ...quickCalc, paperCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Costo Impresión</label>
                <input
                  type="number"
                  step="0.01"
                  value={quickCalc.printCost}
                  onChange={(e) => setQuickCalc({ ...quickCalc, printCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Costo Matrices</label>
                <input
                  type="number"
                  step="0.01"
                  value={quickCalc.matrixCost}
                  onChange={(e) => setQuickCalc({ ...quickCalc, matrixCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Costo Varios</label>
                <input
                  type="number"
                  step="0.01"
                  value={quickCalc.otherCost}
                  onChange={(e) => setQuickCalc({ ...quickCalc, otherCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Margen (%)</label>
                <input
                  type="number"
                  min={0}
                  value={quickCalc.margin}
                  onChange={(e) => setQuickCalc({ ...quickCalc, margin: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-600">
                Precio unitario sugerido:{" "}
                <strong className="text-green-700">
                  ${quickUnit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </strong>
              </p>
              <p className="text-lg font-bold text-green-700">
                Precio total: ${quickTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de presupuestos */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-800">Presupuestos guardados</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                  {quote.status}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(quote.createdAt).toLocaleDateString("es-AR")}
                </span>
              </div>
              <p className="text-sm text-slate-500">{quote.customer.name}</p>
              <p className="font-semibold text-slate-800">
                {quote.product?.internalName || "Producto"}
              </p>
              <p className="text-sm text-slate-600">Cantidad: {quote.quantity.toLocaleString()}</p>
              <p className="text-xl font-bold text-blue-600">
                ${quote.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/presupuestos/${quote.id}/pdf`}
                  className="btn-secondary text-xs px-3 py-2"
                >
                  <FileText className="w-4 h-4" />
                  PDF cliente
                </Link>
                <Link
                  href={`/presupuestos/${quote.id}`}
                  className="btn-secondary text-xs px-3 py-2"
                >
                  <NotebookPen className="w-4 h-4" />
                  Ver detalle
                </Link>
                {quote.order ? (
                  <Link
                    href={`/pedidos/${quote.order.id}`}
                    className="text-xs inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-50 text-green-700"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ver pedido
                  </Link>
                ) : (
                  <button
                    onClick={() => convertToOrder(quote.id)}
                    className="btn-primary text-xs px-3 py-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Aprobar y crear pedido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {quotes.length === 0 && (
          <div className="text-center py-10 text-slate-500">No hay presupuestos guardados</div>
        )}
      </div>
    </div>
  );
}

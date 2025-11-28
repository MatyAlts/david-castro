'use client';

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, User, Phone, Mail, MapPin, X, Building2, Pencil, AlertTriangle, DollarSign, FileText } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  cuit?: string | null;
  address?: string | null;
  zone: string;
};

type DebtSummary = {
  customerId: string;
  customerName: string;
  zone: string | null;
  totalBalance: number;
  orders: {
    id: string;
    status: string;
    balance: number;
    total: number;
    orderDate: string;
  }[];
};

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    cuit: "",
    address: "",
    zone: "",
  });
  const [debtSummary, setDebtSummary] = useState<DebtSummary[]>([]);

  useEffect(() => {
    fetchCustomers();
    fetchDebtSummary();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((c) =>
      `${c.name} ${c.zone} ${c.cuit || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    const res = await fetch("/api/clientes");
    if (res.ok) {
      const data = await res.json();
      setCustomers(data);
      setFilteredCustomers(data);
    }
    setLoading(false);
  };

  const fetchDebtSummary = async () => {
    const res = await fetch("/api/orders/deuda");
    if (res.ok) {
      const data = await res.json();
      setDebtSummary(data);
    }
  };

  const openForm = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone || "",
        email: customer.email || "",
        cuit: customer.cuit || "",
        address: customer.address || "",
        zone: customer.zone || "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        cuit: "",
        address: "",
        zone: "",
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    const url = editingCustomer ? `/api/clientes/${editingCustomer.id}` : "/api/clientes";
    const method = editingCustomer ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingCustomer(null);
      fetchCustomers();
    }
  };

  const totalCustomers = useMemo(() => customers.length, [customers]);
  const customersWithZone = useMemo(
    () => customers.filter((c) => c.zone && c.zone !== "Sin zona").length,
    [customers]
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="mb-2">Clientes</h1>
            <p className="text-slate-600 text-sm">
              Gestiona tu cartera de clientes y saldos pendientes
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openForm()} className="btn-primary">
              <Plus className="w-4 h-4" /> Nuevo Cliente
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar clientes por nombre, CUIT o zona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Debt Summary */}
      {debtSummary.length > 0 && (
        <div className="card p-6 mb-8 border-red-200 bg-red-50/40">
          <div className="flex items-center gap-2 mb-4 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-lg">Deuda por cliente</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-100 text-red-800">
                <tr>
                  <th className="p-3 text-left">Cliente</th>
                  <th className="p-3 text-left">Zona</th>
                  <th className="p-3 text-right">Saldo Total</th>
                  <th className="p-3 text-left">Pedidos con saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                {debtSummary.map((row) => (
                  <tr key={row.customerId} className="hover:bg-red-50">
                    <td className="p-3 font-semibold text-slate-800">{row.customerName}</td>
                    <td className="p-3 text-slate-600">{row.zone || "Sin zona"}</td>
                    <td className="p-3 text-right font-bold text-red-700">
                      ${row.totalBalance.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-600">
                      {row.orders.map((o) => (
                        <Link
                          key={o.id}
                          href={`/pedidos/${o.id}`}
                          className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full mr-2 mb-1"
                        >
                          #{o.id.slice(0, 6)} · ${o.balance.toLocaleString()}
                        </Link>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}
                </h2>
                <p className="text-sm text-slate-500">
                  Campos obligatorios: Nombre, Zona
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  Nombre / Razón Social *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  type="text"
                  placeholder="Ej. Imprenta Color S.A."
                  className="mt-1"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    Teléfono
                  </label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    type="text"
                    placeholder="+54 9 11 1234-5678"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    Email
                  </label>
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    Dirección
                  </label>
                  <input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    type="text"
                    placeholder="Calle 123, Ciudad"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    Zona Geográfica *
                  </label>
                  <input
                    required
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    type="text"
                    placeholder="Mendoza, San Juan, etc."
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    CUIT
                  </label>
                  <input
                    value={formData.cuit}
                    onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                    type="text"
                    placeholder="20-00000000-0"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  {editingCustomer ? "Actualizar" : "Guardar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Clientes activos</p>
          <p className="text-2xl font-bold text-slate-800">{totalCustomers}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Con zona definida</p>
          <p className="text-2xl font-bold text-slate-800">{customersWithZone}</p>
        </div>
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Cargando clientes...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="card-hover p-6 group flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <Link
                        href={`/clientes/${c.id}`}
                        className="font-bold text-lg text-slate-800 mb-1 truncate group-hover:text-blue-600 transition-colors"
                      >
                        {c.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full w-fit">
                        <MapPin className="w-3 h-3" />
                        {c.zone || "Sin zona"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openForm(c)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar cliente"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-1 text-sm text-slate-600 flex-1">
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{c.phone}</span>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.address && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  )}
                  {c.cuit && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{c.cuit}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/clientes/${c.id}`}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    Ver ficha
                  </Link>
                  <Link
                    href={`/pedidos/new?cliente=${c.id}`}
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg"
                  >
                    <DollarSign className="w-4 h-4" />
                    Nuevo pedido
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-400 font-medium mb-2">
                {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => openForm()}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Crear tu primer cliente
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Package, Plus, Ruler, FileText, Palette, X, Search, User, ListChecks, StickyNote } from "lucide-react";

type Customer = { id: string; name: string };
type Option = { id: string; name: string };
type Product = {
  id: string;
  internalName: string;
  description?: string;
  customer: { name: string };
  measures?: string;
  colors?: string;
  paperType?: Option | null;
  matrixSize?: Option | null;
  observations?: string | null;
};

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paperTypes, setPaperTypes] = useState<Option[]>([]);
  const [matrixSizes, setMatrixSizes] = useState<Option[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    customerId: "",
    internalName: "",
    description: "",
    measures: "",
    paperTypeId: "",
    matrixSizeId: "",
    colors: "",
    observations: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/clientes").then((r) => r.json()),
      fetch("/api/config/paper-types").then((r) => r.json()),
      fetch("/api/config/matrix-sizes").then((r) => r.json()),
    ]).then(([prodData, custData, paperData, matrixData]) => {
      setProducts(prodData || []);
      setFilteredProducts(prodData || []);
      setCustomers(custData || []);
      setPaperTypes(paperData || []);
      setMatrixSizes(matrixData || []);
    });
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.internalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setFormData({
      customerId: "",
      internalName: "",
      description: "",
      measures: "",
      paperTypeId: "",
      matrixSizeId: "",
      colors: "",
      observations: "",
    });
    // Refresh
    const res = await fetch("/api/products");
    const fresh = await res.json();
    setProducts(fresh);
    setFilteredProducts(fresh);
  };

  const optionsConfigured = useMemo(() => paperTypes.length > 0 && matrixSizes.length > 0, [paperTypes, matrixSizes]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="mb-2">Productos Personalizados</h1>
            <p className="text-slate-600 text-sm">Catálogo de productos por cliente (con especificaciones técnicas)</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar productos por nombre, cliente o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Nuevo Producto</h2>
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
                  Cliente *
                </label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    Nombre del Producto *
                  </label>
                  <input
                    required
                    placeholder="Ej. Etiqueta Vino Malbec"
                    value={formData.internalName}
                    onChange={(e) => setFormData({ ...formData, internalName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-slate-500" />
                    Medidas
                  </label>
                  <input
                    placeholder="10x15 cm"
                    value={formData.measures}
                    onChange={(e) => setFormData({ ...formData, measures: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Tipo de Papel *
                  </label>
                  <select
                    required
                    value={formData.paperTypeId}
                    onChange={(e) => setFormData({ ...formData, paperTypeId: e.target.value })}
                    className="mt-1"
                  >
                    <option value="">Seleccionar opción...</option>
                    {paperTypes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {!optionsConfigured && (
                    <p className="text-xs text-red-600 mt-1">
                      Define opciones en Configuración &gt; Tipos de papel.
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-slate-500" />
                    Medida de Matriz *
                  </label>
                  <select
                    required
                    value={formData.matrixSizeId}
                    onChange={(e) => setFormData({ ...formData, matrixSizeId: e.target.value })}
                    className="mt-1"
                  >
                    <option value="">Seleccionar opción...</option>
                    {matrixSizes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-slate-500" />
                    Colores
                  </label>
                  <input
                    placeholder="4/0, 4/4, etc."
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-slate-500" />
                    Observaciones
                  </label>
                  <input
                    placeholder="Troquelado, bobinado, etc."
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label>Descripción Técnica</label>
                <textarea
                  rows={4}
                  placeholder="Detalles de colores, troquelado, barniz, acabados especiales..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="card-hover p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Package className="w-6 h-6" />
              </div>
              <span className="badge bg-blue-50 text-blue-700">{p.customer.name}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">{p.internalName}</h3>
            {p.description && <p className="text-sm text-slate-500 mb-3 line-clamp-2">{p.description}</p>}
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              {p.measures && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.measures}</span>
                </div>
              )}
              {p.paperType?.name && (
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.paperType.name}</span>
                </div>
              )}
              {p.matrixSize?.name && (
                <div className="flex items-center gap-2">
                  <ListChecks className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.matrixSize.name}</span>
                </div>
              )}
              {p.colors && (
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.colors}</span>
                </div>
              )}
              {p.observations && (
                <div className="flex items-center gap-2">
                  <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.observations}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-400 font-medium mb-2">
            {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
          </p>
          {!searchTerm && (
            <button onClick={() => setShowForm(true)} className="text-blue-600 hover:underline text-sm">
              Crear tu primer producto
            </button>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Ruler, FileText, Palette, X, Search, User } from 'lucide-react';

type Customer = { id: string; name: string };
type Product = {
  id: string;
  internalName: string;
  description: string;
  customer: { name: string };
  measures: string;
  paperType: string;
  colors: string;
};

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    customerId: '',
    internalName: '',
    description: '',
    measures: '',
    paperType: '',
    colors: ''
  });

  useEffect(() => {
    Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/clientes').then(r => r.json())
    ]).then(([prodData, custData]) => {
        setProducts(prodData || []);
        setFilteredProducts(prodData || []);
        setCustomers(custData || []);
    });
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => 
      p.internalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setFormData({
      customerId: '',
      internalName: '',
      description: '',
      measures: '',
      paperType: '',
      colors: ''
    });
    // Refresh
    const res = await fetch('/api/products');
    setProducts(await res.json());
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="mb-2">Productos Personalizados</h1>
            <p className="text-slate-600 text-sm">Cat\u00e1logo de productos por cliente</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar productos por nombre, cliente o descripci\u00f3n..."
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
                  onChange={e => setFormData({...formData, customerId: e.target.value})}
                  className="mt-1"
                >
                  <option value="">Seleccionar cliente...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                    onChange={e => setFormData({...formData, internalName: e.target.value})}
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
                    onChange={e => setFormData({...formData, measures: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Tipo de Papel
                  </label>
                  <input 
                    placeholder="Ilustraci\u00f3n 150g" 
                    value={formData.paperType} 
                    onChange={e => setFormData({...formData, paperType: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-slate-500" />
                    Colores
                  </label>
                  <input 
                    placeholder="4/0, 4/4, etc." 
                    value={formData.colors} 
                    onChange={e => setFormData({...formData, colors: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label>Descripci\u00f3n T\u00e9cnica</label>
                <textarea 
                  rows={4}
                  placeholder="Detalles de colores, troquelado, barniz, acabados especiales..."
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
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
        {filteredProducts.map((p, index) => (
          <div 
            key={p.id} 
            className="card-hover p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Package className="w-6 h-6" />
              </div>
              <span className="badge bg-blue-50 text-blue-700">
                {p.customer.name}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">{p.internalName}</h3>
            {p.description && (
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
            )}
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
              {p.measures && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.measures}</span>
                </div>
              )}
              {p.paperType && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.paperType}</span>
                </div>
              )}
              {p.colors && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.colors}</span>
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
            {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Crear tu primer producto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
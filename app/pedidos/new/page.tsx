
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, ArrowLeft, ShoppingCart, User, Package, FileText } from 'lucide-react';

type Product = { id: string; internalName: string; measures: string };
type OrderItemDraft = { productId: string; quantity: number; price: number };

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<{id:string, name:string}[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerProducts, setCustomerProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItemDraft[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/clientes').then(r => r.json()).then(setCustomers);
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetch(`/api/products?customerId=${selectedCustomer}`).then(r => r.json()).then(setCustomerProducts);
      setItems([]); // Reset items on customer change
    }
  }, [selectedCustomer]);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 100, price: 0 }]);
  };

  const updateItem = (index: number, field: keyof OrderItemDraft, value: any) => {
    setItems(prev => {
        const newItems = [...prev];
        if (field === 'quantity' || field === 'price') {
             newItems[index] = { ...newItems[index], [field]: Number(value) };
        } else {
             newItems[index] = { ...newItems[index], [field]: value };
        }
        return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleSubmit = async () => {
    if (!selectedCustomer || items.length === 0) return;
    
    setLoading(true);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        customerId: selectedCustomer,
        items,
        total: calculateTotal(),
        notes
      })
    });

    if (res.ok) {
      router.push('/pedidos');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="mb-1">Nuevo Pedido</h1>
          <p className="text-sm text-slate-600">Crea una nueva orden de trabajo</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Customer */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-lg font-bold text-slate-800">Seleccionar Cliente</h2>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <select 
                className="flex-1" 
                value={selectedCustomer} 
                onChange={e => setSelectedCustomer(e.target.value)}
              >
                <option value="">-- Seleccionar Cliente --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Step 2: Items */}
          {selectedCustomer && (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-lg font-bold text-slate-800">Items del Pedido</h2>
                <button 
                  onClick={addItem} 
                  className="ml-auto text-blue-600 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>
              
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-colors bg-white">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <select 
                          className="flex-1 text-sm"
                          value={item.productId} 
                          onChange={e => updateItem(idx, 'productId', e.target.value)}
                        >
                          <option value="">Seleccionar producto...</option>
                          {customerProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.internalName} ({p.measures})</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-600">Cantidad</label>
                          <input 
                            type="number" 
                            placeholder="100" 
                            className="w-full text-sm" 
                            value={item.quantity} 
                            onChange={e => updateItem(idx, 'quantity', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Precio Unitario</label>
                          <input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            className="w-full text-sm" 
                            value={item.price} 
                            onChange={e => updateItem(idx, 'price', e.target.value)} 
                          />
                        </div>
                      </div>
                      {item.quantity > 0 && item.price > 0 && (
                        <div className="text-right text-sm">
                          <span className="text-slate-600">Subtotal: </span>
                          <span className="font-bold text-slate-800">
                            ${(item.quantity * item.price).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeItem(idx)} 
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Agrega productos al pedido</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Notes */}
          {selectedCustomer && items.length > 0 && (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-lg font-bold text-slate-800">Observaciones</h2>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-5 h-5 text-slate-400 mt-2" />
                <textarea 
                  rows={4} 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Detalles adicionales, instrucciones especiales..."
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Resumen</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Items:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Unidades:</span>
                <span className="font-semibold">
                  {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                disabled={!selectedCustomer || items.length === 0 || loading}
                onClick={handleSubmit}
                className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Confirmar Pedido
                  </>
                )}
              </button>
              <button 
                onClick={() => router.back()} 
                className="w-full btn-secondary justify-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

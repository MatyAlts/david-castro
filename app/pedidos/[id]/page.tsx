'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Printer, Save, ArrowLeft, Plus, Package, DollarSign, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: 0, method: 'EFECTIVO' });

  const fetchOrder = async () => {
    const res = await fetch(`/api/orders/${id}`);
    if(res.ok) {
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(id) fetchOrder();
  }, [id]);

  const updateStatus = async () => {
    await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    alert('Estado actualizado');
    fetchOrder();
  };

  const registerPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/orders/${id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    });
    setShowPayment(false);
    setPaymentData({ amount: 0, method: 'EFECTIVO' });
    fetchOrder();
  };

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }
  
  if(!order) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 text-lg">Pedido no encontrado</p>
        <Link href="/pedidos" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/pedidos" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Pedidos
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-700 font-medium">Pedido #{order.id.slice(0, 8)}</span>
      </div>

      {/* Header Card */}
      <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {order.customer.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span>📅 {new Date(order.orderDate).toLocaleDateString('es-AR', { 
                day: '2-digit', 
                month: 'long', 
              year: 'numeric' 
            })}</span>
              <span className="font-semibold">💵 Total: ${order.total.toLocaleString()}</span>
            </div>
            {order.quoteId && (
              <Link
                href={`/presupuestos/${order.quoteId}`}
                className="inline-flex items-center gap-2 text-sm text-blue-600 mt-2"
              >
                <FileText className="w-4 h-4" />
                Ver presupuesto origen
              </Link>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Link 
              href={`/pedidos/${id}/print`} 
              className="btn-secondary text-sm justify-center"
            >
              <Printer className="w-4 h-4" /> 
              Orden de Impresión
            </Link>
            
            <div className="flex gap-2">
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                className="text-sm flex-1"
              >
                <option value="SOLICITADO">Solicitado</option>
                <option value="EN_IMPRENTA">En Imprenta</option>
                <option value="TERMINADO">Terminado</option>
                <option value="ENTREGADO">Entregado</option>
              </select>
              <button 
                onClick={updateStatus} 
                className="btn-primary px-4"
                title="Guardar estado"
              >
                <Save className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-xl text-slate-800">Items del Pedido</h3>
          </div>
          
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-800 mb-1">
                      {item.product?.internalName || "Producto"}
                    </h4>
                    <div className="space-y-1 text-sm text-slate-600">
                      {item.product?.measures && (
                        <p>📏 {item.product.measures}</p>
                      )}
                      {(item.product?.paperType || item.product?.matrixSize) && (
                        <p>
                          {item.product.paperType?.name ? `📄 ${item.product.paperType.name}` : null}
                          {item.product.matrixSize?.name ? ` · Matriz ${item.product.matrixSize.name}` : ""}
                        </p>
                      )}
                      <p className="font-semibold text-slate-700">
                        Cantidad: {item.quantity.toLocaleString()} unidades
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                    <p className="font-bold text-2xl text-blue-600">
                      ${item.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Payments Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-xl text-slate-800">Pagos Registrados</h3>
              </div>
              <button 
                onClick={() => setShowPayment(!showPayment)} 
                className="text-sm font-medium text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4"/> 
                Registrar Pago
              </button>
            </div>

            {showPayment && (
              <form onSubmit={registerPayment} className="card p-5 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 animate-fade-in">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label>Monto a Pagar</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required 
                      value={paymentData.amount} 
                      onChange={e => setPaymentData({...paymentData, amount: parseFloat(e.target.value)})} 
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label>Método de Pago</label>
                    <select 
                      value={paymentData.method} 
                      onChange={e => setPaymentData({...paymentData, method: e.target.value})}
                    >
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="TARJETA">Tarjeta</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowPayment(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Pago
                  </button>
                </div>
              </form>
            )}

            {order.payments.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sin pagos registrados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {order.payments.map((p: any) => (
                  <div key={p.id} className="card p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{p.method}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(p.paymentDate).toLocaleDateString('es-AR', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xl text-green-600">
                      ${p.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status history */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-lg text-slate-800">Historial de estado</h3>
            </div>
            {order.statusLogs && order.statusLogs.length > 0 ? (
              <div className="space-y-2">
                {order.statusLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="font-medium text-slate-700">{log.status.replace('_', ' ')}</span>
                    <span className="text-slate-500">
                      {new Date(log.changedAt).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sin cambios registrados</p>
            )}
          </div>
        </div>

        {/* Balance Card - Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4 bg-gradient-to-br from-slate-50 to-slate-100">
            <h3 className="text-slate-600 text-sm font-bold uppercase tracking-wide mb-6">
              Resumen Financiero
            </h3>

            {order.status === 'ENTREGADO' && order.balance > 0 && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Pedido entregado con saldo pendiente
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-600">Total del Pedido</span>
                <span className="font-bold text-lg text-slate-800">
                  ${order.total.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Pagado
                </span>
                <span className="font-bold text-lg text-green-600">
                  ${(order.total - order.balance).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg text-slate-800">Saldo Pendiente</span>
                <span className={`text-3xl font-bold ${
                  order.balance > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${order.balance.toLocaleString()}
                </span>
              </div>
            </div>

            {order.balance > 0 ? (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl text-center shadow-lg">
                <p className="text-sm opacity-90 mb-1">Estado de Pago</p>
                <p className="font-bold text-lg">Pendiente de Cobro</p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl text-center shadow-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold text-lg">Pagado Completamente</p>
              </div>
            )}

            {/* Quick Info */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-semibold">{order.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pagos:</span>
                  <span className="font-semibold">{order.payments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-semibold">{status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

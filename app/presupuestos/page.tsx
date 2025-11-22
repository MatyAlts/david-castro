'use client';

import React, { useState } from 'react';
import { Calculator, Plus, Minus, DollarSign, TrendingUp, Package, FileText } from 'lucide-react';

type CostItem = {
  id: string;
  name: string;
  value: number;
};

export default function BudgetPage() {
  const [quantity, setQuantity] = useState(1000);
  const [paperCost, setPaperCost] = useState(0);
  const [printCost, setPrintCost] = useState(0);
  const [additionalCosts, setAdditionalCosts] = useState<CostItem[]>([]);
  const [markup, setMarkup] = useState(30);

  const addCost = () => {
    setAdditionalCosts([
      ...additionalCosts,
      { id: Date.now().toString(), name: '', value: 0 }
    ]);
  };

  const updateCost = (id: string, field: 'name' | 'value', value: string | number) => {
    setAdditionalCosts(additionalCosts.map(cost => 
      cost.id === id ? { ...cost, [field]: value } : cost
    ));
  };

  const removeCost = (id: string) => {
    setAdditionalCosts(additionalCosts.filter(cost => cost.id !== id));
  };

  const totalBaseCost = paperCost + printCost + additionalCosts.reduce((sum, cost) => sum + cost.value, 0);
  const costPerUnit = quantity > 0 ? totalBaseCost / quantity : 0;
  const pricePerUnit = costPerUnit * (1 + markup / 100);
  const totalPrice = pricePerUnit * quantity;
  const profit = totalPrice - totalBaseCost;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Calculadora de Presupuestos</h1>
        <p className="text-slate-600 text-sm">Calcula costos y precios de venta</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quantity */}
          <div className="card p-6">
            <label className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-lg">Cantidad a Producir</span>
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 100))}
                className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center text-2xl font-bold"
              />
              <button
                onClick={() => setQuantity(quantity + 100)}
                className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Base Costs */}
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Costos Base
            </h3>
            <div className="space-y-4">
              <div>
                <label>Costo de Papel</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={paperCost}
                    onChange={e => setPaperCost(parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label>Costo de Impresión</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={printCost}
                    onChange={e => setPrintCost(parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Costs */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Costos Adicionales</h3>
              <button
                onClick={addCost}
                className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>
            <div className="space-y-3">
              {additionalCosts.map(cost => (
                <div key={cost.id} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={cost.name}
                    onChange={e => updateCost(cost.id, 'name', e.target.value)}
                    placeholder="Concepto (troquelado, barniz...)"
                    className="flex-1"
                  />
                  <div className="relative w-32">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={cost.value}
                      onChange={e => updateCost(cost.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8"
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    onClick={() => removeCost(cost.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {additionalCosts.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-4">
                  Sin costos adicionales
                </p>
              )}
            </div>
          </div>

          {/* Markup */}
          <div className="card p-6">
            <label className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-bold text-lg">Margen de Ganancia</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={markup}
                onChange={e => setMarkup(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-20 text-center">
                <span className="text-2xl font-bold text-green-600">{markup}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-lg text-slate-800">Resultado</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-slate-600 mb-1">Costo Total</p>
                <p className="text-2xl font-bold text-slate-800">
                  ${totalBaseCost.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-slate-600 mb-1">Costo por Unidad</p>
                <p className="text-xl font-bold text-slate-700">
                  ${costPerUnit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-blue-300 shadow-sm">
                <p className="text-xs text-blue-600 mb-1">Precio de Venta Unitario</p>
                <p className="text-xl font-bold text-blue-600">
                  ${pricePerUnit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white shadow-lg">
                <p className="text-xs opacity-90 mb-1">Precio Total de Venta</p>
                <p className="text-3xl font-bold">
                  ${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 shadow-sm">
                <p className="text-xs text-green-700 mb-1">Ganancia Estimada</p>
                <p className="text-2xl font-bold text-green-600">
                  ${profit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-xs text-slate-500 text-center">
                Los cálculos son estimados y deben verificarse según cada caso particular
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

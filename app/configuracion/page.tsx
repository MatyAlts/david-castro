'use client';

import React, { useEffect, useState } from "react";
import { Plus, Trash2, FileText, ListChecks } from "lucide-react";

type Option = { id: string; name: string };

export default function ConfiguracionPage() {
  const [paperTypes, setPaperTypes] = useState<Option[]>([]);
  const [matrixSizes, setMatrixSizes] = useState<Option[]>([]);
  const [paperName, setPaperName] = useState("");
  const [matrixName, setMatrixName] = useState("");

  const loadData = async () => {
    const [papers, matrices] = await Promise.all([
      fetch("/api/config/paper-types").then((r) => r.json()),
      fetch("/api/config/matrix-sizes").then((r) => r.json()),
    ]);
    setPaperTypes(papers || []);
    setMatrixSizes(matrices || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperName) return;
    await fetch("/api/config/paper-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: paperName }),
    });
    setPaperName("");
    loadData();
  };

  const addMatrix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matrixName) return;
    await fetch("/api/config/matrix-sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: matrixName }),
    });
    setMatrixName("");
    loadData();
  };

  const removePaper = async (id: string) => {
    await fetch("/api/config/paper-types", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  const removeMatrix = async (id: string) => {
    await fetch("/api/config/matrix-sizes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2">Configuración</h1>
        <p className="text-slate-600 text-sm">
          Administra listas predefinidas para tipos de papel y medidas de matriz. Estos valores se usan como dropdowns en productos y presupuestos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-800">Tipos de papel</h3>
          </div>
          <form onSubmit={addPaper} className="flex gap-2 mb-4">
            <input
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              placeholder="Ej. Ilustración 150g"
              className="flex-1"
              required
            />
            <button type="submit" className="btn-primary">
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </form>
          <div className="space-y-2">
            {paperTypes.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-slate-700">{p.name}</span>
                <button
                  type="button"
                  onClick={() => removePaper(p.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {paperTypes.length === 0 && <p className="text-sm text-slate-500">Sin opciones cargadas</p>}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-800">Medidas de matriz</h3>
          </div>
          <form onSubmit={addMatrix} className="flex gap-2 mb-4">
            <input
              value={matrixName}
              onChange={(e) => setMatrixName(e.target.value)}
              placeholder="Ej. 50x70"
              className="flex-1"
              required
            />
            <button type="submit" className="btn-primary">
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </form>
          <div className="space-y-2">
            {matrixSizes.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-slate-700">{m.name}</span>
                <button
                  type="button"
                  onClick={() => removeMatrix(m.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {matrixSizes.length === 0 && <p className="text-sm text-slate-500">Sin opciones cargadas</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

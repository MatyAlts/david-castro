import React from 'react';

type StatusBadgeProps = {
  status: 'SOLICITADO' | 'EN_IMPRENTA' | 'TERMINADO' | 'ENTREGADO';
  size?: 'sm' | 'md';
};

const statusConfig = {
  SOLICITADO: {
    label: 'Solicitado',
    colors: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  EN_IMPRENTA: {
    label: 'En Imprenta',
    colors: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  TERMINADO: {
    label: 'Terminado',
    colors: 'bg-green-100 text-green-700 border-green-200',
  },
  ENTREGADO: {
    label: 'Entregado',
    colors: 'bg-purple-100 text-purple-700 border-purple-200',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border transition-all ${sizeClasses} ${config.colors}`}
    >
      {config.label}
    </span>
  );
}

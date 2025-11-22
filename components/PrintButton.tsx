
'use client';

import React from 'react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
    >
      Imprimir / PDF
    </button>
  );
}

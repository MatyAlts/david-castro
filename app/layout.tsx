'use client';

import React, { useState } from "react";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Package, ShoppingCart, Menu, Calculator, X, FileText, Settings } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard", shortLabel: "Dash" },
    { href: "/pedidos", icon: ShoppingCart, label: "Pedidos", shortLabel: "Pedidos" },
    { href: "/clientes", icon: Users, label: "Clientes", shortLabel: "Clientes" },
    { href: "/productos", icon: Package, label: "Productos", shortLabel: "Prods" },
    { href: "/presupuestos", icon: Calculator, label: "Presupuestos", shortLabel: "Presu" },
    { href: "/configuracion", icon: Settings, label: "Configuración", shortLabel: "Config" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <html lang="es">
      <head>
        <title>Imprenta Manager</title>
        <meta name="description" content="Sistema de gestión de imprenta" />
      </head>
      <body className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile Header */}
        <header className="md:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            <span className="font-bold text-lg">Imprenta</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMobileMenuOpen(false)}>
            <nav 
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 no-print"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-bold text-xl text-slate-800">Menú</h2>
              </div>
              <ul className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          active 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" /> {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}

        {/* Sidebar Navigation (Desktop) */}
        <nav className="hidden md:block bg-gradient-to-b from-slate-900 to-slate-800 text-slate-300 w-64 min-h-screen flex-shrink-0 shadow-xl no-print">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none">Imprenta</h1>
                <p className="text-xs text-slate-400">Manager</p>
              </div>
            </div>
          </div>
          <ul className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                      active 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'hover:bg-slate-700/50 hover:translate-x-1'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      active ? '' : 'group-hover:scale-110 transition-transform'
                    }`} /> 
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Nav Bottom Bar */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around py-2 z-50 shadow-lg no-print">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
                  active 
                    ? 'text-blue-600 scale-110' 
                    : 'text-slate-500'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

import React from 'react';
import { useSavia } from '../context/SaviaContext';
import { ShoppingBag, UserCheck, ShieldCheck, RefreshCw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    logoutAdmin,
    cart,
    setIsCartOpen,
    resetAllData,
  } = useSavia();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-[#184D3E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Brand title, single element in display serif font */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#184D3E] group-hover:text-[#E85D04] transition-colors">
                Savia Viva
              </span>
            </button>
            <span className="hidden lg:inline text-xs text-[#184D3E]/60 italic font-serif border-l border-[#184D3E]/20 pl-3">
              Vitalidad pura desde la raíz
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'auth'
                  ? 'bg-[#184D3E] text-white shadow-sm'
                  : 'text-[#184D3E]/80 hover:text-[#184D3E] hover:bg-[#184D3E]/5'
              }`}
            >
              1. CRM & Perfiles
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#184D3E] text-white shadow-sm'
                  : 'text-[#184D3E]/80 hover:text-[#184D3E] hover:bg-[#184D3E]/5'
              }`}
            >
              2. Catálogo & Tienda
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#184D3E] text-white shadow-sm'
                  : 'text-[#184D3E]/80 hover:text-[#184D3E] hover:bg-[#184D3E]/5'
              }`}
            >
              3. Métricas & Reportes
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Admin Status & Cart Trigger) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin status indicator or link to Admin login */}
            {currentUser.role === 'admin' ? (
              <div className="flex items-center gap-1.5 bg-[#184D3E] text-white px-2.5 py-1.5 rounded-lg border border-[#F4A261]/30 text-xs shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4A261]" />
                <span className="font-semibold text-[11px] hidden sm:inline">Admin: SANTIAGO</span>
                <button
                  onClick={logoutAdmin}
                  className="ml-1 text-[10px] bg-white/20 hover:bg-white/30 text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  title="Cerrar sesión de Administrador"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#184D3E]/80 hover:text-[#184D3E] hover:bg-[#184D3E]/5 border border-[#184D3E]/15 transition-colors cursor-pointer"
                title="Acceder como Administrador SANTIAGO"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E85D04]" />
                <span>Acceso Admin</span>
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 rounded-lg bg-[#184D3E] text-white hover:bg-[#123b2f] transition-all cursor-pointer shadow-xs"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E85D04] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F8F6F0] animate-scale">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Reset mock data button */}
            <button
              onClick={resetAllData}
              title="Restablecer datos demo"
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-[#184D3E]/60 hover:text-[#184D3E] hover:bg-[#184D3E]/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

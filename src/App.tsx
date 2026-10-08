import React from 'react';
import { SaviaProvider, useSavia } from './context/SaviaContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Tab1AuthCRM } from './components/Tab1AuthCRM';
import { Tab2Catalog } from './components/Tab2Catalog';
import { Tab3Dashboard } from './components/Tab3Dashboard';
import { PrefacturaModal } from './components/PrefacturaModal';
import { CheckCircle, Info, AlertTriangle, AlertCircle, Sparkles, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    toasts,
    currentPrefactura,
    closePrefacturaModal,
  } = useSavia();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#184D3E]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'auth' && <Tab1AuthCRM />}
        {activeTab === 'catalog' && <Tab2Catalog />}
        {activeTab === 'dashboard' && <Tab3Dashboard />}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Colombian Proforma / Prefactura Modal */}
      <PrefacturaModal
        isOpen={!!currentPrefactura}
        onClose={closePrefacturaModal}
        data={currentPrefactura}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl shadow-lg border text-xs font-medium animate-slide-up transition-all ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : toast.type === 'info'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-[#184D3E] border-[#184D3E] text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0 text-blue-600" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 text-[#F4A261]" />
            )}
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="no-print bg-[#184D3E] text-white/80 py-10 border-t border-[#184D3E]/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                Savia Viva
              </span>
              <span className="text-xs text-[#F4A261] italic font-serif">
                Vitalidad pura desde la raíz · Bogotá D.C., Colombia
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/70">
              <span>Prensado en frío a 4°C</span>
              <span>·</span>
              <span>Botellas de vidrio retornable</span>
              <span>·</span>
              <span>Pesos Colombianos (COP)</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
            <p>© {new Date().getFullYear()} Savia Viva S.A.S. - NIT 901.482.019-3. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1">
              <span>Nutrición celular viva para el cuerpo y la mente</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SaviaProvider>
      <MainContent />
    </SaviaProvider>
  );
}

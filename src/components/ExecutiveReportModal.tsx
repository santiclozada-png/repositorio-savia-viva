import React from 'react';
import { Product, SaleOrder } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: SaleOrder[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
}) => {
  if (!isOpen) return null;

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const averageTicket = orders.length ? Math.round(totalSales / orders.length) : 0;
  const uniqueBuyers = new Set(orders.map((o) => o.customerEmail.toLowerCase())).size;
  const totalPhysicalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  // Category breakdown
  const lineSales: Record<string, { count: number; total: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((it) => {
      const line = it.line || 'Detox';
      if (!lineSales[line]) lineSales[line] = { count: 0, total: 0 };
      lineSales[line].count += it.quantity;
      lineSales[line].total += it.unitPrice * it.quantity;
    });
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl space-y-8 border border-[#184D3E]/20 text-[#184D3E] max-h-[92vh] overflow-y-auto">
        {/* Actions bar (hidden in print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-[#184D3E]/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E85D04]">
              Vista Previa de Informe Ejecutivo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#184D3E] text-white rounded-lg text-xs font-semibold hover:bg-[#123b2f] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#184D3E]/60 hover:text-[#184D3E] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT AREA */}
        <div className="space-y-6 printable-document">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b-2 border-[#184D3E] pb-6 gap-4">
            <div>
              <div className="font-serif text-3xl font-bold tracking-tight text-[#184D3E]">
                Savia Viva
              </div>
              <p className="text-xs italic text-[#184D3E]/70 font-serif">
                Vitalidad pura desde la raíz · Jugos Prensados en Frío & Botánicos
              </p>
              <p className="text-[11px] text-[#184D3E]/60 mt-1">
                NIT 901.482.019-3 · Bogotá D.C., Colombia
              </p>
            </div>
            <div className="text-left sm:text-right text-xs">
              <div className="font-bold text-[#184D3E] uppercase tracking-wider">
                Informe Ejecutivo de Ventas & Inventario
              </div>
              <div className="text-[#184D3E]/70 mt-0.5">
                Emisión: {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
              <div className="font-mono text-[11px] text-[#184D3E]/60">
                Folio: SV-REP-{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>

          {/* Executive KPI Summary */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#184D3E] border-b border-[#184D3E]/10 pb-1">
              1. Resumen Ejecutivo de Indicadores Clave (KPIs)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10">
                <span className="text-[10px] text-[#184D3E]/70 uppercase block">Ventas Brutas Totales</span>
                <span className="font-mono text-lg font-bold text-[#184D3E]">{formatCurrency(totalSales)}</span>
              </div>
              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10">
                <span className="text-[10px] text-[#184D3E]/70 uppercase block">Ticket Promedio / Pedido</span>
                <span className="font-mono text-lg font-bold text-[#E85D04]">{formatCurrency(averageTicket)}</span>
              </div>
              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10">
                <span className="text-[10px] text-[#184D3E]/70 uppercase block">Clientes Compradores</span>
                <span className="font-mono text-lg font-bold text-[#184D3E]">{uniqueBuyers} usuarios</span>
              </div>
              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10">
                <span className="text-[10px] text-[#184D3E]/70 uppercase block">Inventario Físico</span>
                <span className="font-mono text-lg font-bold text-[#184D3E]">{totalPhysicalUnits} unidades</span>
              </div>
            </div>
          </div>

          {/* Sales by Line */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#184D3E] border-b border-[#184D3E]/10 pb-1">
              2. Consolidado por Línea de Bebida Funcional
            </h4>
            <table className="w-full text-xs text-left border border-[#184D3E]/10 rounded-lg overflow-hidden">
              <thead className="bg-[#184D3E] text-white">
                <tr>
                  <th className="p-2.5">Línea Funcional</th>
                  <th className="p-2.5 text-center">Unidades Despachadas</th>
                  <th className="p-2.5 text-right">Monto Total Facturado</th>
                  <th className="p-2.5 text-right">% de Ventas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#184D3E]/10">
                {Object.entries(lineSales).map(([line, val]) => {
                  const share = totalSales > 0 ? Math.round((val.total / totalSales) * 100) : 0;
                  return (
                    <tr key={line}>
                      <td className="p-2.5 font-bold text-[#184D3E]">{line}</td>
                      <td className="p-2.5 text-center font-mono">{val.count} botellas</td>
                      <td className="p-2.5 text-right font-mono font-semibold">{formatCurrency(val.total)}</td>
                      <td className="p-2.5 text-right font-mono">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Inventory Snapshot */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#184D3E] border-b border-[#184D3E]/10 pb-1">
              3. Existencias en Bodega y Almacenamiento a 4°C
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {products.map((p) => (
                <div key={p.id} className="p-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/10">
                  <div className="font-bold text-[#184D3E] truncate">{p.name}</div>
                  <div className="text-[10px] text-[#184D3E]/60">{p.volume} · {p.line}</div>
                  <div className="font-mono text-sm font-bold text-[#184D3E] mt-1">{p.stock} uds</div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Log */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#184D3E] border-b border-[#184D3E]/10 pb-1">
              4. Registro Detallado de Transacciones Comerciales
            </h4>
            <table className="w-full text-xs text-left border border-[#184D3E]/10">
              <thead className="bg-[#184D3E]/10 text-[#184D3E]">
                <tr>
                  <th className="p-2">ID Pedido</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Valor</th>
                  <th className="p-2">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#184D3E]/10">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="p-2 font-mono font-bold text-[#184D3E]">{o.id}</td>
                    <td className="p-2">{o.customerName}</td>
                    <td className="p-2 text-[#184D3E]/70">{formatDate(o.date)}</td>
                    <td className="p-2 font-mono font-bold">{formatCurrency(o.total)}</td>
                    <td className="p-2">
                      <span className="text-[10px] font-semibold text-[#184D3E] bg-[#184D3E]/10 px-2 py-0.5 rounded">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legal and Signatures */}
          <div className="pt-8 border-t border-[#184D3E]/20 flex justify-between items-end text-xs text-[#184D3E]/70">
            <div>
              <p className="font-semibold text-[#184D3E]">Savia Viva S.A.S. - Control de Calidad y Finanzas</p>
              <p className="text-[10px]">Certificación Prensado en Frío y Buenas Prácticas de Manufactura.</p>
            </div>
            <div className="text-center w-48 border-t border-[#184D3E]/40 pt-1">
              <span className="text-[10px] uppercase tracking-wider block">Firma Dirección General</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

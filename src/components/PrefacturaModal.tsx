import React from 'react';
import { CartItem, SaleOrder } from '../types';
import { formatCurrency, formatDate, amountToWordsCOP } from '../utils/formatters';
import { Printer, Download, X, CheckCircle2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export interface PrefacturaData {
  orderId: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDocumentType?: string;
  customerDocumentNumber?: string;
  shippingAddress: string;
  city?: string;
  paymentMethod: string;
  items: {
    productId: string;
    productName: string;
    volume?: string;
    quantity: number;
    unitPrice: number;
    originalPrice?: number;
    discountPercent?: number;
    isCombo?: boolean;
    line?: string;
  }[];
  subtotal: number;
  discountAmount?: number;
  tax: number;
  total: number;
  notes?: string;
  isDraft?: boolean; // True if previewing directly from active cart before placing order
}

interface PrefacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrefacturaData | null;
  onConfirmOrder?: () => void; // If called from cart to finish purchase
}

export const PrefacturaModal: React.FC<PrefacturaModalProps> = ({
  isOpen,
  onClose,
  data,
  onConfirmOrder,
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const fidelityPointsEarned = Math.round(data.total / 1000);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl border border-[#184D3E]/20 text-[#184D3E] max-h-[94vh] overflow-y-auto">
        {/* Interactive Bar (No Print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#184D3E]/15">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#E85D04]/10 text-[#E85D04] rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-[#184D3E]">
                {data.isDraft ? 'Modelo de Prefactura Comercial (Borrador de Compra)' : 'Prefactura de Venta / Factura de Pedido'}
              </h3>
              <p className="text-[11px] text-[#184D3E]/70">
                Documento de liquidación comercial oficial en Pesos Colombianos (COP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#184D3E] text-white rounded-xl text-xs font-semibold hover:bg-[#123b2f] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4 text-[#F4A261]" />
              <span>Imprimir / PDF</span>
            </button>

            {data.isDraft && onConfirmOrder && (
              <button
                onClick={() => {
                  onConfirmOrder();
                  onClose();
                }}
                className="px-4 py-2 bg-[#E85D04] text-white rounded-xl text-xs font-semibold hover:bg-[#d05303] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Confirmar y Liquidar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-[#184D3E]/60 hover:text-[#184D3E] hover:bg-[#184D3E]/5 rounded-xl transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FORMAL COLOMBIAN PRE-INVOICE DOCUMENT AREA (PRINTABLE)         */}
        {/* ============================================================== */}
        <div className="space-y-6 printable-document bg-white p-2 sm:p-4 text-xs">
          {/* Header row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b-2 border-[#184D3E]">
            {/* Issuer Information */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#184D3E]">
                  Savia Viva S.A.S.
                </span>
              </div>
              <p className="text-[11px] font-serif italic text-[#E85D04]">
                Vitalidad pura desde la raíz · Jugos Prensados en Frío
              </p>
              <div className="text-[11px] text-[#184D3E]/80 space-y-0.5 pt-1">
                <p><strong>NIT:</strong> 901.482.019-3 · IVA Régimen Común</p>
                <p><strong>Dirección:</strong> Cra. 7 # 116-50, BioPark Bodega 4</p>
                <p><strong>Ciudad:</strong> Bogotá D.C. - Colombia</p>
                <p><strong>PBX:</strong> +57 (601) 745 8820 · <strong>WhatsApp:</strong> +57 312 458 9021</p>
                <p><strong>Email:</strong> facturacion@saviaviva.com</p>
              </div>
            </div>

            {/* Document Box */}
            <div className="bg-[#F8F6F0] p-4 rounded-xl border border-[#184D3E]/20 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#E85D04]">
                  {data.isDraft ? 'PRE-LIQUIDACIÓN COMERCIAL' : 'DOCUMENTO OFICIAL DE VENTA'}
                </div>
                <div className="font-serif text-xl font-bold text-[#184D3E]">
                  PREFACTURA DE VENTA
                </div>
                <div className="font-mono text-sm font-bold text-[#184D3E] mt-0.5">
                  No. {data.invoiceNumber || `PRE-FACT-2026-${data.orderId.replace(/[^0-9]/g, '')}`}
                </div>
              </div>

              <div className="pt-2 border-t border-[#184D3E]/10 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#184D3E]/70">Fecha Expedición:</span>
                  <span className="font-mono font-semibold">{formatDate(data.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#184D3E]/70">Vencimiento Oferta:</span>
                  <span className="font-mono font-semibold">15 días a partir de la fecha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#184D3E]/70">Medio de Pago:</span>
                  <span className="font-semibold text-[#E85D04]">{data.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer / Acquirer Information */}
          <div className="bg-[#F8F6F0]/60 p-4 rounded-xl border border-[#184D3E]/15">
            <h4 className="font-bold text-[#184D3E] uppercase text-[10px] tracking-wider mb-2 border-b border-[#184D3E]/10 pb-1 flex items-center justify-between">
              <span>Datos del Cliente / Adquirente</span>
              <span className="text-[#184D3E]/60 font-mono">ID Ref: {data.orderId}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#184D3E]/70 block">Nombre / Razón Social:</span>
                <span className="font-semibold text-[#184D3E] text-sm">{data.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#184D3E]/70 block">Identificación:</span>
                <span className="font-mono font-semibold text-[#184D3E]">
                  {data.customerDocumentType || 'CC'} No. {data.customerDocumentNumber || '1.020.765.432'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#184D3E]/70 block">Correo Electrónico:</span>
                <span className="font-medium text-[#184D3E]">{data.customerEmail}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#184D3E]/70 block">Dirección de Despacho:</span>
                <span className="font-medium text-[#184D3E]">{data.shippingAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#184D3E]/70 block">Ciudad / Departamento:</span>
                <span className="font-medium text-[#184D3E]">{data.city || 'Bogotá D.C., Colombia'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#184D3E]/70 block">Teléfono de Contacto:</span>
                <span className="font-mono text-[#184D3E]">{data.customerPhone || '+57 312 458 9021'}</span>
              </div>
            </div>
          </div>

          {/* Detailed Itemized Table */}
          <div className="overflow-x-auto rounded-xl border border-[#184D3E]/15">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#184D3E] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold text-center w-8">#</th>
                  <th className="py-2.5 px-3 font-semibold">Código / Descripción del Producto</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Cant.</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Vr. Unitario (COP)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Desc. Promo</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Subtotal</th>
                  <th className="py-2.5 px-3 font-semibold text-right">IVA (19%)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Total Ítem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#184D3E]/10">
                {data.items.map((item, idx) => {
                  const lineSubtotal = item.unitPrice * item.quantity;
                  const lineTax = Math.round(lineSubtotal * 0.19);
                  const lineTotal = lineSubtotal + lineTax;
                  const discountPerUnit = item.originalPrice ? item.originalPrice - item.unitPrice : 0;
                  const totalDiscount = discountPerUnit * item.quantity;

                  return (
                    <tr key={idx} className="hover:bg-[#F8F6F0]/40 transition-colors">
                      <td className="py-2.5 px-3 text-center text-[#184D3E]/60 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#184D3E] flex items-center gap-1.5">
                          <span>{item.productName}</span>
                          {item.isCombo && (
                            <span className="bg-[#E85D04] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                              COMBO PROMO
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#184D3E]/60 font-mono">
                          Ref: {item.productId} · {item.volume || 'Botella Vidrio'} · Línea {item.line || 'Botánica'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#E85D04]">
                        {totalDiscount > 0 ? `-${formatCurrency(totalDiscount)}` : '$0'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(lineSubtotal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#184D3E]/70">
                        {formatCurrency(lineTax)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#184D3E]">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculations & Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Notes & Words Section */}
            <div className="space-y-3 p-4 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#184D3E]/70 block">
                  Valor Total en Letras (Moneda Legal Colombiana):
                </span>
                <p className="font-serif font-bold text-xs text-[#184D3E] mt-1 leading-snug">
                  {amountToWordsCOP(data.total)}
                </p>
              </div>

              <div className="pt-2 border-t border-[#184D3E]/10 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#184D3E]">
                  <ShieldCheck className="w-4 h-4 text-[#E85D04]" />
                  <span><strong>Garantía Cold-Pressed:</strong> Mantener refrigerado entre 2°C y 4°C.</span>
                </div>
                <div className="text-[10px] text-[#184D3E]/70">
                  Puntos de Fidelidad Savia Raíz otorgados: <strong className="text-[#E85D04]">+{fidelityPointsEarned} pts</strong>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-white rounded-xl border border-[#184D3E]/15 space-y-2 text-xs">
              <div className="flex justify-between text-[#184D3E]/80">
                <span>Subtotal Base Gravable (Antes de Impuestos):</span>
                <span className="font-mono font-medium">{formatCurrency(data.subtotal)}</span>
              </div>
              {data.discountAmount !== undefined && data.discountAmount > 0 && (
                <div className="flex justify-between text-[#E85D04] font-medium">
                  <span>Descuentos Comerciales & Combos:</span>
                  <span className="font-mono">-{formatCurrency(data.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#184D3E]/80">
                <span>Impuesto sobre las Ventas (IVA 19%):</span>
                <span className="font-mono font-medium">{formatCurrency(data.tax)}</span>
              </div>
              <div className="flex justify-between text-[#184D3E]/60 text-[11px]">
                <span>Flete / Domicilio Refrigerado:</span>
                <span className="font-semibold text-emerald-700">GRATIS (Promoción Activa)</span>
              </div>

              <div className="flex justify-between items-center text-[#184D3E] font-bold text-sm pt-2.5 border-t-2 border-[#184D3E]">
                <span className="uppercase tracking-wider">Total a Pagar (COP):</span>
                <span className="font-mono text-lg text-[#E85D04]">{formatCurrency(data.total)}</span>
              </div>
            </div>
          </div>

          {/* Legal Footnote */}
          <div className="pt-4 border-t border-[#184D3E]/15 text-[10px] text-[#184D3E]/60 space-y-1">
            <p>
              * <strong>Aviso Legal y Tributario:</strong> Este documento constituye una pre-liquidación y prefactura informativa para el cliente, previa a la expedición formal de la Factura Electrónica de Venta con Validación Previa DIAN (Resolución DIAN No. 1876400291-2025). La aceptación de esta cotización autoriza el prensado inmediato y despacho en cadena de frío.
            </p>
            <p>
              * Savia Viva S.A.S. Certificado de Buenas Prácticas de Manufactura en Extracción Hidráulica a 4°C. Botellas 100% de vidrio retornable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

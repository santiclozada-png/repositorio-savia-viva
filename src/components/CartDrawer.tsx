import React, { useState } from 'react';
import { useSavia } from '../context/SaviaContext';
import { formatCurrency } from '../utils/formatters';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FileText,
  Tag,
  CreditCard
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkout,
    currentUser,
    setActiveTab,
    openCartPrefactura,
    orders,
    openOrderPrefactura,
  } = useSavia();

  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+57 312 458 9021');
  const [customerDocumentType, setCustomerDocumentType] = useState(currentUser.documentType || 'CC');
  const [customerDocumentNumber, setCustomerDocumentNumber] = useState(currentUser.documentNumber || '1.020.765.432');
  const [shippingAddress, setShippingAddress] = useState(currentUser.address);
  const [city, setCity] = useState(currentUser.city || 'Bogotá D.C.');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de Crédito');
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalOriginal = cart.reduce((acc, item) => {
    const base = item.product.originalPrice || item.product.price;
    return acc + base * item.quantity;
  }, 0);
  const discountTotal = totalOriginal - subtotal;
  const tax = Math.round(subtotal * 0.19); // IVA 19%
  const total = subtotal + tax;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkout({
      customerName,
      customerEmail,
      customerPhone,
      customerDocumentType,
      customerDocumentNumber,
      address: shippingAddress,
      city,
      paymentMethod,
    });

    if (result.success && result.orderId) {
      setCompletedOrderId(result.orderId);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setCompletedOrderId(null);
  };

  const completedOrder = completedOrderId
    ? orders.find((o) => o.id === completedOrderId)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#F8F6F0] shadow-2xl flex flex-col border-l border-[#184D3E]/15">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#184D3E] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                Bolsa de Vitalidad
              </h2>
              <span className="text-xs bg-[#E85D04] text-white font-medium px-2 py-0.5 rounded-full font-mono">
                {cart.reduce((a, b) => a + b.quantity, 0)} {cart.length === 1 ? 'ítem' : 'ítems'}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {completedOrder ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-[#184D3E]/10 rounded-full flex items-center justify-center mx-auto text-[#184D3E]">
                  <CheckCircle2 className="w-10 h-10 text-[#184D3E]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#184D3E]">
                  ¡Pedido y Factura Confirmados!
                </h3>
                <p className="text-xs sm:text-sm text-[#184D3E]/80 max-w-sm mx-auto">
                  Tu orden <span className="font-mono font-bold text-[#E85D04]">{completedOrder.id}</span> con prefijo comercial <span className="font-mono font-semibold text-[#184D3E]">{completedOrder.invoiceNumber}</span> ha sido liquidada en pesos colombianos.
                </p>

                <div className="p-4 bg-white rounded-xl border border-[#184D3E]/10 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>No. Prefactura:</span>
                    <span className="font-mono font-bold text-[#184D3E]">{completedOrder.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Cliente:</span>
                    <span className="font-semibold text-[#184D3E]">{completedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Identificación:</span>
                    <span className="font-mono text-[#184D3E]">{completedOrder.customerDocumentType} {completedOrder.customerDocumentNumber}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Dirección:</span>
                    <span className="font-medium text-[#184D3E] truncate max-w-[200px]">{completedOrder.shippingAddress}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Método de pago:</span>
                    <span className="font-medium text-[#184D3E]">{completedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 pt-2 border-t border-[#184D3E]/10 font-bold">
                    <span>Total Liquidado (COP):</span>
                    <span className="text-[#E85D04] font-mono text-sm">{formatCurrency(completedOrder.total)}</span>
                  </div>
                </div>

                {/* Direct Prefactura button for completed order */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      if (completedOrder) openOrderPrefactura(completedOrder);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white border-2 border-[#184D3E] text-[#184D3E] font-bold text-xs hover:bg-[#184D3E]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4 text-[#E85D04]" />
                    <span>Ver Prefactura Oficial / Imprimir Comprobante</span>
                  </button>

                  <button
                    onClick={() => {
                      handleClose();
                      setActiveTab('dashboard');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#184D3E] text-white font-medium hover:bg-[#123b2f] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer text-xs"
                  >
                    <span>Ver Métricas en Tablero 3</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#184D3E] hover:bg-[#184D3E]/5 transition-colors cursor-pointer"
                  >
                    Seguir Comprando en el Catálogo
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#184D3E]/10 rounded-full flex items-center justify-center mx-auto text-[#184D3E]/50">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#184D3E]">
                  Tu bolsa está vacía
                </h3>
                <p className="text-xs text-[#184D3E]/70 max-w-xs mx-auto">
                  Agrega extractos de Green Detox, combos promocionales o tónicos funcionales desde el catálogo.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('catalog');
                  }}
                  className="mt-2 py-2 px-4 rounded-lg bg-[#184D3E] text-white text-xs font-semibold hover:bg-[#123b2f] transition-colors inline-block cursor-pointer"
                >
                  Explorar Catálogo & Combos
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#184D3E]/10">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#184D3E]/70">
                      Productos Seleccionados
                    </span>
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-600 hover:text-rose-800 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Vaciar
                    </button>
                  </div>

                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3 bg-white rounded-xl border border-[#184D3E]/10 flex gap-3 shadow-2xs items-center"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg bg-[#F8F6F0] shrink-0 border border-[#184D3E]/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#184D3E] truncate">
                            {product.name}
                          </h4>
                          <span className="font-mono text-xs font-semibold text-[#184D3E] shrink-0">
                            {formatCurrency(product.price * quantity)}
                          </span>
                        </div>

                        {/* Line & Volume badges */}
                        <div className="text-[11px] text-[#184D3E]/70 flex items-center gap-1.5 mt-0.5">
                          <span className="text-[#E85D04] font-medium">{product.line}</span>
                          <span>·</span>
                          <span>{product.volume}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[10px] text-neutral-400 line-through">
                              {formatCurrency(product.originalPrice * quantity)}
                            </span>
                          )}
                        </div>

                        {product.isCombo && product.comboBottlesCount && (
                          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Tag className="w-3 h-3" />
                            <span>Combo {product.comboBottlesCount} botellas ({product.discountPercent}% OFF)</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          {/* Stepper */}
                          <div className="flex items-center border border-[#184D3E]/20 rounded-md bg-[#F8F6F0]">
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-[#184D3E]/10 rounded-l-md transition-colors text-[#184D3E] cursor-pointer"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-xs font-bold text-[#184D3E]">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity + 1)}
                              className="p-1 hover:bg-[#184D3E]/10 rounded-r-md transition-colors text-[#184D3E] cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-[#184D3E]/40 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Eliminar ítem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Simulation Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-[#184D3E]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#184D3E] uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-[#E85D04]" />
                      <span>Datos de Facturación & Envío (COP)</span>
                    </div>

                    {/* Pre-factura preview trigger */}
                    <button
                      type="button"
                      onClick={openCartPrefactura}
                      className="text-[11px] font-bold text-[#E85D04] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Ver modelo de prefactura comercial DIAN"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Prefactura</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[#184D3E]/80 mb-1 font-medium">Nombre Completo / Razón Social</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[#184D3E]/80 mb-1 font-medium">Tipo Doc.</label>
                        <select
                          value={customerDocumentType}
                          onChange={(e) => setCustomerDocumentType(e.target.value)}
                          className="w-full px-2 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                        >
                          <option value="CC">CC</option>
                          <option value="NIT">NIT</option>
                          <option value="CE">CE</option>
                          <option value="Pasaporte">Pasaporte</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[#184D3E]/80 mb-1 font-medium">No. Identificación</label>
                        <input
                          type="text"
                          required
                          value={customerDocumentNumber}
                          onChange={(e) => setCustomerDocumentNumber(e.target.value)}
                          placeholder="Ej: 1.020.765.432"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[#184D3E]/80 mb-1 font-medium">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#184D3E]/80 mb-1 font-medium">Teléfono / WhatsApp</label>
                        <input
                          type="text"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+57 312..."
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[#184D3E]/80 mb-1 font-medium">Dirección de Entrega</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Ej: Calle 85 # 14-22"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#184D3E]/80 mb-1 font-medium">Ciudad</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#184D3E]/80 mb-1 font-medium">Método de Pago</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                      >
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito (Visa / Mastercard / Amex)</option>
                        <option value="PSE / Débito Bancario">PSE / Débito en Línea Colombia</option>
                        <option value="Bancolombia QR / Nequi">Bancolombia QR / Nequi / Daviplata</option>
                        <option value="Contra Entrega">Pago Contra Entrega en Efectivo</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="p-4 bg-white rounded-xl border border-[#184D3E]/10 space-y-2 text-xs">
                    <div className="flex justify-between text-[#184D3E]/80">
                      <span>Subtotal Base (Pesos Colombianos)</span>
                      <span className="font-mono font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountTotal > 0 && (
                      <div className="flex justify-between text-[#E85D04] font-medium">
                        <span>Ahorro en Combos & Promociones</span>
                        <span className="font-mono">-{formatCurrency(discountTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#184D3E]/80">
                      <span>Impuestos (IVA 19%)</span>
                      <span className="font-mono font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-[#184D3E] font-bold text-sm pt-2 border-t border-[#184D3E]/10">
                      <span>Total Liquidado (COP)</span>
                      <span className="font-mono text-[#E85D04] text-base">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={openCartPrefactura}
                      className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#184D3E]/30 text-[#184D3E] font-semibold hover:bg-[#F8F6F0] transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      <FileText className="w-4 h-4 text-[#E85D04]" />
                      <span>Revisar Modelo de Prefactura Comercial</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-[#E85D04] text-white font-semibold hover:bg-[#d05303] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
                    >
                      <span>Simular Finalización de Compra (COP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-[#184D3E]/60 italic">
                    * Genera el consecutivo de factura oficial, descuenta unidades de bodega a 4°C y actualiza el Dashboard en tiempo real.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

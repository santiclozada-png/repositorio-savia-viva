import React, { useState } from 'react';
import { useSavia } from '../context/SaviaContext';
import { Product, ProductLine } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Check,
  Camera,
  Info,
  Droplet,
  HeartPulse,
  Flame,
  Leaf,
  Layers,
  ArrowRight,
  Tag,
  Package,
  Gift,
  FileText
} from 'lucide-react';

const CATEGORIES: { label: string; value: 'All' | ProductLine; badge?: string }[] = [
  { label: 'Todos los Productos', value: 'All' },
  { label: '🔥 Combos & Promos', value: 'Combos', badge: 'Hasta -24%' },
  { label: 'Línea Detox', value: 'Detox' },
  { label: 'Línea Energy', value: 'Energy' },
  { label: 'Línea Wellbeing', value: 'Wellbeing' },
  { label: 'Línea Inmunidad', value: 'Inmunidad' },
];

export const Tab2Catalog: React.FC = () => {
  const {
    products,
    addToCart,
    currentUser,
    updateProductImage,
    setIsCartOpen,
    cart,
    openCartPrefactura,
  } = useSavia();

  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductLine>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.line === selectedCategory;
    const matchesQuery =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.keyBenefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prod.comboItemsSummary && prod.comboItemsSummary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleCardImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateProductImage(productId, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const combosCount = products.filter((p) => p.line === 'Combos').length;

  return (
    <div className="space-y-10 pb-16">
      {/* Brand Hero Showcase */}
      <section className="bg-gradient-to-br from-[#184D3E] via-[#144235] to-[#0e3127] text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm">
        {/* Subtle background ambient rings */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#F4A261]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#E85D04]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#F4A261] bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              <Droplet className="w-3.5 h-3.5 text-[#F4A261]" />
              <span>Prensado en Frío · 40+ Bebidas Vivas a 4°C</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#F8F6F0] bg-[#E85D04] px-3.5 py-1.5 rounded-full">
              <Gift className="w-3.5 h-3.5" />
              <span>{combosCount} Combos & Promociones Activas</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Vitalidad pura desde la raíz
          </h1>

          <p className="text-white/85 text-xs sm:text-base leading-relaxed max-w-2xl">
            Catálogo completo con más de 10 extractos por línea funcional (Detox, Energy, Wellbeing e Inmunidad), además de packs combinados con descuentos especiales en pesos colombianos ($ COP).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-white/90">
              <Check className="w-4 h-4 text-[#F4A261]" />
              <span>Botellas de Vidrio Retornables</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <Check className="w-4 h-4 text-[#F4A261]" />
              <span>0% Azúcar Añadida · 100% Raw</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <Check className="w-4 h-4 text-[#F4A261]" />
              <span>Modelos de Prefactura Comercial</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOTIONAL COMBOS HIGHLIGHT BANNER */}
      {selectedCategory !== 'Combos' && (
        <div className="bg-gradient-to-r from-[#E85D04]/10 via-[#F4A261]/15 to-[#184D3E]/10 p-5 rounded-2xl border border-[#E85D04]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E85D04] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#184D3E]">
                  Packs de Ahorro y Combos Funcionales
                </span>
                <span className="text-[10px] bg-[#E85D04] text-white font-bold px-2 py-0.5 rounded-full">
                  HASTA -24% OFF
                </span>
              </div>
              <p className="text-xs text-[#184D3E]/70 mt-0.5">
                Planes de 3 días, packs semanales para oficina y kits familiares con botellas surtidas cold-pressed.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCategory('Combos')}
            className="px-4 py-2 bg-[#184D3E] text-white text-xs font-semibold rounded-xl hover:bg-[#123b2f] transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Ver Todos los Combos ({combosCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            const count = cat.value === 'All'
              ? products.length
              : products.filter((p) => p.line === cat.value).length;

            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? cat.value === 'Combos'
                      ? 'bg-[#E85D04] text-white shadow-xs'
                      : 'bg-[#184D3E] text-white shadow-xs'
                    : 'bg-white text-[#184D3E]/80 border border-[#184D3E]/10 hover:text-[#184D3E] hover:bg-[#F8F6F0]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#184D3E]/10 text-[#184D3E]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Fast Prefactura Button */}
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              onClick={openCartPrefactura}
              className="px-3 py-2 bg-white text-[#184D3E] border border-[#184D3E]/20 hover:bg-[#F8F6F0] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Ver borrador de prefactura comercial"
            >
              <FileText className="w-3.5 h-3.5 text-[#E85D04]" />
              <span className="hidden sm:inline">Prefactura</span>
            </button>
          )}

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#184D3E]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por jugo, combo o ingrediente..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#184D3E]/15 text-xs text-[#184D3E] placeholder-[#184D3E]/40 focus:outline-none focus:border-[#184D3E] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#184D3E]/10 space-y-3">
          <p className="font-serif text-lg text-[#184D3E]">No se encontraron jugos o combos</p>
          <p className="text-xs text-[#184D3E]/60">Intenta con otro término de búsqueda o categoría.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#184D3E] text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Ver Todo el Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((prod) => {
            const isOutOfStock = prod.stock <= 0;
            const isLowStock = prod.stock > 0 && prod.stock <= 10;
            const isCombo = prod.isCombo || prod.line === 'Combos';

            return (
              <div
                key={prod.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                  isCombo
                    ? 'border-2 border-[#E85D04]/30 ring-1 ring-[#E85D04]/10'
                    : 'border border-[#184D3E]/12'
                }`}
              >
                {/* Image Section */}
                <div className="relative w-full aspect-4/3 bg-[#F8F6F0] overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Fallback container with botanic icon */}
                  <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-4 text-[#184D3E]/40 bg-[#F8F6F0]">
                    <Leaf className="w-12 h-12 stroke-[1.5]" />
                    <span className="font-serif text-xs mt-2">{prod.name}</span>
                  </div>

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[80%]">
                    <span className={`px-2.5 py-1 rounded-md text-white text-[11px] font-semibold tracking-wide shadow-xs ${
                      isCombo ? 'bg-[#E85D04]' : 'bg-[#184D3E]'
                    }`}>
                      {prod.line}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[#184D3E] text-[11px] font-mono font-medium shadow-xs border border-[#184D3E]/10">
                      {prod.volume}
                    </span>
                    {prod.discountPercent && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-0.5">
                        <Tag className="w-3 h-3" />
                        <span>-{prod.discountPercent}% OFF</span>
                      </span>
                    )}
                  </div>

                  {/* Stock Status Pill */}
                  <div className="absolute top-3 right-3">
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-xs">
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#E85D04] text-white text-[10px] font-bold shadow-xs">
                        ¡Últimas {prod.stock}!
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-semibold shadow-xs">
                        {prod.stock} en stock
                      </span>
                    )}
                  </div>

                  {/* Image Replacement Controls */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <label
                      title="Subir o cambiar fotografía de la botella"
                      className="p-2 bg-white/90 hover:bg-white text-[#184D3E] rounded-lg shadow-sm border border-[#184D3E]/10 cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#E85D04]" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleCardImageUpload(e, prod.id)}
                      />
                    </label>

                    <button
                      onClick={() => setDetailProduct(prod)}
                      title="Ver información nutricional y botánica"
                      className="p-2 bg-white/90 hover:bg-white text-[#184D3E] rounded-lg shadow-sm border border-[#184D3E]/10 cursor-pointer transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#184D3E] leading-snug group-hover:text-[#E85D04] transition-colors">
                        {prod.name}
                      </h3>
                      <div className="text-right shrink-0">
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <div className="text-xs text-neutral-400 line-through font-mono">
                            {formatCurrency(prod.originalPrice)}
                          </div>
                        )}
                        <span className="font-mono text-base font-bold text-[#184D3E] block">
                          {formatCurrency(prod.price)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#E85D04] font-medium leading-relaxed">
                      {prod.keyBenefit}
                    </p>

                    {/* Combo included bottles summary */}
                    {prod.comboItemsSummary && (
                      <div className="p-2.5 bg-[#F8F6F0] rounded-xl border border-[#E85D04]/20 text-[11px] text-[#184D3E] space-y-1">
                        <span className="font-bold text-[#E85D04] block uppercase tracking-wider text-[10px]">
                          Contenido del Pack Promocional:
                        </span>
                        <p className="font-medium text-[#184D3E]/90 leading-tight">
                          {prod.comboItemsSummary}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-[#184D3E]/70 line-clamp-2">
                      {prod.description}
                    </p>

                    {/* Ingredients list */}
                    {!prod.comboItemsSummary && (
                      <div className="pt-1">
                        <div className="text-[11px] font-semibold text-[#184D3E]/60 uppercase tracking-wider mb-1">
                          Ingredientes clave:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {prod.ingredients.slice(0, 4).map((ing, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-[#F8F6F0] text-[#184D3E]/80 px-2 py-0.5 rounded border border-[#184D3E]/10"
                            >
                              {ing}
                            </span>
                          ))}
                          {prod.ingredients.length > 4 && (
                            <span className="text-[10px] text-[#184D3E]/60 self-center">
                              +{prod.ingredients.length - 4} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions / Add to Cart */}
                  <div className="pt-3 border-t border-[#184D3E]/10 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-[#184D3E]/60">
                      <span className="font-medium text-[#184D3E]">{prod.calories} Kcal</span>
                      <span className="mx-1">·</span>
                      <span>{prod.sugars}</span>
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                        isOutOfStock
                          ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          : isCombo
                          ? 'bg-[#E85D04] text-white hover:bg-[#d05303] hover:shadow-sm'
                          : 'bg-[#184D3E] text-white hover:bg-[#123b2f] hover:shadow-sm'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Agotado' : isCombo ? 'Agregar Combo' : 'Agregar al Carrito'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOTANICAL CRAFT STORY BANNER */}
      <section className="bg-white rounded-3xl border border-[#184D3E]/10 p-8 sm:p-10 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#184D3E]/10 text-[#184D3E] flex items-center justify-center mx-auto md:mx-0">
            <Droplet className="w-5 h-5 text-[#184D3E]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#184D3E]">Presión Hidráulica a 4°C</h4>
          <p className="text-xs text-[#184D3E]/70 leading-relaxed">
            Sin aspas giratorias ni calor que oxide los fitoquímicos. Extracción lenta gota a gota de vitalidad pura.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center mx-auto md:mx-0">
            <HeartPulse className="w-5 h-5 text-[#E85D04]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#184D3E]">Bio-Disponibilidad Real</h4>
          <p className="text-xs text-[#184D3E]/70 leading-relaxed">
            Nutrientes que entran directo a tu torrente celular en menos de 20 minutos sin sobrecarga estomacal.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 text-[#184D3E] flex items-center justify-center mx-auto md:mx-0">
            <Gift className="w-5 h-5 text-[#184D3E]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#184D3E]">Combos en Pesos Colombianos</h4>
          <p className="text-xs text-[#184D3E]/70 leading-relaxed">
            Planes de renovación y packs semanales liquidados en $ COP con modelo de prefactura formal para clientes.
          </p>
        </div>
      </section>

      {/* MODAL: PRODUCT DETAIL & NUTRITIONAL PROFILE */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#184D3E]/10 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={detailProduct.imageUrl}
                  alt={detailProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-xl border border-[#184D3E]/15"
                />
                <div>
                  <span className="text-xs font-semibold text-[#E85D04] uppercase tracking-wider">
                    Línea {detailProduct.line} · {detailProduct.volume}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#184D3E]">
                    {detailProduct.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDetailProduct(null)}
                className="text-[#184D3E]/60 hover:text-[#184D3E] p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#184D3E]/80 leading-relaxed">
              {detailProduct.description}
            </p>

            {detailProduct.comboItemsSummary && (
              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#E85D04]/20 text-xs">
                <span className="font-bold text-[#E85D04] block mb-1">Detalle del Combo:</span>
                <p className="text-[#184D3E]">{detailProduct.comboItemsSummary}</p>
              </div>
            )}

            <div className="p-4 bg-[#F8F6F0] rounded-2xl border border-[#184D3E]/10 space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#184D3E]">
                Ficha Nutricional Botánica ({detailProduct.volume})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-[#184D3E]/10">
                  <span className="text-[10px] text-[#184D3E]/60 block">Calorías</span>
                  <span className="font-mono font-bold text-sm text-[#184D3E]">{detailProduct.calories} Kcal</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#184D3E]/10">
                  <span className="text-[10px] text-[#184D3E]/60 block">Azúcares</span>
                  <span className="font-mono font-semibold text-xs text-[#184D3E]">{detailProduct.sugars}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#184D3E]/10">
                  <span className="text-[10px] text-[#184D3E]/60 block">Conservantes</span>
                  <span className="font-bold text-xs text-emerald-700">0% Químicos</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#184D3E]/10">
                  <span className="text-[10px] text-[#184D3E]/60 block">Prensado</span>
                  <span className="font-bold text-xs text-[#184D3E]">Frío a 4°C</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#184D3E] uppercase tracking-wider mb-2">
                Ingredientes Botánicos Completos:
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs text-[#184D3E]/80">
                {detailProduct.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#184D3E]/10 flex items-center justify-between">
              <div>
                {detailProduct.originalPrice && detailProduct.originalPrice > detailProduct.price && (
                  <span className="text-xs text-neutral-400 line-through font-mono block">
                    {formatCurrency(detailProduct.originalPrice)}
                  </span>
                )}
                <span className="font-mono font-bold text-xl text-[#184D3E]">
                  {formatCurrency(detailProduct.price)}
                </span>
              </div>
              <button
                onClick={() => {
                  addToCart(detailProduct, 1);
                  setDetailProduct(null);
                  setIsCartOpen(true);
                }}
                disabled={detailProduct.stock <= 0}
                className="px-6 py-3 bg-[#E85D04] text-white font-semibold rounded-xl hover:bg-[#d05303] transition-colors shadow-sm cursor-pointer text-xs flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar a la Bolsa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

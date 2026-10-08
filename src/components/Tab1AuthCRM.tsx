import React, { useState } from 'react';
import { useSavia } from '../context/SaviaContext';
import { Product, ProductLine, Volume } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  ShieldCheck,
  User,
  PlusCircle,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  Sparkles,
  Award,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  PackageCheck,
  FileText,
  Tag,
  Gift
} from 'lucide-react';

const PRESET_BOTTLE_PHOTOS = [
  { name: 'Green Detox (Clorofila)', url: '/src/assets/images/juice_green_detox_1791335442357.jpg' },
  { name: 'Cítrico Vital (Zanahoria/Naranja)', url: '/src/assets/images/juice_citrico_vital_1791335452979.jpg' },
  { name: 'Jengibre Fuego (Cúrcuma/Shot)', url: '/src/assets/images/juice_jengibre_fuego_1791335462452.jpg' },
  { name: 'Berry Balance (Remolacha/Açai)', url: '/src/assets/images/juice_berry_balance_1791335472142.jpg' },
  { name: 'Golden Glow (Piña/Coco)', url: '/src/assets/images/juice_golden_glow_1791335491375.jpg' },
  { name: 'Pack Combo Crate (Surtido)', url: '/src/assets/images/combo_detox_pack_1791336870555.jpg' },
  { name: 'Púrpura Elixir (Açai/Uva)', url: '/src/assets/images/juice_purple_elixir_1791336881494.jpg' },
];

export const Tab1AuthCRM: React.FC = () => {
  const {
    currentUser,
    loginAdmin,
    logoutAdmin,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductImage,
    orders,
    addToCart,
    setActiveTab,
    setIsCartOpen,
    openOrderPrefactura,
  } = useSavia();

  // Admin Login state (Only SANTIAGO / 345678)
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  // Admin New Product Form state
  const [newProductName, setNewProductName] = useState('');
  const [newLine, setNewLine] = useState<ProductLine>('Detox');
  const [newVolume, setNewVolume] = useState<Volume>('500ml');
  const [newPrice, setNewPrice] = useState<number>(18000);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(0);
  const [newDiscountPercent, setNewDiscountPercent] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(20);
  const [newBenefit, setNewBenefit] = useState('');
  const [newIngredients, setNewIngredients] = useState('');
  const [newComboSummary, setNewComboSummary] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCalories, setNewCalories] = useState<number>(115);
  const [newSugars, setNewSugars] = useState('8g (origen natural)');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/juice_green_detox_1791335442357.jpg');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Replace Image Modal State
  const [imageChangeProduct, setImageChangeProduct] = useState<Product | null>(null);
  const [replacementImageUrl, setReplacementImageUrl] = useState('');

  // Handle Admin Login submission
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError('');
    const result = loginAdmin(adminUser, adminPass);
    if (result.success) {
      setAdminUser('');
      setAdminPass('');
    } else {
      setAdminAuthError(result.message || 'Usuario o contraseña de administrador incorrectos.');
    }
  };

  // Handle New Product submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const parsedIngredients = newIngredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const isCombo = newLine === 'Combos';

    addProduct({
      name: newProductName,
      line: newLine,
      volume: newVolume,
      price: Number(newPrice),
      originalPrice: newOriginalPrice > 0 ? Number(newOriginalPrice) : undefined,
      discountPercent: newDiscountPercent > 0 ? Number(newDiscountPercent) : undefined,
      isCombo,
      comboItemsSummary: isCombo ? newComboSummary : undefined,
      stock: Number(newStock),
      initialStock: Number(newStock),
      keyBenefit: newBenefit || (isCombo ? 'Pack promocional con ahorro especial' : 'Vitalidad pura y equilibrio celular'),
      ingredients: parsedIngredients.length ? parsedIngredients : ['Frutas frescas', 'Extractos botánicos'],
      description: newDescription || 'Prensado en frío a 4°C para máxima conservación de nutrientes.',
      calories: Number(newCalories),
      sugars: newSugars,
      imageUrl: newImageUrl,
      featured: false,
    });

    // Reset form
    setNewProductName('');
    setNewBenefit('');
    setNewIngredients('');
    setNewComboSummary('');
    setNewDescription('');
    setNewPrice(18000);
    setNewOriginalPrice(0);
    setNewDiscountPercent(0);
    setNewStock(20);
  };

  // Handle image upload from computer file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'replace') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'new') {
            setNewImageUrl(reader.result);
          } else {
            setReplacementImageUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Edit save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      line: editingProduct.line,
      volume: editingProduct.volume,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      discountPercent: editingProduct.discountPercent ? Number(editingProduct.discountPercent) : undefined,
      comboItemsSummary: editingProduct.comboItemsSummary,
      stock: Number(editingProduct.stock),
      keyBenefit: editingProduct.keyBenefit,
      description: editingProduct.description,
    });
    setEditingProduct(null);
  };

  // Filter orders for buyer history
  const clientOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role === 'admin'
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Brand Hero for CRM */}
      <div className="bg-[#184D3E] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#F4A261] bg-white/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Módulo de Control y CRM</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Autenticación y Gestión de Perfiles
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Cambia entre el perfil administrativo (gestión integral de catálogo, combos e inventario) y el perfil cliente (experiencia de compra, prefacturas oficiales e historial de pedidos).
          </p>
        </div>
      </div>

      {/* SECTION 1: ACCESO Y GESTIÓN DE PERFILES */}
      <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#184D3E]/10">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#184D3E]">
              1. Control de Acceso & Perfil Activo
            </h2>
            <p className="text-xs sm:text-sm text-[#184D3E]/70 mt-0.5">
              Estado de sesión: <span className="font-bold text-[#184D3E] capitalize">{currentUser.name}</span> ({currentUser.role === 'admin' ? 'Administrador Autorizado' : 'Cliente (Entrada Directa)'})
            </p>
          </div>

          {currentUser.role === 'admin' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-[#184D3E] text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#F4A261]" />
                <span>Sesión Admin Activa: SANTIAGO</span>
              </span>
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 bg-[#E85D04] text-white text-xs font-semibold rounded-xl hover:bg-[#d05303] transition-colors cursor-pointer"
              >
                Cerrar Sesión Admin
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Acceso Directo como Cliente</span>
              </span>
            </div>
          )}
        </div>

        {/* Portal de Acceso Administrador (Solo si no es admin) */}
        {currentUser.role !== 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 bg-[#F8F6F0] rounded-xl p-5 border border-[#184D3E]/10 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E85D04]" />
                <h3 className="font-serif text-base font-bold text-[#184D3E]">
                  Portal de Acceso Administrador (SANTIAGO)
                </h3>
              </div>
              <p className="text-xs text-[#184D3E]/70">
                Los clientes ingresan directamente sin usuario ni contraseña. Para gestionar inventarios, crear productos y configurar combos, ingresa con las credenciales de administrador autorizadas:
              </p>

              {adminAuthError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminAuthError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLoginSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Usuario Administrador</label>
                  <input
                    type="text"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="SANTIAGO"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-medium focus:outline-none focus:border-[#184D3E]"
                  />
                </div>
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#184D3E]/60 italic">
                    Acceso exclusivo para el administrador del sistema.
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#184D3E] text-white font-semibold rounded-lg hover:bg-[#123b2f] transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F4A261]" />
                    <span>Ingresar como Administrador</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Informative Security Box */}
            <div className="bg-white p-5 rounded-xl border border-[#184D3E]/10 space-y-3 text-xs">
              <h4 className="font-semibold text-[#184D3E] uppercase tracking-wider text-[11px]">
                Credenciales de Seguridad
              </h4>
              <div className="p-3 rounded-lg bg-[#184D3E]/5 border border-[#184D3E]/10 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-[#184D3E]">
                  <span>Administrador</span>
                  <span className="text-[10px] bg-[#184D3E] text-white px-1.5 py-0.5 rounded font-mono">Privado</span>
                </div>
                <div className="text-[#184D3E]/90 text-[11px]">
                  <strong>Usuario:</strong> <span className="font-mono bg-white px-1 rounded border border-[#184D3E]/10">SANTIAGO</span>
                </div>
                <div className="text-[#184D3E]/90 text-[11px]">
                  <strong>Contraseña:</strong> <span className="font-mono bg-white px-1 rounded border border-[#184D3E]/10">345678</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                <strong>Modo Cliente:</strong> Entrada libre y directa sin contraseña para compras, catálogo y puntos.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: DYNAMIC DASHBOARD ACCORDING TO ACTIVE ROLE */}
      {currentUser.role === 'admin' ? (
        /* ================= ADMIN MODULE ================= */
        <div className="space-y-8">
          <div className="flex items-center gap-2 border-b border-[#184D3E]/10 pb-3">
            <ShieldCheck className="w-6 h-6 text-[#184D3E]" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#184D3E]">
                Panel de Control: Administrador de Operaciones
              </h2>
              <p className="text-xs text-[#184D3E]/70">
                Alta de nuevos jugos prensados, combos promocionales, actualización de inventarios y control de fotografías.
              </p>
            </div>
          </div>

          {/* Form: Add New Product / Combo */}
          <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#E85D04]" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#184D3E]">
                Cargar Nuevo Producto o Combo al Catálogo
              </h3>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Nombre del Jugo / Combo *</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Ej: Cúrcuma Sunrise o Pack Vital"
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                  />
                </div>

                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Línea Funcional *</label>
                  <select
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value as ProductLine)}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                  >
                    <option value="Detox">Línea Detox (Depuración & Alcalinidad)</option>
                    <option value="Energy">Línea Energy (Cítricos & Vigor)</option>
                    <option value="Wellbeing">Línea Wellbeing (Bienestar & Digestión)</option>
                    <option value="Inmunidad">Línea Inmunidad (Defensas & Tónicos)</option>
                    <option value="Combos">🔥 Combos & Promociones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Volumen / Formato *</label>
                  <select
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value as Volume)}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                  >
                    <option value="350ml">350ml (Tónico / Shot diario)</option>
                    <option value="500ml">500ml (Formato Completo)</option>
                    <option value="Pack 3 Días">Pack 3 Días (Protocolo Detox)</option>
                    <option value="Pack Semanal">Pack Semanal (5 Botellas)</option>
                    <option value="Dúo Vital">Dúo Vital (2 a 3 Botellas)</option>
                    <option value="Pack Familiar">Pack Familiar (12 Botellas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Precio Venta COP *</label>
                  <input
                    type="number"
                    required
                    min={5000}
                    step={100}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-mono focus:outline-none focus:border-[#184D3E]"
                  />
                </div>

                {newLine === 'Combos' && (
                  <>
                    <div>
                      <label className="block text-[#184D3E]/80 font-medium mb-1">Precio Original (Antes)</label>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={newOriginalPrice}
                        onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                        placeholder="Ej: 120000"
                        className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-mono focus:outline-none focus:border-[#184D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#184D3E]/80 font-medium mb-1">% Descuento Promocional</label>
                      <input
                        type="number"
                        min={0}
                        max={90}
                        value={newDiscountPercent}
                        onChange={(e) => setNewDiscountPercent(Number(e.target.value))}
                        placeholder="Ej: 20"
                        className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-mono focus:outline-none focus:border-[#184D3E]"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Stock Inicial (Uds) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-mono focus:outline-none focus:border-[#184D3E]"
                  />
                </div>

                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Calorías (Kcal)</label>
                  <input
                    type="number"
                    value={newCalories}
                    onChange={(e) => setNewCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-mono focus:outline-none focus:border-[#184D3E]"
                  />
                </div>

                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Beneficio Clave</label>
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Ej: Activa metabolismo y digestión"
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                  />
                </div>
              </div>

              {newLine === 'Combos' && (
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Resumen de Botellas Incluidas en el Combo *</label>
                  <input
                    type="text"
                    value={newComboSummary}
                    onChange={(e) => setNewComboSummary(e.target.value)}
                    placeholder="Ej: 3x Green Detox (500ml) + 2x Jengibre Fuego (350ml)"
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#E85D04]/40 text-[#184D3E] focus:outline-none focus:border-[#E85D04]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#184D3E]/80 font-medium mb-1">Ingredientes Principales (separados por coma)</label>
                <input
                  type="text"
                  value={newIngredients}
                  onChange={(e) => setNewIngredients(e.target.value)}
                  placeholder="Ej: Piña oro miel, Jengibre fresco, Cúrcuma, Limón, Miel silvestre"
                  className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                />
              </div>

              <div>
                <label className="block text-[#184D3E]/80 font-medium mb-1">Descripción Nutricional & Proceso</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ej: Extraído mediante prensa hidráulica en frío sin calor para conservar el 100% de la vitamina C viva..."
                  className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
                />
              </div>

              {/* Photo Selector */}
              <div className="p-4 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10 space-y-3">
                <label className="block text-[#184D3E] font-bold">
                  Fotografía de Botella o Combo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {PRESET_BOTTLE_PHOTOS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setNewImageUrl(preset.url)}
                      className={`relative rounded-lg overflow-hidden border-2 p-1 bg-white text-left transition-all cursor-pointer ${
                        newImageUrl === preset.url
                          ? 'border-[#E85D04] ring-2 ring-[#E85D04]/30'
                          : 'border-transparent hover:border-[#184D3E]/30'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-16 object-cover rounded"
                      />
                      <span className="block text-[9px] font-medium text-[#184D3E] truncate mt-1">
                        {preset.name}
                      </span>
                      {newImageUrl === preset.url && (
                        <div className="absolute top-2 right-2 bg-[#E85D04] text-white p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="O pega una URL de imagen personalizada"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#184D3E]/20 text-[#184D3E] focus:outline-none"
                    />
                  </div>
                  <div className="shrink-0 w-full sm:w-auto">
                    <label className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 bg-white border border-[#184D3E]/20 rounded-lg text-[#184D3E] font-medium hover:bg-neutral-50 transition-colors cursor-pointer">
                      <ImageIcon className="w-4 h-4 text-[#E85D04]" />
                      <span>Subir archivo local</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'new')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E85D04] text-white font-semibold rounded-xl hover:bg-[#d05303] transition-colors shadow-sm cursor-pointer flex items-center gap-2 text-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar en Inventario y Catálogo</span>
                </button>
              </div>
            </form>
          </div>

          {/* Table: Inventory Management */}
          <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#184D3E]">
                  Inventario Activo de Jugos y Combos
                </h3>
                <p className="text-xs text-[#184D3E]/70">
                  {products.length} referencias activas · {products.reduce((a, b) => a + b.stock, 0)} unidades físicas totales
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#184D3E]/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#184D3E] text-white">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Foto</th>
                    <th className="py-3 px-4 font-semibold">Producto / Combo</th>
                    <th className="py-3 px-4 font-semibold">Línea & Vol.</th>
                    <th className="py-3 px-4 font-semibold">Precio (COP)</th>
                    <th className="py-3 px-4 font-semibold">Stock Actual</th>
                    <th className="py-3 px-4 font-semibold">Estado</th>
                    <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#184D3E]/10">
                  {products.map((prod) => {
                    const isOutOfStock = prod.stock <= 0;
                    const isLowStock = prod.stock > 0 && prod.stock <= 10;
                    return (
                      <tr key={prod.id} className="hover:bg-[#F8F6F0]/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="relative group w-12 h-12 rounded-lg overflow-hidden border border-[#184D3E]/15 bg-[#F8F6F0]">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => {
                                setImageChangeProduct(prod);
                                setReplacementImageUrl(prod.imageUrl);
                              }}
                              title="Reemplazar foto"
                              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#184D3E] text-sm flex items-center gap-1.5">
                            <span>{prod.name}</span>
                            {prod.isCombo && (
                              <span className="text-[9px] bg-[#E85D04] text-white px-1.5 py-0.2 rounded font-bold">
                                COMBO
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#184D3E]/60 truncate max-w-xs">{prod.keyBenefit}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-[#184D3E]">{prod.line}</span>
                          <span className="text-[#184D3E]/60 ml-1">· {prod.volume}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#184D3E]">
                          {formatCurrency(prod.price)}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#184D3E]">{prod.stock}</span>
                            <span className="text-[#184D3E]/50">uds</span>
                            <div className="flex items-center gap-0.5 ml-1">
                              <button
                                onClick={() => updateProduct(prod.id, { stock: Math.max(0, prod.stock - 1) })}
                                className="w-5 h-5 bg-[#184D3E]/10 hover:bg-[#184D3E]/20 rounded text-[10px] flex items-center justify-center font-bold cursor-pointer"
                                title="Restar 1 unidad"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateProduct(prod.id, { stock: prod.stock + 5 })}
                                className="w-5 h-5 bg-[#184D3E]/10 hover:bg-[#184D3E]/20 rounded text-[10px] flex items-center justify-center font-bold cursor-pointer"
                                title="Sumar 5 unidades"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                              Agotado
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              Stock Bajo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Disponible
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setImageChangeProduct(prod);
                                setReplacementImageUrl(prod.imageUrl);
                              }}
                              className="p-1.5 text-[#184D3E]/70 hover:text-[#184D3E] hover:bg-[#184D3E]/10 rounded-lg transition-colors cursor-pointer"
                              title="Cambiar Foto"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 text-[#184D3E]/70 hover:text-[#184D3E] hover:bg-[#184D3E]/10 rounded-lg transition-colors cursor-pointer"
                              title="Editar Datos"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Seguro que deseas eliminar "${prod.name}" del catálogo?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar Producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= BUYER / CLIENT MODULE ================= */
        <div className="space-y-8">
          <div className="flex items-center gap-2 border-b border-[#184D3E]/10 pb-3">
            <User className="w-6 h-6 text-[#E85D04]" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#184D3E]">
                Módulo Comprador: Perfil, Fidelidad & Facturación
              </h2>
              <p className="text-xs text-[#184D3E]/70">
                Consulta tus puntos de vitalidad acumulados, datos de despacho, modelos de prefactura y tus compras anteriores.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#184D3E] text-white flex items-center justify-center font-serif text-xl font-bold shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#184D3E]">{currentUser.name}</h3>
                  <span className="text-xs text-[#E85D04] font-medium">Miembro Savia Raíz</span>
                </div>
              </div>

              <div className="space-y-3 text-xs pt-3 border-t border-[#184D3E]/10">
                <div className="flex items-center gap-2 text-[#184D3E]/80">
                  <span className="font-semibold text-[#184D3E] w-24">Documento:</span>
                  <span className="font-mono">{currentUser.documentType || 'CC'} {currentUser.documentNumber || '1.020.765.432'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#184D3E]/80">
                  <span className="font-semibold text-[#184D3E] w-24">Email:</span>
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#184D3E]/80">
                  <span className="font-semibold text-[#184D3E] w-24">Teléfono:</span>
                  <span>{currentUser.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-[#184D3E]/80">
                  <MapPin className="w-4 h-4 text-[#184D3E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#184D3E]">Dirección de Entrega</div>
                    <div>{currentUser.address}</div>
                    <div className="text-[11px] text-[#184D3E]/60">{currentUser.city}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveTab('catalog');
                  }}
                  className="w-full py-2.5 bg-[#184D3E] text-white text-xs font-semibold rounded-xl hover:bg-[#123b2f] transition-colors cursor-pointer text-center"
                >
                  Ir al Catálogo de Jugos
                </button>
              </div>
            </div>

            {/* Loyalty & Rewards Box */}
            <div className="lg:col-span-2 bg-[#184D3E] text-white rounded-2xl p-6 sm:p-7 shadow-sm space-y-5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#F4A261]" />
                  <h3 className="font-serif text-xl font-bold">
                    Programa de Fidelidad "Savia Raíz"
                  </h3>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#F4A261]">
                  Nivel: {currentUser.fidelityTier}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-xs text-white/70 block">Puntos Disponibles</span>
                  <span className="font-mono text-3xl font-bold text-[#F4A261]">{currentUser.fidelityPoints}</span>
                  <span className="text-[10px] text-white/60 block mt-1">+1 punto por cada $1.000 COP</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-xs text-white/70 block">Próximo Nivel</span>
                  <span className="font-serif text-lg font-bold text-white">Roble Supremo</span>
                  <span className="text-[10px] text-white/60 block mt-1">Faltan 80 pts para envíos gratis</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-xs text-white/70 block">Beneficio Activo</span>
                  <span className="font-serif text-lg font-bold text-[#F4A261]">10% OFF</span>
                  <span className="text-[10px] text-white/60 block mt-1">En planes detox mensuales</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-white/80">
                  <span>Progreso hacia Nivel Roble</span>
                  <span className="font-mono">92%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E85D04] rounded-full w-[92%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Purchase History WITH PREFACTURA BUTTON */}
          <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#184D3E]">
                  Historial de Pedidos y Prefacturas
                </h3>
                <p className="text-xs text-[#184D3E]/70">
                  Transacciones registradas con número de orden y comprobante oficial en pesos colombianos.
                </p>
              </div>
            </div>

            {clientOrders.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#184D3E]/60">
                Aún no tienes pedidos registrados en este dispositivo.
              </div>
            ) : (
              <div className="space-y-3">
                {clientOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-[#184D3E]">{order.id}</span>
                        <span className="text-[#184D3E]/40">·</span>
                        <span className="font-mono text-[#E85D04] font-semibold">
                          {order.invoiceNumber || `PRE-FACT-2026-00${order.id.replace(/[^0-9]/g, '')}`}
                        </span>
                        <span className="text-[#184D3E]/40">·</span>
                        <span className="text-[#184D3E]/70">{formatDate(order.date)}</span>
                        <span className="bg-[#184D3E]/10 text-[#184D3E] font-medium text-[10px] px-2 py-0.5 rounded">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[#184D3E]/80">
                        {order.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')}
                      </div>
                      <div className="text-[11px] text-[#184D3E]/60">
                        Pago: {order.paymentMethod} · Envío: {order.shippingAddress} ({order.city || 'Bogotá'})
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#184D3E]/10">
                      <div className="text-right">
                        <span className="text-[10px] text-[#184D3E]/60 block">Total Liquidado</span>
                        <span className="font-mono font-bold text-sm text-[#E85D04]">
                          {formatCurrency(order.total)}
                        </span>
                      </div>

                      {/* VER PREFACTURA BUTTON */}
                      <button
                        onClick={() => openOrderPrefactura(order)}
                        className="px-3 py-2 bg-white border border-[#184D3E]/20 text-[#184D3E] rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1.5 font-medium cursor-pointer shadow-2xs"
                        title="Ver modelo formal de prefactura"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#E85D04]" />
                        <span>Ver Prefactura</span>
                      </button>

                      <button
                        onClick={() => {
                          order.items.forEach((item) => {
                            const p = products.find((prod) => prod.id === item.productId);
                            if (p) addToCart(p, item.quantity);
                          });
                          setIsCartOpen(true);
                        }}
                        className="px-3 py-2 bg-[#184D3E] text-white rounded-lg hover:bg-[#123b2f] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Repetir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT DETAILS */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#184D3E]/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#184D3E]/10">
              <h3 className="font-serif text-lg font-bold text-[#184D3E]">
                Editar Producto: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-[#184D3E]/60 hover:text-[#184D3E] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#184D3E]/80 font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Línea</label>
                  <select
                    value={editingProduct.line}
                    onChange={(e) => setEditingProduct({ ...editingProduct, line: e.target.value as ProductLine })}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E]"
                  >
                    <option value="Detox">Detox</option>
                    <option value="Energy">Energy</option>
                    <option value="Wellbeing">Wellbeing</option>
                    <option value="Inmunidad">Inmunidad</option>
                    <option value="Combos">Combos & Promociones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Volumen</label>
                  <select
                    value={editingProduct.volume}
                    onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value as Volume })}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E]"
                  >
                    <option value="350ml">350ml</option>
                    <option value="500ml">500ml</option>
                    <option value="Pack 3 Días">Pack 3 Días</option>
                    <option value="Pack Semanal">Pack Semanal</option>
                    <option value="Dúo Vital">Dúo Vital</option>
                    <option value="Pack Familiar">Pack Familiar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Precio Venta (COP)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E] font-mono"
                  />
                </div>
              </div>

              {editingProduct.line === 'Combos' && (
                <div>
                  <label className="block text-[#184D3E]/80 font-medium mb-1">Detalle de Botellas del Combo</label>
                  <input
                    type="text"
                    value={editingProduct.comboItemsSummary || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, comboItemsSummary: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#184D3E]/80 font-medium mb-1">Beneficio Clave</label>
                <input
                  type="text"
                  value={editingProduct.keyBenefit}
                  onChange={(e) => setEditingProduct({ ...editingProduct, keyBenefit: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E]"
                />
              </div>

              <div>
                <label className="block text-[#184D3E]/80 font-medium mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#184D3E]/20 rounded-lg text-[#184D3E] hover:bg-neutral-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#184D3E] text-white font-semibold rounded-lg hover:bg-[#123b2f] cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPLACE IMAGE FOR PRODUCT */}
      {imageChangeProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#184D3E]/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#184D3E]/10">
              <h3 className="font-serif text-lg font-bold text-[#184D3E]">
                Cambiar Fotografía de Botella: {imageChangeProduct.name}
              </h3>
              <button
                onClick={() => setImageChangeProduct(null)}
                className="text-[#184D3E]/60 hover:text-[#184D3E] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={replacementImageUrl || imageChangeProduct.imageUrl}
                  alt="Vista previa"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-xl border border-[#184D3E]/20 bg-[#F8F6F0]"
                />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-[#184D3E]">Vista Previa Actual</div>
                  <p className="text-[#184D3E]/70">
                    Selecciona una fotografía botánica o carga una nueva imagen desde tu equipo.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[#184D3E]/80 font-bold mb-2">Seleccionar de la Galería:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_BOTTLE_PHOTOS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setReplacementImageUrl(preset.url)}
                      className={`p-1 rounded-lg border text-left transition-all cursor-pointer ${
                        replacementImageUrl === preset.url
                          ? 'border-[#E85D04] ring-2 ring-[#E85D04]/30'
                          : 'border-[#184D3E]/20 hover:border-[#184D3E]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-14 object-cover rounded"
                      />
                      <span className="block text-[10px] text-[#184D3E] truncate mt-1">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#184D3E]/80 font-medium mb-1">O subir archivo de imagen:</label>
                <label className="flex items-center justify-center gap-2 p-2.5 bg-[#F8F6F0] border border-dashed border-[#184D3E]/30 rounded-lg text-[#184D3E] font-medium hover:bg-[#184D3E]/5 cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-[#E85D04]" />
                  <span>Explorar archivo en dispositivo...</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'replace')}
                  />
                </label>
              </div>

              <div>
                <label className="block text-[#184D3E]/80 font-medium mb-1">O pegar URL directa:</label>
                <input
                  type="text"
                  value={replacementImageUrl}
                  onChange={(e) => setReplacementImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#F8F6F0] rounded-lg border border-[#184D3E]/20 text-[#184D3E]"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#184D3E]/10">
                <button
                  type="button"
                  onClick={() => {
                    updateProductImage(imageChangeProduct.id, '/src/assets/images/juice_green_detox_1791335442357.jpg');
                    setImageChangeProduct(null);
                  }}
                  className="text-xs text-[#E85D04] hover:underline cursor-pointer"
                >
                  Restablecer
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageChangeProduct(null)}
                    className="px-4 py-2 border border-[#184D3E]/20 rounded-lg text-[#184D3E] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (replacementImageUrl) {
                        updateProductImage(imageChangeProduct.id, replacementImageUrl);
                      }
                      setImageChangeProduct(null);
                    }}
                    className="px-5 py-2 bg-[#184D3E] text-white font-semibold rounded-lg hover:bg-[#123b2f] cursor-pointer"
                  >
                    Guardar Foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

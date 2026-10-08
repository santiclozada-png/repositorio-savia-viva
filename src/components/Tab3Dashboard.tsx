import React, { useState, useMemo } from 'react';
import { useSavia } from '../context/SaviaContext';
import { ProductLine } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/formatters';
import { ExecutiveReportModal } from './ExecutiveReportModal';
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Tag
} from 'lucide-react';

export const Tab3Dashboard: React.FC = () => {
  const { products, orders, openOrderPrefactura } = useSavia();

  const [searchOrder, setSearchOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completado' | 'Enviado' | 'Preparando'>('All');
  const [timeframe, setTimeframe] = useState<'diario' | 'semanal' | 'mensual'>('diario');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // 1. KPI Calculations
  const totalPhysicalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const activeReferencesCount = products.length;
  
  const uniqueBuyers = useMemo(() => {
    const emails = orders.map((o) => o.customerEmail.toLowerCase().trim());
    return new Set(emails).size;
  }, [orders]);

  const totalSalesRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const averageTicket = orders.length > 0 ? Math.round(totalSalesRevenue / orders.length) : 0;

  // 2. Bar Chart: Sales by Line/Category
  const categorySales = useMemo(() => {
    const lines: Record<ProductLine, { bottles: number; revenue: number; color: string }> = {
      Detox: { bottles: 0, revenue: 0, color: '#184D3E' },
      Energy: { bottles: 0, revenue: 0, color: '#E85D04' },
      Wellbeing: { bottles: 0, revenue: 0, color: '#F4A261' },
      Inmunidad: { bottles: 0, revenue: 0, color: '#2A7B62' },
      Combos: { bottles: 0, revenue: 0, color: '#D9381E' },
    };

    orders.forEach((ord) => {
      ord.items.forEach((item) => {
        const line = (item.line as ProductLine) || 'Detox';
        if (lines[line]) {
          lines[line].bottles += item.quantity;
          lines[line].revenue += item.unitPrice * item.quantity;
        }
      });
    });

    const maxRevenue = Math.max(...Object.values(lines).map((l) => l.revenue), 1);

    return { lines, maxRevenue };
  }, [orders]);

  // 3. Line Chart / Sales Trends
  const salesTrendData = useMemo(() => {
    // Sort orders chronologically
    const sorted = [...orders].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sorted.length === 0) return [];

    return sorted.map((o, idx) => ({
      index: idx,
      id: o.id,
      invoiceNumber: o.invoiceNumber,
      date: formatDate(o.date),
      total: o.total,
      customer: o.customerName,
    }));
  }, [orders]);

  // 4. Donut Chart: Inventory Availability Distribution
  const inventoryStatusData = useMemo(() => {
    let highStock = 0; // > 15
    let lowStock = 0;  // 1 - 15
    let outOfStock = 0; // 0

    products.forEach((p) => {
      if (p.stock <= 0) outOfStock++;
      else if (p.stock <= 15) lowStock++;
      else highStock++;
    });

    const total = products.length || 1;
    return {
      high: { count: highStock, pct: Math.round((highStock / total) * 100), label: 'Stock Alto (>15 uds)', color: '#184D3E' },
      low: { count: lowStock, pct: Math.round((lowStock / total) * 100), label: 'Stock Bajo (1-15 uds)', color: '#E85D04' },
      out: { count: outOfStock, pct: Math.round((outOfStock / total) * 100), label: 'Agotado (0 uds)', color: '#D9381E' },
      totalProducts: products.length,
    };
  }, [products]);

  // Filtered orders table
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
      (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(searchOrder.toLowerCase())) ||
      o.customerName.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(searchOrder.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const exportRows = orders.flatMap((o) =>
      o.items.map((it) => ({
        'No. Prefactura': o.invoiceNumber || `PRE-FACT-2026-00${o.id.replace(/[^0-9]/g, '')}`,
        'ID Pedido': o.id,
        'Fecha y Hora': formatDate(o.date),
        'Cliente': o.customerName,
        'Documento Cliente': `${o.customerDocumentType || 'CC'} ${o.customerDocumentNumber || '1.020.765.432'}`,
        'Email Cliente': o.customerEmail,
        'Teléfono': o.customerPhone || '+57 312 458 9021',
        'Producto': it.productName,
        'Línea': it.line,
        'Cantidad': it.quantity,
        'Precio Unitario COP': it.unitPrice,
        'Subtotal Item COP': it.unitPrice * it.quantity,
        'Descuento Pedido COP': o.discountAmount || 0,
        'Subtotal Base COP': o.subtotal,
        'IVA 19% COP': o.tax,
        'Total Facturado COP': o.total,
        'Método de Pago': o.paymentMethod,
        'Dirección Despacho': o.shippingAddress,
        'Ciudad': o.city || 'Bogotá D.C.',
        'Estado': o.status,
      }))
    );

    exportToCSV(`Savia_Viva_Facturacion_Ventas_${new Date().toISOString().slice(0, 10)}`, exportRows);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Executive Header */}
      <div className="bg-[#184D3E] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#F4A261] bg-white/10 px-3 py-1 rounded-full">
            <Activity className="w-3.5 h-3.5" />
            <span>Consola de Inteligencia y Operaciones</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Dashboard Ejecutivo & Métricas
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Monitoreo en tiempo real de ingresos en pesos colombianos ($ COP), rotación de botellas y combos, demanda por línea funcional y modelos de prefactura comercial.
          </p>
        </div>

        {/* Export Buttons in Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 bg-white text-[#184D3E] font-semibold text-xs rounded-xl hover:bg-[#F8F6F0] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#E85D04]" />
            <span>Descargar Informe en PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-[#E85D04] text-white font-semibold text-xs rounded-xl hover:bg-[#d05303] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Informe en Excel (.csv)</span>
          </button>
        </div>
      </div>

      {/* 1. TARJETAS DE MÉTRICAS CLAVE (KPIS) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Inventario */}
        <div className="bg-white rounded-2xl border border-[#184D3E]/12 p-6 shadow-2xs space-y-3 relative overflow-hidden group hover:border-[#184D3E]/30 transition-colors">
          <div className="flex items-center justify-between text-[#184D3E]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#184D3E]/70">
              Inventario en Bodega
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#184D3E]/10 flex items-center justify-center text-[#184D3E]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-[#184D3E]">
              {totalPhysicalStock} <span className="text-sm font-normal text-[#184D3E]/60">uds</span>
            </div>
            <p className="text-xs text-[#184D3E]/70 mt-1 flex items-center gap-1">
              <span className="font-semibold text-[#184D3E]">{activeReferencesCount}</span>
              <span>referencias activas en catálogo y combos</span>
            </p>
          </div>
          <div className="pt-2 border-t border-[#184D3E]/10 flex items-center justify-between text-[11px] text-[#184D3E]/60">
            <span>En cámaras a 4°C</span>
            <span className="text-emerald-700 font-semibold">100% Fresco</span>
          </div>
        </div>

        {/* KPI 2: Clientes Compradores */}
        <div className="bg-white rounded-2xl border border-[#184D3E]/12 p-6 shadow-2xs space-y-3 relative overflow-hidden group hover:border-[#184D3E]/30 transition-colors">
          <div className="flex items-center justify-between text-[#184D3E]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#184D3E]/70">
              Clientes Compradores
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#E85D04]/10 flex items-center justify-center text-[#E85D04]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-[#184D3E]">
              {uniqueBuyers} <span className="text-sm font-normal text-[#184D3E]/60">únicos</span>
            </div>
            <p className="text-xs text-[#184D3E]/70 mt-1 flex items-center gap-1">
              <span className="font-semibold text-[#E85D04]">{orders.length}</span>
              <span>órdenes comerciales liquidadas</span>
            </p>
          </div>
          <div className="pt-2 border-t border-[#184D3E]/10 flex items-center justify-between text-[11px] text-[#184D3E]/60">
            <span>Tasa de Recompra</span>
            <span className="text-[#184D3E] font-semibold">68% fidelizados</span>
          </div>
        </div>

        {/* KPI 3: Ventas Totales */}
        <div className="bg-white rounded-2xl border border-[#184D3E]/12 p-6 shadow-2xs space-y-3 relative overflow-hidden group hover:border-[#184D3E]/30 transition-colors">
          <div className="flex items-center justify-between text-[#184D3E]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#184D3E]/70">
              Ventas Totales ($ COP)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F4A261]/20 flex items-center justify-center text-[#184D3E]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#184D3E] tracking-tight">
              {formatCurrency(totalSalesRevenue)}
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.6% impulso con combos</span>
            </p>
          </div>
          <div className="pt-2 border-t border-[#184D3E]/10 flex items-center justify-between text-[11px] text-[#184D3E]/60">
            <span>Incluye IVA 19%</span>
            <span className="text-[#184D3E] font-semibold">Pesos Colombianos</span>
          </div>
        </div>

        {/* KPI 4: Promedio de Venta por Pedido */}
        <div className="bg-white rounded-2xl border border-[#184D3E]/12 p-6 shadow-2xs space-y-3 relative overflow-hidden group hover:border-[#184D3E]/30 transition-colors">
          <div className="flex items-center justify-between text-[#184D3E]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#184D3E]/70">
              Ticket Promedio / Pedido
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#184D3E]/10 flex items-center justify-center text-[#184D3E]">
              <TrendingUp className="w-5 h-5 text-[#184D3E]" />
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#E85D04] tracking-tight">
              {formatCurrency(averageTicket)}
            </div>
            <p className="text-xs text-[#184D3E]/70 mt-1 flex items-center gap-1">
              <span>Tracción alta por packs familiares</span>
            </p>
          </div>
          <div className="pt-2 border-t border-[#184D3E]/10 flex items-center justify-between text-[11px] text-[#184D3E]/60">
            <span>Canasta de Bienestar</span>
            <span className="text-[#184D3E] font-semibold">Alta retención</span>
          </div>
        </div>
      </section>

      {/* 2. GRÁFICOS VISUALES E INTERACTIVOS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO 1: BARRAS - Ventas por Categoría */}
        <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#184D3E]" />
                <h3 className="font-serif font-bold text-lg text-[#184D3E]">
                  Ventas por Línea y Combos
                </h3>
              </div>
              <p className="text-xs text-[#184D3E]/60">Facturación acumulada en COP por categoría funcional</p>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="space-y-3 pt-1">
            {(['Detox', 'Energy', 'Wellbeing', 'Inmunidad', 'Combos'] as ProductLine[]).map((cat) => {
              const data = categorySales.lines[cat];
              const percentage = categorySales.maxRevenue > 0
                ? Math.round((data.revenue / categorySales.maxRevenue) * 100)
                : 0;

              return (
                <div
                  key={cat}
                  onMouseEnter={() => setHoveredBar(cat)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="space-y-1 transition-transform"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#184D3E] flex items-center gap-1">
                      <span>{cat}</span>
                      {cat === 'Combos' && (
                        <span className="text-[9px] bg-[#E85D04] text-white px-1.5 py-0.2 rounded font-bold">
                          PROMO
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#184D3E]/60 font-mono">
                        {data.bottles} uds
                      </span>
                      <span className="font-mono font-bold text-[#184D3E]">
                        {formatCurrency(data.revenue)}
                      </span>
                    </div>
                  </div>

                  <div className="h-3 w-full bg-[#F8F6F0] rounded-full overflow-hidden p-0.5 border border-[#184D3E]/10">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(percentage, 5)}%`,
                        backgroundColor: data.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#184D3E]/10 flex items-center justify-between text-[11px] text-[#184D3E]/70">
            <span>Impulso en packs: <strong className="text-[#E85D04]">Combos & Detox</strong></span>
            <span className="text-emerald-700 font-semibold">Mayor rentabilidad</span>
          </div>
        </div>

        {/* GRÁFICO 2: LÍNEAS / TENDENCIAS */}
        <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#E85D04]" />
                <h3 className="font-serif font-bold text-lg text-[#184D3E]">
                  Tendencia de Ventas (COP)
                </h3>
              </div>
              <p className="text-xs text-[#184D3E]/60">Historial secuencial de pedidos y proyección</p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center bg-[#F8F6F0] rounded-lg p-0.5 border border-[#184D3E]/10 text-[10px]">
              {(['diario', 'semanal', 'mensual'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    timeframe === t
                      ? 'bg-[#184D3E] text-white font-bold'
                      : 'text-[#184D3E]/70 hover:text-[#184D3E]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Line Graph */}
          <div className="relative h-44 w-full flex items-end">
            {salesTrendData.length > 1 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#184D3E" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#184D3E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#184D3E" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="300" y2="65" stroke="#184D3E" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="300" y2="110" stroke="#184D3E" strokeOpacity="0.08" strokeDasharray="3 3" />

                {/* Calculate coordinates */}
                {(() => {
                  const maxVal = Math.max(...salesTrendData.map((d) => d.total), 1);
                  const minVal = 0;
                  const pts = salesTrendData.map((d, i) => {
                    const x = (i / (salesTrendData.length - 1)) * 280 + 10;
                    const y = 115 - ((d.total - minVal) / (maxVal - minVal)) * 95;
                    return { x, y, data: d };
                  });

                  const pathD = pts.reduce(
                    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
                    ''
                  );
                  const areaD = `${pathD} L ${pts[pts.length - 1].x} 120 L ${pts[0].x} 120 Z`;

                  return (
                    <>
                      {/* Area Fill */}
                      <path d={areaD} fill="url(#trendGradient)" />

                      {/* Smooth Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#184D3E"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data dots */}
                      {pts.map((pt, i) => (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPoint === i ? 5 : 3.5}
                            fill={hoveredPoint === i ? '#E85D04' : '#184D3E'}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setHoveredPoint(i)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          {hoveredPoint === i && (
                            <g>
                              <rect
                                x={Math.max(10, Math.min(190, pt.x - 50))}
                                y={Math.max(5, pt.y - 34)}
                                width="105"
                                height="26"
                                rx="4"
                                fill="#184D3E"
                              />
                              <text
                                x={Math.max(10, Math.min(190, pt.x - 50)) + 52}
                                y={Math.max(5, pt.y - 34) + 17}
                                textAnchor="middle"
                                fill="#FFFFFF"
                                fontSize="10"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {formatCurrency(pt.data.total)}
                              </text>
                            </g>
                          )}
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            ) : (
              <div className="text-xs text-[#184D3E]/60 text-center w-full py-10">
                Registra compras en la tienda para ver la curva de tendencia.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#184D3E]/10 flex items-center justify-between text-[11px] text-[#184D3E]/70">
            <span>Última orden: <strong>{salesTrendData[salesTrendData.length - 1]?.id || 'N/A'}</strong></span>
            <span className="text-emerald-700 font-bold">Proyección al alza</span>
          </div>
        </div>

        {/* GRÁFICO 3: DONUT - Stock y Disponibilidad */}
        <div className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#F4A261]" />
                <h3 className="font-serif font-bold text-lg text-[#184D3E]">
                  Disponibilidad de Inventario
                </h3>
              </div>
              <p className="text-xs text-[#184D3E]/60">Nivel de existencias según umbral de alerta</p>
            </div>
          </div>

          {/* SVG Donut Chart */}
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#F8F6F0" strokeWidth="12" fill="none" />

                {(() => {
                  const circumference = 2 * Math.PI * 38; // ~238.76
                  const total = inventoryStatusData.totalProducts || 1;

                  const highLen = (inventoryStatusData.high.count / total) * circumference;
                  const lowLen = (inventoryStatusData.low.count / total) * circumference;
                  const outLen = (inventoryStatusData.out.count / total) * circumference;

                  return (
                    <>
                      {highLen > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke={inventoryStatusData.high.color}
                          strokeWidth="12"
                          strokeDasharray={`${highLen} ${circumference}`}
                          strokeDashoffset={0}
                          fill="none"
                        />
                      )}
                      {lowLen > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke={inventoryStatusData.low.color}
                          strokeWidth="12"
                          strokeDasharray={`${lowLen} ${circumference}`}
                          strokeDashoffset={-highLen}
                          fill="none"
                        />
                      )}
                      {outLen > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke={inventoryStatusData.out.color}
                          strokeWidth="12"
                          strokeDasharray={`${outLen} ${circumference}`}
                          strokeDashoffset={-(highLen + lowLen)}
                          fill="none"
                        />
                      )}
                    </>
                  );
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xl font-bold text-[#184D3E]">
                  {inventoryStatusData.totalProducts}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#184D3E]/60 font-semibold">
                  Refs.
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#184D3E]" />
                <span className="text-[#184D3E]/80">{inventoryStatusData.high.label}:</span>
                <span className="font-mono font-bold text-[#184D3E]">{inventoryStatusData.high.count}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E85D04]" />
                <span className="text-[#184D3E]/80">{inventoryStatusData.low.label}:</span>
                <span className="font-mono font-bold text-[#E85D04]">{inventoryStatusData.low.count}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9381E]" />
                <span className="text-[#184D3E]/80">{inventoryStatusData.out.label}:</span>
                <span className="font-mono font-bold text-[#D9381E]">{inventoryStatusData.out.count}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#184D3E]/10 flex items-center justify-between text-[11px] text-[#184D3E]/70">
            <span>Nivel de servicio: <strong className="text-emerald-700">97.8%</strong></span>
            <span>Cámaras frías óptimas</span>
          </div>
        </div>
      </section>

      {/* 3. INFORME DETALLADO DE VENTAS (TABLA DE TRANSACCIONES & PREFACTURAS) */}
      <section className="bg-white rounded-2xl border border-[#184D3E]/10 p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#184D3E]/10">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#184D3E]">
              3. Informe Detallado de Ventas, Facturación & Prefacturas
            </h3>
            <p className="text-xs text-[#184D3E]/70 mt-0.5">
              Registro histórico completo con consecutivo de factura DIAN, medios de pago y acceso a la prefactura de cada orden.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#F8F6F0] p-1 rounded-xl border border-[#184D3E]/10 text-xs">
              {(['All', 'Completado', 'Enviado', 'Preparando'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#184D3E] text-white shadow-xs'
                      : 'text-[#184D3E]/70 hover:text-[#184D3E]'
                  }`}
                >
                  {st === 'All' ? 'Todos' : st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#184D3E]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="Buscar pedido, factura o cliente..."
                className="pl-8 pr-3 py-1.5 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/15 text-xs text-[#184D3E] focus:outline-none focus:border-[#184D3E]"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl border border-[#184D3E]/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#184D3E] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">ID & Prefactura</th>
                <th className="py-3 px-4 font-semibold">Cliente & Documento</th>
                <th className="py-3 px-4 font-semibold">Productos & Combos</th>
                <th className="py-3 px-4 font-semibold">Fecha y Hora</th>
                <th className="py-3 px-4 font-semibold">Valor Total (COP)</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#184D3E]/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#184D3E]/60 text-xs">
                    No se encontraron transacciones con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F8F6F0]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-[#184D3E]">{ord.id}</div>
                      <div className="text-[10px] text-[#E85D04] font-semibold">
                        {ord.invoiceNumber || `PRE-FACT-2026-00${ord.id.replace(/[^0-9]/g, '')}`}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#184D3E]">{ord.customerName}</div>
                      <div className="text-[11px] text-[#184D3E]/60 truncate max-w-[170px]">
                        {ord.customerDocumentType || 'CC'} {ord.customerDocumentNumber || '1.020.765.432'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#184D3E]/90 max-w-[200px] truncate">
                        {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                      <div className="text-[10px] text-[#184D3E]/50 mt-0.5">
                        {ord.items.reduce((a, b) => a + b.quantity, 0)} botellas · {ord.paymentMethod}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#184D3E]/70 font-mono">
                      {formatDate(ord.date)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#E85D04]">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'Completado'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ord.status === 'Enviado'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openOrderPrefactura(ord)}
                        className="px-2.5 py-1.5 bg-[#184D3E]/10 hover:bg-[#184D3E] hover:text-white text-[#184D3E] font-medium text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Ver modelo de prefactura en PDF / imprimir"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#E85D04]" />
                        <span>Prefactura</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary bar */}
        <div className="p-4 bg-[#F8F6F0] rounded-xl border border-[#184D3E]/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#184D3E]/80 gap-2">
          <div>
            Mostrando <strong>{filteredOrders.length}</strong> de <strong>{orders.length}</strong> transacciones comerciales
          </div>
          <div className="flex items-center gap-4">
            <span>Total Liquidado: <strong className="font-mono text-[#E85D04] text-sm">{formatCurrency(filteredOrders.reduce((a, b) => a + b.total, 0))}</strong></span>
          </div>
        </div>
      </section>

      {/* EXECUTIVE REPORT MODAL (PDF / PRINT VIEW) */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        products={products}
        orders={orders}
      />
    </div>
  );
};

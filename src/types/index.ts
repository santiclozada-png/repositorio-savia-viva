export type ProductLine = 'Detox' | 'Energy' | 'Wellbeing' | 'Inmunidad' | 'Combos';
export type Volume = '350ml' | '500ml' | 'Pack 3 Días' | 'Pack Semanal' | 'Dúo Vital' | 'Pack Familiar';

export interface Product {
  id: string;
  name: string;
  line: ProductLine;
  volume: Volume;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  isCombo?: boolean;
  comboBottlesCount?: number;
  comboItemsSummary?: string;
  stock: number;
  initialStock: number;
  ingredients: string[];
  keyBenefit: string;
  description: string;
  calories: number;
  sugars: string;
  imageUrl: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SaleOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  line: ProductLine;
  originalPrice?: number;
  discountPercent?: number;
}

export interface SaleOrder {
  id: string;
  invoiceNumber: string; // Consecutivo de Factura / Prefactura (ej. PRE-FACT-2026-009821)
  customerName: string;
  customerEmail: string;
  customerDocumentType?: string; // CC, NIT, CE, Pasaporte
  customerDocumentNumber?: string;
  customerPhone?: string;
  items: SaleOrderItem[];
  subtotal: number;
  discountAmount?: number;
  tax: number; // IVA 19%
  total: number;
  date: string; // ISO String
  status: 'Completado' | 'Enviado' | 'Preparando';
  shippingAddress: string;
  city?: string;
  paymentMethod: string;
  notes?: string;
}

export interface UserProfile {
  role: 'admin' | 'cliente';
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  documentType: string;
  documentNumber: string;
  fidelityPoints: number;
  fidelityTier: 'Semilla' | 'Brote' | 'Florecer' | 'Roble';
}

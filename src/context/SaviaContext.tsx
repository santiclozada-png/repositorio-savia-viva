import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, SaleOrder, UserProfile } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  DEMO_CLIENT_PROFILE,
  DEMO_ADMIN_PROFILE,
} from '../data/mockData';
import { PrefacturaData } from '../components/PrefacturaModal';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface SaviaContextType {
  activeTab: 'auth' | 'catalog' | 'dashboard';
  setActiveTab: (tab: 'auth' | 'catalog' | 'dashboard') => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: 'admin' | 'cliente') => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductImage: (id: string, imageUrl: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: SaleOrder[];
  checkout: (details: {
    customerName: string;
    customerEmail: string;
    customerDocumentType?: string;
    customerDocumentNumber?: string;
    customerPhone?: string;
    address: string;
    city?: string;
    paymentMethod: string;
    notes?: string;
  }) => { success: boolean; orderId?: string; invoiceNumber?: string; message: string };
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  resetAllData: () => void;
  // Admin authentication (Only SANTIAGO / 345678)
  loginAdmin: (username: string, password: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  // Prefactura viewing
  currentPrefactura: PrefacturaData | null;
  openPrefacturaModal: (data: PrefacturaData) => void;
  closePrefacturaModal: () => void;
  openCartPrefactura: () => void;
  openOrderPrefactura: (order: SaleOrder) => void;
}

const SaviaContext = createContext<SaviaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'savia_viva_products_v3_combos',
  ORDERS: 'savia_viva_orders_v3_combos',
  USER_ROLE: 'savia_viva_role_v3',
  CLIENT_PROFILE: 'savia_viva_client_v3',
};

export const SaviaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'catalog' | 'dashboard'>('catalog');
  const [currentRole, setCurrentRole] = useState<'admin' | 'cliente'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return saved === 'admin' ? 'admin' : 'cliente';
  });

  const [clientProfile, setClientProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENT_PROFILE);
      return saved ? JSON.parse(saved) : DEMO_CLIENT_PROFILE;
    } catch {
      return DEMO_CLIENT_PROFILE;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<SaleOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentPrefactura, setCurrentPrefactura] = useState<PrefacturaData | null>(null);

  // Sync products to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Sync orders to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Sync role to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, currentRole);
  }, [currentRole]);

  // Sync client profile to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENT_PROFILE, JSON.stringify(clientProfile));
  }, [clientProfile]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const currentUser = currentRole === 'admin' ? DEMO_ADMIN_PROFILE : clientProfile;

  const setCurrentUser = (user: UserProfile) => {
    if (user.role === 'cliente') {
      setClientProfile(user);
    }
  };

  const switchRole = (role: 'admin' | 'cliente') => {
    setCurrentRole(role);
    showToast(`Sesión cambiada a perfil: ${role === 'admin' ? 'Administrador' : 'Comprador'}`, 'info');
  };

  const loginAdmin = (username: string, password: string) => {
    const cleanUser = username.trim().toUpperCase();
    if (cleanUser === 'SANTIAGO' && password.trim() === '345678') {
      setCurrentRole('admin');
      showToast('¡Acceso concedido! Bienvenido Administrador SANTIAGO.', 'success');
      return { success: true };
    }
    return {
      success: false,
      message: 'Acceso denegado. Solo el usuario SANTIAGO con su contraseña autorizada puede ingresar como administrador.',
    };
  };

  const logoutAdmin = () => {
    setCurrentRole('cliente');
    showToast('Sesión de Administrador cerrada. Regresando a modo cliente.', 'info');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now().toString(36)}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    showToast(`"${product.name}" agregado con éxito al catálogo y al inventario.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Producto actualizado correctamente.');
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast(`"${product?.name || 'Producto'}" eliminado del inventario.`, 'warning');
  };

  const updateProductImage = (id: string, imageUrl: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, imageUrl } : p))
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, product: { ...item.product, imageUrl } } : item
      )
    );
    showToast('Fotografía de botella actualizada con éxito.');
  };

  const addToCart = (product: Product, qty: number = 1) => {
    if (product.stock <= 0) {
      showToast(`Lo sentimos, "${product.name}" se encuentra agotado.`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + qty;
        if (nextQty > product.stock) {
          showToast(`Stock máximo alcanzado para "${product.name}" (${product.stock} disponibles).`, 'warning');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      } else {
        if (qty > product.stock) {
          showToast(`Solo hay ${product.stock} unidades de "${product.name}".`, 'warning');
          return prev;
        }
        return [...prev, { product, quantity: qty }];
      }
    });

    showToast(`+${qty} "${product.name}" agregado al carrito.`);
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct && qty > targetProduct.stock) {
      showToast(`Solo hay ${targetProduct.stock} unidades disponibles en inventario.`, 'warning');
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Producto retirado del carrito.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = (details: {
    customerName: string;
    customerEmail: string;
    customerDocumentType?: string;
    customerDocumentNumber?: string;
    customerPhone?: string;
    address: string;
    city?: string;
    paymentMethod: string;
    notes?: string;
  }) => {
    if (cart.length === 0) {
      return { success: false, message: 'El carrito está vacío.' };
    }

    // Verify stock
    for (const item of cart) {
      const currentProd = products.find((p) => p.id === item.product.id);
      if (!currentProd || currentProd.stock < item.quantity) {
        return {
          success: false,
          message: `Inventario insuficiente para "${item.product.name}". Disponible: ${currentProd?.stock ?? 0}`,
        };
      }
    }

    // Calculate totals
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountAmount = cart.reduce((acc, item) => {
      if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
        return acc + (item.product.originalPrice - item.product.price) * item.quantity;
      }
      return acc;
    }, 0);

    const tax = Math.round(subtotal * 0.19); // 19% IVA
    const total = subtotal + tax;

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((ci) => ci.product.id === prod.id);
        if (cartItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartItem.quantity),
          };
        }
        return prod;
      })
    );

    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${orderNumber}`;
    const invoiceNumber = `PRE-FACT-2026-00${orderNumber}`;

    const newOrder: SaleOrder = {
      id: orderId,
      invoiceNumber,
      customerName: details.customerName || currentUser.name,
      customerEmail: details.customerEmail || currentUser.email,
      customerDocumentType: details.customerDocumentType || currentUser.documentType || 'CC',
      customerDocumentNumber: details.customerDocumentNumber || currentUser.documentNumber || '1.020.765.432',
      customerPhone: details.customerPhone || currentUser.phone,
      items: cart.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        quantity: ci.quantity,
        unitPrice: ci.product.price,
        originalPrice: ci.product.originalPrice,
        discountPercent: ci.product.discountPercent,
        line: ci.product.line,
      })),
      subtotal,
      discountAmount,
      tax,
      total,
      date: new Date().toISOString(),
      status: 'Completado',
      shippingAddress: details.address || currentUser.address,
      city: details.city || currentUser.city,
      paymentMethod: details.paymentMethod || 'Tarjeta de Crédito',
      notes: details.notes || 'Despacho garantizado en cadena de frío 4°C.',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Award fidelity points if client (1 point per $1000)
    if (currentRole === 'cliente') {
      const pointsEarned = Math.round(total / 1000);
      setClientProfile((prev) => ({
        ...prev,
        fidelityPoints: prev.fidelityPoints + pointsEarned,
      }));
    }

    clearCart();
    setIsCartOpen(false);
    showToast(`¡Pedido ${orderId} confirmado con éxito! Factura ${invoiceNumber} generada.`);

    return {
      success: true,
      orderId,
      invoiceNumber,
      message: 'Orden generada y stock descontado con éxito.',
    };
  };

  // Prefactura helpers
  const openPrefacturaModal = (data: PrefacturaData) => {
    setCurrentPrefactura(data);
  };

  const closePrefacturaModal = () => {
    setCurrentPrefactura(null);
  };

  const openCartPrefactura = () => {
    if (cart.length === 0) {
      showToast('Agrega productos al carrito para ver su prefactura.', 'warning');
      return;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountAmount = cart.reduce((acc, item) => {
      if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
        return acc + (item.product.originalPrice - item.product.price) * item.quantity;
      }
      return acc;
    }, 0);
    const tax = Math.round(subtotal * 0.19);
    const total = subtotal + tax;

    const draftId = `BORR-${Math.floor(1000 + Math.random() * 9000)}`;

    const prefacturaDraft: PrefacturaData = {
      orderId: draftId,
      invoiceNumber: `PRE-FACT-2026-COT-${draftId.replace(/[^0-9]/g, '')}`,
      date: new Date().toISOString(),
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      customerDocumentType: currentUser.documentType || 'CC',
      customerDocumentNumber: currentUser.documentNumber || '1.020.765.432',
      shippingAddress: currentUser.address,
      city: currentUser.city,
      paymentMethod: 'Tarjeta / PSE / Transferencia',
      items: cart.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        volume: ci.product.volume,
        quantity: ci.quantity,
        unitPrice: ci.product.price,
        originalPrice: ci.product.originalPrice,
        discountPercent: ci.product.discountPercent,
        isCombo: ci.product.isCombo,
        line: ci.product.line,
      })),
      subtotal,
      discountAmount,
      tax,
      total,
      isDraft: true,
    };

    setCurrentPrefactura(prefacturaDraft);
  };

  const openOrderPrefactura = (order: SaleOrder) => {
    const prefactura: PrefacturaData = {
      orderId: order.id,
      invoiceNumber: order.invoiceNumber || `PRE-FACT-2026-00${order.id.replace(/[^0-9]/g, '')}`,
      date: order.date,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerDocumentType: order.customerDocumentType || 'CC',
      customerDocumentNumber: order.customerDocumentNumber || '1.020.765.432',
      shippingAddress: order.shippingAddress,
      city: order.city || 'Bogotá D.C., Colombia',
      paymentMethod: order.paymentMethod,
      items: order.items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        originalPrice: it.originalPrice,
        discountPercent: it.discountPercent,
        line: it.line,
      })),
      subtotal: order.subtotal,
      discountAmount: order.discountAmount || 0,
      tax: order.tax,
      total: order.total,
      notes: order.notes,
      isDraft: false,
    };

    setCurrentPrefactura(prefactura);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CLIENT_PROFILE);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setClientProfile(DEMO_CLIENT_PROFILE);
    setCart([]);
    showToast('Catálogo y datos restablecidos con 46 productos y combos.', 'info');
  };

  return (
    <SaviaContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        switchRole,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductImage,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        checkout,
        toasts,
        showToast,
        resetAllData,
        loginAdmin,
        logoutAdmin,
        currentPrefactura,
        openPrefacturaModal,
        closePrefacturaModal,
        openCartPrefactura,
        openOrderPrefactura,
      }}
    >
      {children}
    </SaviaContext.Provider>
  );
};

export const useSavia = () => {
  const context = useContext(SaviaContext);
  if (!context) {
    throw new Error('useSavia must be used within a SaviaProvider');
  }
  return context;
};

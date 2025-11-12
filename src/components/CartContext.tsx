'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

// تعريف الأنواع مباشرة في الملف
interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  descriptionAr: string;
  stock: number;
  images: string[];
  categoryId: string;
  sizes?: string[];
  colors?: string[];
  ageGroup: string;
  gender: string;
  featured: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  attributes?: {
    colors?: string[];
    colorStock?: Record<string, number>;
  };
}

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemQuantity: (productId: string, color?: string) => number;
  getAvailableStock: (product: Product, color?: string) => number;
  createOrder: (orderData: any) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// وظائف Local Storage
function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل السلة من Local Storage عند بداية التطبيق
  useEffect(() => {
    const savedCart = getFromLocalStorage<CartItem[]>('qsr_radi3_cart');
    if (savedCart) {
      setCartItems(savedCart);
    }
    setIsLoaded(true);
  }, []);

  // حفظ السلة في Local Storage عند كل تغيير
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage('qsr_radi3_cart', cartItems);
    }
  }, [cartItems, isLoaded]);

  // إنشاء مفتاح فريد للمنتج مع اللون
  const getItemKey = (productId: string, color?: string) => {
    return color ? `${productId}-${color}` : productId;
  };

  // الحصول على المخزون المتاح للمنتج حسب اللون - مصحح
  const getAvailableStock = (product: Product, color?: string) => {
    if (color && product.attributes?.colorStock) {
      const colorStock = product.attributes.colorStock[color];
      return colorStock !== undefined && colorStock !== null ? colorStock : 0;
    }
    return product.stock || 0;
  };

  // إضافة منتج للسلة - مصحح بالكامل
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const availableStock = getAvailableStock(product, color);
    
    if (availableStock <= 0) {
      toast.error(`المنتج غير متوفر حالياً`);
      return;
    }
    
    if (quantity > availableStock) {
      toast.error(`الكمية المطلوبة غير متوفرة. المتوفر: ${availableStock} قطعة فقط`);
      return;
    }
    
    setCartItems((prevItems) => {
      const itemKey = getItemKey(product.id, color);
      const existingItem = prevItems.find(item => 
        getItemKey(item.product.id, item.color) === itemKey
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > availableStock) {
          toast.error(`الكمية الإجمالية تتجاوز المخزون المتوفر. المتوفر: ${availableStock} قطعة فقط`);
          return prevItems;
        }
        
        const updatedItems = prevItems.map((item) =>
          getItemKey(item.product.id, item.color) === itemKey
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        toast.success(`تم تحديث الكمية إلى ${newQuantity} قطعة`);
        return updatedItems;
      }

      const newItems = [...prevItems, { product, quantity, size, color }];
      toast.success(`تمت إضافة ${product.nameAr} ${color ? `(لون: ${color})` : ''} إلى السلة ✅`);
      return newItems;
    });
  };

  // حذف منتج من السلة
  const removeFromCart = (productId: string, color?: string) => {
    setCartItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => 
        getItemKey(item.product.id, item.color) !== getItemKey(productId, color)
      );
      toast.success('تم حذف المنتج من السلة');
      return filteredItems;
    });
  };

  // تحديث كمية المنتج - مصحح
  const updateQuantity = (productId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }

    // البحث عن المنتج للتحقق من المخزون
    const item = cartItems.find(item => 
      getItemKey(item.product.id, item.color) === getItemKey(productId, color)
    );
    
    if (item) {
      const availableStock = getAvailableStock(item.product, color);
      if (quantity > availableStock) {
        toast.error(`الكمية المطلوبة غير متوفرة. المتوفر: ${availableStock} قطعة فقط`);
        return;
      }
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        getItemKey(item.product.id, item.color) === getItemKey(productId, color)
          ? { ...item, quantity }
          : item
      )
    );
  };

  // الحصول على كمية منتج معين
  const getItemQuantity = (productId: string, color?: string) => {
    const item = cartItems.find(item => 
      getItemKey(item.product.id, item.color) === getItemKey(productId, color)
    );
    return item ? item.quantity : 0;
  };

  // مسح السلة بالكامل
  const clearCart = () => {
    setCartItems([]);
    toast.success('تم تفريغ السلة');
  };

  // حساب المجموع الكلي
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // حساب عدد المنتجات
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // دالة إنشاء الطلب مع دعم الألوان - مصححة
  const createOrder = async (orderData: any) => {
    try {
      console.log('🛒 إنشاء طلب جديد:', orderData);

      // التحقق من المخزون مرة أخرى قبل إنشاء الطلب
      for (const item of orderData.items) {
        const product = item.product;
        const color = item.color;
        const availableStock = getAvailableStock(product, color);
        
        if (item.quantity > availableStock) {
          throw new Error(`الكمية غير متوفرة لـ ${product.nameAr}${color ? ` (لون: ${color})` : ''}. المتوفر: ${availableStock} قطعة`);
        }
      }

      // إضافة معلومات الألوان إلى العناصر
      const itemsWithColors = orderData.items.map((item: any) => ({
        productId: item.product.id,
        productName: item.product.nameAr,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
        color: item.color, // إرسال اللون مع كل عنصر
      }));

      const orderPayload = {
        ...orderData,
        items: itemsWithColors,
      };

      console.log('📦 بيانات الطلب المرسلة:', orderPayload);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'فشل في إنشاء الطلب');
      }

      console.log('✅ تم إنشاء الطلب بنجاح:', responseData);
      return responseData;

    } catch (error: any) {
      console.error('❌ خطأ في إنشاء الطلب:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getItemQuantity,
        getAvailableStock,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

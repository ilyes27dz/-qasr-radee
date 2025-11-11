'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // إضافة منتج للسلة
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCartItems((prevItems) => {
      const itemKey = getItemKey(product.id, color);
      const existingItem = prevItems.find(item => 
        getItemKey(item.product.id, item.color) === itemKey
      );

      if (existingItem) {
        return prevItems.map((item) =>
          getItemKey(item.product.id, item.color) === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { product, quantity, size, color }];
    });
  };

  // حذف منتج من السلة
  const removeFromCart = (productId: string, color?: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => 
        getItemKey(item.product.id, item.color) !== getItemKey(productId, color)
      )
    );
  };

  // تحديث كمية المنتج
  const updateQuantity = (productId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
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
  };

  // حساب المجموع الكلي
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  // حساب عدد المنتجات
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
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

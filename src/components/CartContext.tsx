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
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
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

  // إضافة منتج للسلة
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => 
          item.product.id === product.id && 
          item.size === size && 
          item.color === color
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { product, quantity, size, color }];
    });
  };

  // حذف منتج من السلة
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // تحديث كمية المنتج
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
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

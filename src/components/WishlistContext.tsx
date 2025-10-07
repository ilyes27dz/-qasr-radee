'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  id: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  images?: string[];
  categoryId?: string;
  rating?: number;
  descriptionAr?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // تحميل المفضلة من localStorage عند البداية
  useEffect(() => {
    setMounted(true);
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        console.log('✅ Wishlist loaded:', parsedWishlist.length, 'items');
        setItems(parsedWishlist);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setItems([]);
    }
  }, []);

  // حفظ المفضلة في localStorage عند كل تغيير
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(items));
        console.log('💾 Wishlist saved:', items.length, 'items');
      } catch (error) {
        console.error('Error saving wishlist:', error);
      }
    }
  }, [items, mounted]);

  const addToWishlist = (product: WishlistItem) => {
    setItems((prevItems) => {
      // تحقق من عدم وجود المنتج مسبقاً
      if (prevItems.some(item => item.id === product.id)) {
        console.log('⚠️ Product already in wishlist:', product.id);
        return prevItems;
      }
      console.log('➕ Adding to wishlist:', product.id, product.nameAr);
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prevItems) => {
      const filtered = prevItems.filter(item => item.id !== productId);
      console.log('➖ Removed from wishlist:', productId);
      return filtered;
    });
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    console.log('🗑️ Wishlist cleared');
  };

  const getWishlistCount = () => {
    return items.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

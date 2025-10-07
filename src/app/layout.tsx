import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import { WishlistProvider } from '@/components/WishlistContext';
import { Toaster } from 'react-hot-toast';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata = {
  title: 'قصر الرضيع | متجر ملابس وأدوات الأطفال والرضع',
  description: 'أفضل متجر لملابس وأدوات الأطفال والرضع في الجزائر. توصيل سريع وأسعار منافسة.',
  keywords: 'ملابس أطفال, أدوات رضع, متجر أطفال, قصر الرضيع',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-arabic antialiased bg-white">
        <CartProvider>
          <WishlistProvider>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  fontFamily: 'Cairo, sans-serif',
                },
              }}
            />
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import { WishlistProvider } from '@/components/WishlistContext';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'قصر الرضيع | متجر ملابس وأدوات الأطفال والرضع',
  description: 'أفضل متجر لملابس وأدوات الأطفال والرضع في الجزائر. توصيل سريع وأسعار منافسة.',
  keywords: 'ملابس أطفال, أدوات رضع, متجر أطفال, قصر الرضيع, Baby Palace',
  authors: [{ name: 'قصر الرضيع' }],
  icons: {
    icon: '/LOGO.jpg',
    shortcut: '/LOGO.jpg',
    apple: '/LOGO.jpg',
  },
  openGraph: {
    title: 'قصر الرضيع | Baby Palace',
    description: 'متجر متخصص في ملابس وأدوات الأطفال والرضع في الجزائر',
    images: ['/LOGO.jpg'],
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-arabic antialiased bg-white">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4F053T0WTN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4F053T0WTN');
          `}
        </Script>

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
                  zIndex: 9998,
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
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

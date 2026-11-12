import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from '../components/Providers';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'EarthGlaze • Skincare That Feels Personal',
  description: 'Pure, botanical and artisanal skincare crafted with natural herbs, cold-pressed oils and Ayurvedic wisdom.',
  icons: {
    icon: '/assets/earthglaze-logo-hd.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF7F2',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#FAF7F2] text-[#1E3B2B] font-sans antialiased selection:bg-[#235327] selection:text-white min-h-screen flex flex-col font-normal">
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

import './globals.css';
import { Inter } from 'next/font/google';
import { Montserrat } from 'next/font/google';
const montserrat = Montserrat({ subsets: ['latin'], weight: ['800', '900'] });

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: 'Elmalı Restoran',
  description: 'En lezzetli yemeklerin adresi - Elmalı Restoran',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="overflow-x-hidden">
      <body className={`${inter.variable} antialiased overflow-x-hidden w-full`} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

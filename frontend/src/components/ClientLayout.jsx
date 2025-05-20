"use client";

import { usePathname } from "next/navigation";
import NavigationWrapper from "./NavigationWrapper";
import Footer from "../components/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <NavigationWrapper />
      <main className="flex-grow w-full">
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
} 
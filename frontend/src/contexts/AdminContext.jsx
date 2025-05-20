"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminAccess = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-admin`, {
        withCredentials: true
      });

      if (!response.data.isAdmin) {
        router.push('/auth?message=Lütfen admin hesabıyla giriş yapınız');
        setIsAdmin(false);
        return false;
      }
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error('Admin kontrolü sırasında hata:', error);
      router.push('/auth?message=Lütfen giriş yapınız');
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    const initialCheck = async () => {
      await checkAdminAccess();
      setIsLoading(false);
    };

    initialCheck();

    // Her 5 dakikada bir token kontrolü yap
    const intervalId = setInterval(async () => {
      const isValid = await checkAdminAccess();
      if (!isValid) {
        clearInterval(intervalId);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, checkAdminAccess }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 
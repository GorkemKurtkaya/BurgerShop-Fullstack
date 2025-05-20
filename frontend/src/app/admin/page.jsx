"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-admin`, {
          withCredentials: true
        });

        if (!response.data.isAdmin) {
          router.push('/auth?message=Lütfen admin hesabıyla giriş yapınız');
          return;
        }

        router.push('/admin/dashboard');
      } catch (error) {
        console.error('Admin kontrolü sırasında hata:', error);
        router.push('/auth?message=Lütfen giriş yapınız');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return null;
} 
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const DesktopMenuLinks = () => {
  return (
    <div className="hidden md:flex space-x-4 xl:space-x-6 text-sm lg:text-base">
      <Link href="/" className="text-white font-medium hover:text-orange-200 relative group transition-colors">
        Ana Sayfa
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link href="/menu" className="text-white font-medium hover:text-orange-200 relative group transition-colors">
        Menü
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link href="/hakkimizda" className="text-white font-medium hover:text-orange-200 relative group transition-colors">
        Hakkımızda
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link href="/iletisim" className="text-white font-medium hover:text-orange-200 relative group transition-colors">
        İletişim
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link href="/siparis-ver" className="text-white font-medium hover:bg-red-600 bg-red-500 px-3 py-1.5 rounded-lg transition-all duration-300 shadow-md">
        Sipariş Ver
      </Link>
    </div>
  );
};

const MobileMenuLinks = ({ isOpen, setIsOpen, isAdmin }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-black/90 to-orange-900/80 backdrop-blur-lg shadow-lg p-4 z-50 flex flex-col space-y-2 rounded-b-lg border-t border-orange-500/30">
      <Link 
        href="/" 
        className="text-white font-medium hover:bg-orange-800/50 p-2 rounded-lg transition-all duration-300" 
        onClick={() => setIsOpen(false)}
      >
        Ana Sayfa
      </Link>
      <Link 
        href="/menu" 
        className="text-white font-medium hover:bg-orange-800/50 p-2 rounded-lg transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        Menü
      </Link>
      <Link 
        href="/hakkimizda" 
        className="text-white font-medium hover:bg-orange-800/50 p-2 rounded-lg transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        Hakkımızda
      </Link>
      <Link 
        href="/iletisim" 
        className="text-white font-medium hover:bg-orange-800/50 p-2 rounded-lg transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        İletişim
      </Link>
      {isAdmin && (
        <Link 
          href="/admin" 
          className="text-white font-medium bg-red-600/80 hover:bg-red-700 p-2 rounded-lg transition-all duration-300 text-center backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          Admin Paneli
        </Link>
      )}
      <Link 
        href="/siparis-ver" 
        className="text-white font-medium hover:bg-red-600 bg-red-500 px-3 py-2 rounded-lg transition-all duration-300 shadow-md"
        onClick={() => setIsOpen(false)}
      >
        Sipariş Ver
      </Link>
    </div>
  );
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const profileRef = useRef(null);

  // Sayfa aşağı kaydırıldığında navbar'ın arka planını değiştir
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Belirli sayfalarda her zaman koyu arka plan olması gereken sayfaları tanımla
  const alwaysDarkPages = ['/iletisim', '/siparislerim'];
  const shouldBeAlwaysDark = alwaysDarkPages.includes(pathname);

  // Oturum durumunu kontrol et
  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-auth`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        
        // Kullanıcının admin olup olmadığını kontrol et
        if (data.user && (data.user.role === 'admin' || data.user.is_admin === true)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        // Sepeti güncelle
        updateCartCount();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        // Çıkış yapıldığında sepeti temizle
        localStorage.removeItem('cart');
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Oturum kontrolü hatası:', error);
      setIsLoggedIn(false);
      setIsAdmin(false);
      localStorage.removeItem('cart');
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Sepet sayısını güncelleme fonksiyonu
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      // Toplam ürün miktarını hesapla
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalItems);
    } catch (error) {
      console.error('Sepet sayısı güncellenirken hata:', error);
      setCartItemCount(0);
    }
  };

  // LocalStorage'daki değişiklikleri dinle
  useEffect(() => {
    // Sayfa yüklendiğinde sepet sayısını güncelle
    updateCartCount();

    // Custom event listener'ı ekle
    window.addEventListener('cartUpdated', updateCartCount);

    // Component unmount olduğunda event listener'ları temizle
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Profil menüsünü kapatmak için dışarıya tıklamayı dinle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target) && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsProfileOpen(false);
        localStorage.removeItem('cart');
        setCartItemCount(0);
        window.location.href = '/';
      } else {
        alert('Çıkış yapılırken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Çıkış hatası:', error);
      alert('Çıkış yapılırken bir hata oluştu!');
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled || shouldBeAlwaysDark 
          ? 'bg-gradient-to-r from-black/90 to-orange-900/80 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full mr-2 sm:mr-3 shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <Image 
                  src="/images/logo.ico" 
                  alt="Elmalı Restoran Logo" 
                  fill
                  sizes="(max-width: 640px) 40px, 48px"
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-orange-200 transition-colors truncate">
                Elmalı Restoran
              </span>
            </Link>
          </div>

          {/* Masaüstü Menüsü */}
          <div className="hidden md:block">
            <DesktopMenuLinks />
          </div>

          {/* Kullanıcı, Sepet ve Auth Bölümü */}
          <div className="flex items-center">
            {/* Sepet */}
            <Link href="/sepetim" className="text-white p-2 rounded-full hover:bg-white/10 transition-colors relative mr-2">
              <FaShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Kullanıcı Menüsü veya Auth Butonları */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-white hover:text-orange-200 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
                    <FaUser className="w-4 h-4 text-white" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white/90 backdrop-blur-md ring-1 ring-black/5 transform transition-all duration-200 origin-top-right">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link href="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/80 hover:text-orange-600 rounded-md mx-1 transition-colors">
                        Profilim
                      </Link>
                      <Link href="/siparislerim" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/80 hover:text-orange-600 rounded-md mx-1 transition-colors">
                        Siparişlerim
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="block px-4 py-2 text-sm bg-red-50 text-red-600 font-medium hover:bg-red-100 rounded-md mx-1 my-1 transition-colors">
                          Admin Paneli
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/80 hover:text-red-600 rounded-md mx-1 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link 
                  href="/auth?type=login" 
                  className="text-white hover:text-amber-300 font-medium transition-all duration-300 relative group text-sm sm:text-base"
                >
                  Giriş Yap
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/auth?type=register" 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-md text-sm sm:text-base whitespace-nowrap"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}

            {/* Mobil Menü Butonu */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md focus:outline-none text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Menü"
              >
                <svg className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      <MobileMenuLinks isOpen={isOpen} setIsOpen={setIsOpen} isAdmin={isAdmin} />
    </nav>
  );
} 
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-36">
              <Image 
                src="/images/logo.png" 
                alt="Elmalı Restaurant Logo" 
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-800 hover:text-amber-600 font-medium transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/menu" className="text-gray-800 hover:text-amber-600 font-medium transition-colors">
              Menü
            </Link>
            <Link href="/chefs" className="text-gray-800 hover:text-amber-600 font-medium transition-colors">
              Şeflerimiz
            </Link>
            <Link href="/hakkimizda" className="text-gray-800 hover:text-amber-600 font-medium transition-colors">
              Hakkımızda
            </Link>
            <Link href="/blog" className="text-gray-800 hover:text-amber-600 font-medium transition-colors">
              Blog
            </Link>
            <Link href="/iletisim" className="text-gray-800 hover:text-amber-600 font-medium transition-colors">
              İletişim
            </Link>
          </div>

          {/* Rezervasyon Butonu */}
          <div className="hidden md:block">
            <Link href="/rezervasyon" className="bg-amber-600 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-700 transition-colors">
              Rezervasyon
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-800 focus:outline-none"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white mt-4 py-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <Link 
                href="/" 
                className="text-gray-800 hover:text-amber-600 font-medium transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/menu" 
                className="text-gray-800 hover:text-amber-600 font-medium transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Menü
              </Link>
              <Link 
                href="/chefs" 
                className="text-gray-800 hover:text-amber-600 font-medium transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Şeflerimiz
              </Link>
              <Link 
                href="/hakkimizda" 
                className="text-gray-800 hover:text-amber-600 font-medium transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link 
                href="/blog" 
                className="text-gray-800 hover:text-amber-600 font-medium transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/iletisim" 
                className="text-gray-800 hover:text-amber-600 font-medium transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İletişim
              </Link>
              <Link 
                href="/rezervasyon" 
                className="bg-amber-600 text-white text-center px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rezervasyon
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
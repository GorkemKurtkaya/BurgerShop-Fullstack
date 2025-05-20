import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="relative">
          {/* Yıldız dekorasyonları */}
          <div className="absolute -left-4 top-0 text-red-500">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1L9,9H2L7,14.5L5,22L12,17.5L19,22L17,14.5L22,9H15L12,1Z" />
            </svg>
          </div>
          <div className="absolute -right-4 bottom-0 text-red-500">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1L9,9H2L7,14.5L5,22L12,17.5L19,22L17,14.5L22,9H15L12,1Z" />
            </svg>
          </div>
          
          {/* 404 Metni */}
          <h1 className="text-8xl md:text-9xl font-bold text-gray-800 tracking-wider">
            404
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif text-gray-700 mt-4">
          Ayyy! Sayfa Bulunamadı
        </h2>
        
        <p className="text-gray-600 mt-4 mb-8 max-w-lg mx-auto">
          Aradığınız sayfa bulunamadı. 
          Ana sayfaya geri dönebilirsiniz.
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
} 
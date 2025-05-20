"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
        if (!response.ok) {
          throw new Error('Ürünler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Kategorileri ürünlerden dinamik olarak oluştur
  const getCategories = () => {
    if (!products.length) return [{ id: 'all', name: 'Tüm Ürünler' }];
    
    const categoriesMap = new Map();
    categoriesMap.set('all', 'Tüm Ürünler');
    
    products.forEach(product => {
      if (product.category && !categoriesMap.has(product.category)) {
        categoriesMap.set(product.category, capitalizeFirstLetter(product.category));
      }
    });
    
    return Array.from(categoriesMap).map(([id, name]) => ({ id, name }));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const categories = getCategories();

  const filterProductsByCategory = (category) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: 'url("/images/burger.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Lezzet Dünyamıza <span className="text-red-500">Hoş Geldiniz</span></h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Geleneksel Türk mutfağının seçkin lezzetleri ve özel tariflerimizle hazırlanmış menümüzü keşfedin. Her bir tabak, şeflerimizin tutkusu ve ustalığıyla hayat buluyor.</p>
          <Link href="/siparis-ver" className="mt-8 px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 flex items-center mx-auto inline-flex">
            <span className="mr-2">ONLİNE SİPARİŞ VER</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div className="bg-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif my-4 text-center">Menümüz</h2>
          <nav className="flex overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-5 py-2 whitespace-nowrap transition-colors
                  ${index > 0 ? 'ml-6' : ''}
                  font-medium text-lg
                  ${activeCategory === category.id ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-800 hover:text-red-500'}
                `}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filterProductsByCategory(activeCategory).map((product) => (
            <div 
              key={product.id}
              className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="md:w-2/5 h-64 md:h-auto relative">
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium mb-2">{product.title}</h3>
                    <span className="font-medium text-red-500">{product.price} ₺</span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Events Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif mb-6">Özel Etkinlikler</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Doğum günleri, iş yemekleri, düğün ve özel organizasyonlar için bizi tercih edin. 
            Size özel menü seçenekleri ve organizasyon imkanları sunuyoruz.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/iletisim" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors">
              Rezervasyon Yap
            </Link>
            <Link 
              href="/siparis-ver"
              className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              Online Sipariş Ver
            </Link>
        </div>
      </div>
    </div>
    </>
  );
} 
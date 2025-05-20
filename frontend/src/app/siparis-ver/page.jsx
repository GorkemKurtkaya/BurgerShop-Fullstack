"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { FaShoppingCart } from 'react-icons/fa';

export default function SiparisVerPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const addToCart = async (product) => {
    try {
      setIsAddingToCart(true);

      // Giriş durumunu kontrol et
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-auth`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!authResponse.ok) {
        router.push('/auth?type=login');
        return;
      }

      const { user } = await authResponse.json();
      // console.log('User data:', user); // Debug için
      
      const basketResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/basket/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          product: {
            productId: product.id,
            name: product.title,
            quantity: 1,
            price: product.price
          }
        })
      });

      if (!basketResponse.ok) {
        throw new Error('Ürün sepete eklenirken bir hata oluştu');
      }

      // Başarılı ekleme sonrası localStorage'ı güncelle (Navbar için gerekli)
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProductIndex = existingCart.findIndex(item => item.id === product.id);

      if (existingProductIndex !== -1) {
        existingCart[existingProductIndex].quantity += 1;
      } else {
        existingCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          quantity: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Navbar'ı güncelle
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(existingCart)
      }));

    } catch (error) {
      console.error('Sepete eklenirken hata:', error);
      alert(error.message || 'Ürün sepete eklenirken bir hata oluştu!');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Kategorileri ürünlerden çıkar
  const extractCategories = (products) => {
    const categoryMap = new Map();
    categoryMap.set('all', 'Tüm Ürünler');
    
    products.forEach(product => {
      if (product.category && !categoryMap.has(product.category)) {
        categoryMap.set(product.category, capitalizeFirstLetter(product.category));
      }
    });
    
    return Array.from(categoryMap).map(([id, name]) => ({ id, name }));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const filterProductsByCategory = (category) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
        if (!response.ok) {
          throw new Error('Ürünler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setProducts(data);
        setCategories(extractCategories(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: 'url("/images/burger.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Online Sipariş Ver</h1>
          <p className="text-xl text-gray-200 mt-2 max-w-3xl mx-auto">
            Lezzetli menümüzden seçiminizi yapın, birkaç dakika içinde kapınıza getirelim.
          </p>
        </div>
      </div>
      
      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Menümüz</h2>
          
          {/* Category Navigation */}
          <div className="bg-white mb-8">
            <div className="container mx-auto px-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterProductsByCategory(activeCategory).map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
                    <span className="text-red-500 text-xl font-bold">{product.price} ₺</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    {product.category && (
                      <span className="text-sm text-gray-500">{capitalizeFirstLetter(product.category)}</span>
                    )}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={isAddingToCart}
                      className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 ${
                        isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isAddingToCart ? (
                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      ) : (
                        <FaShoppingCart className="mr-2" />
                      )}
                      <span>{isAddingToCart ? 'Ekleniyor...' : 'Sepete Ekle'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Yemek İpuçları Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Sipariş İpuçları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-red-500">Hızlı Teslimat</h3>
              <p className="text-gray-600">Siparişleriniz ortalama 30-45 dakika içerisinde adresinize teslim edilir.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-red-500">Temassız Teslimat</h3>
              <p className="text-gray-600">Dilerseniz temassız teslimat seçeneğimizden faydalanabilirsiniz.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-red-500">Ücretsiz Servis</h3>
              <p className="text-gray-600">150₺ ve üzeri siparişlerinizde teslimat ücretsizdir.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sepete Git CTA Bölümü */}
      <section className="py-12 bg-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sepetinize Göz Atın</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Siparişinizi tamamlamaya hazır mısınız? Sepetinizi kontrol edin ve ödeme adımına geçin.
          </p>
          <Link 
            href="/sepetim" 
            className="inline-block bg-white text-red-500 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Sepete Git
          </Link>
        </div>
      </section>
    </div>
  );
} 
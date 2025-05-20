'use client';

import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ScrollAnimation from '../components/ScrollAnimation';
import { FaUtensils, FaPhone, FaClock } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Statik menü öğeleri için bileşen
function MenuItem({ title, imageUrl, price, description }) {
  return (
    <ScrollAnimation animation="popUp">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-red-500 font-bold">{price} ₺</span>
            <Link href="/menu" className="text-sm text-gray-500 hover:text-red-500">Detaylar</Link>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
}

export default function Home() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/popular?limit=6`);
        if (!response.ok) {
          throw new Error('Popüler ürünler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setPopularProducts(data);
      } catch (err) {
        console.error('Popüler ürünler yüklenirken hata:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const basSefler = [
    {
      id: 1,
      name: 'Ahmet Buğra Kadıoğlu',
      position: 'Baş Şef',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746199733/e0ad9f97-9e2c-4510-a5d4-2e9e5ed405f8.png',
    },
    {
      id: 2,
      name: 'Görkem Kurtakaya',
      position: 'Baş Şef',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122599/1694514652576_nzpk4l.jpg',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div>
        <Hero />
      </div>
      
      {/* Özellikler Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="elasticUp">
            <h2 className="text-3xl font-bold text-center mb-10">Neden Bizi Tercih Etmelisiniz?</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation animation="elasticLeft">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <FaUtensils className="text-4xl text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lezzetli Yemekler</h3>
                <p className="text-gray-600">En taze malzemelerle hazırlanan eşsiz lezzetlerimizle damak tadınıza hitap ediyoruz.</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="zoomWithBounce" delay={0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <FaPhone className="text-4xl text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Kolay Sipariş</h3>
                <p className="text-gray-600">Online sipariş sistemimiz ile istediğiniz lezzete birkaç tıkla ulaşabilirsiniz.</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="elasticRight" delay={0.4}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <FaClock className="text-4xl text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
                <p className="text-gray-600">Siparişiniz hazırlanır hazırlanmaz en kısa sürede kapınıza teslim ediyoruz.</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      
      {/* Popüler Menü Bölümü */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="flipY">
            <h2 className="text-3xl font-bold text-center mb-4">Popüler Lezzetlerimiz</h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              En çok sipariş edilen ve misafirlerimizin favorisi olan lezzetlerimizi keşfedin.
            </p>
          </ScrollAnimation>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {popularProducts.map((product) => (
                <MenuItem 
                  key={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  imageUrl={product.image_url}
                />
              ))}
            </div>
          )}
          
          <ScrollAnimation animation="zoomWithBounce" delay={0.5}>
            <div className="text-center mt-10">
              <motion.a 
                href="/menu" 
                className="inline-block bg-red-500 text-white px-6 py-3 rounded-full transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#b91c1c", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.4 }
                }}
              >
                Tüm Menüyü Gör
              </motion.a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      
      {/* Hakkımızda Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <ScrollAnimation animation="elasticLeft">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden relative mx-auto">
                    <Image 
                      src="/images/coffee.jpg" 
                      alt="Şef" 
                      fill
                      sizes="(max-width: 768px) 256px, 320px"
                      className="object-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>
                  <motion.div 
                    className="absolute -bottom-5 -right-5 bg-red-500 text-white rounded-full p-6 flex flex-col items-center justify-center"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
                      transition: { duration: 0.4 }
                    }}
                  >
                    <span className="text-3xl font-bold">2001</span>
                    <span className="text-sm">KURULUŞ</span>
                  </motion.div>
                </div>
              </ScrollAnimation>
            </div>
            
            <div className="md:w-1/2 md:pl-10">
              <ScrollAnimation animation="elasticRight">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="uppercase text-red-500 ml-2 tracking-wider font-medium">HAKKIMIZDA</p>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif mb-6">Zarafet ve Mükemmellik <br />Sunan Bir Lezzet Deneyimi</h2>
                
                <p className="text-gray-600 mb-6">
                  2001 yılından beri İzmir'in Kuzey Tekmer bölgesinde, geleneksel Türk mutfağının en seçkin lezzetlerini, modern dokunuşlarla harmanlayarak misafirlerimize sunuyoruz. Her bir tabağımızda kalite, tazelik ve yıllara dayanan ustalık bir araya geliyor.
                </p>
                
                <div className="flex justify-end">
                  <motion.a 
                    href="/hakkimizda" 
                    className="inline-block bg-red-500 text-white px-6 py-2 rounded transition-all duration-300"
                    whileHover={{ 
                      scale: 1.03, 
                      backgroundColor: "#b91c1c", 
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      transition: { duration: 0.4 }
                    }}
                  >
                    Daha Fazla
                  </motion.a>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>
      
      {/* Şeflerimiz Bölümü */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="flipX">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <p className="uppercase text-red-500 tracking-wider font-medium mb-2">MUTFAĞIMIZIN UZMANLARI</p>
              <h2 className="text-3xl md:text-4xl font-serif">Baş Şeflerimiz</h2>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {basSefler.map((sef, index) => (
              <ScrollAnimation key={sef.id} animation="popUp" delay={index * 0.3}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="relative h-80 md:h-96">
                    <Image 
                      src={sef.image} 
                      alt={sef.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-medium">{sef.name}</h3>
                    <p className="text-red-500 mt-1">{sef.position}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
          
          <ScrollAnimation animation="zoomWithBounce" delay={0.5}>
            <div className="text-center mt-10">
              <motion.a 
                href="/seflerimiz" 
                className="inline-block bg-red-500 text-white px-6 py-3 rounded-full transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#b91c1c", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.4 }
                }}
              >
                Tüm Şeflerimizi Göster
              </motion.a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      
      {/* İletişim CTA Bölümü */}
      <section className="py-16 bg-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="popUp">
            <h2 className="text-3xl font-bold mb-4">Rezervasyon Yapmak İster Misiniz?</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Özel günlerinizde veya keyifli bir akşam yemeği için hemen rezervasyon yapın.
            </p>
            <motion.a 
              href="/iletisim" 
              className="inline-block bg-white text-red-500 px-6 py-3 rounded-full font-medium transition-all duration-300"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#f9fafb", 
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.4 }
              }}
            >
              Hemen Rezervasyon Yap
            </motion.a>
          </ScrollAnimation>
        </div>
      </section>
    </main>
  );
} 
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

export default function Hakkimizda() {
  const [videoModal, setVideoModal] = useState(false);
  
  // Şef bilgilerini ekleyelim
  const sefler = [
    {
      id: 1,
      name: 'Ahmet Buğra Kadıoğlu',
      position: 'Baş Şef & Kurucu',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746199733/e0ad9f97-9e2c-4510-a5d4-2e9e5ed405f8.png',
    },
    {
      id: 2,
      name: 'Görkem Kurtkaya',
      position: 'Baş Şef & Kurucu',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122599/1694514652576_nzpk4l.jpg',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: 'url("/images/burger.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Hakkımızda</h1>
          <p className="text-xl text-gray-200 mt-4">Elmalı Restoran'ı Tanıyın</p>
        </div>
      </div>
      
      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden relative mx-auto">
                  <Image 
                    src="/images/coffee.jpg" 
                    alt="Şef" 
                    layout="fill" 
                    objectFit="cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-red-500 text-white rounded-full p-6 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">2001</span>
                  <span className="text-sm">KURULUŞ</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-10">
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
                2001 yılından beri İzmir'in Kuzey Tekmer bölgesinde, geleneksel Türk mutfağının en seçkin lezzetlerini, modern dokunuşlarla harmanlayarak misafirlerimize sunuyoruz. Her bir tabağımızda kalite, tazelik ve yıllara dayanan ustalık bir araya geliyor. Deneyimli şeflerimiz, yerel ve mevsimsel malzemeleri kullanarak benzersiz bir gastronomi deneyimi yaratıyor.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-red-500">5-Yıldız</h3>
                  <p className="text-gray-500">MÜŞTERİ DENEYİMİ</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-red-500">60,000+</h3>
                  <p className="text-gray-500">MUTLU MÜŞTERİ</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-red-500">99%</h3>
                  <p className="text-gray-500">MÜŞTERİ MEMNUNİYETİ</p>
                </div>
              </div>
              
              <div className="flex items-center flex-wrap">
                {sefler.map((sef) => (
                  <div key={sef.id} className="flex items-center mr-6 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={sef.image} 
                        alt={sef.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{sef.name}</p>
                      <p className="text-gray-500 text-sm">{sef.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision and Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Vizyonumuz</h3>
              </div>
              <p className="text-gray-600">
                Sokak lezzetlerini en üst seviyede temsil eden, hem yerel hem de dünya mutfaklarından ilham alarak yenilikçi lezzetler yaratan, misafirlerine unutulmaz bir deneyim sunan, sektörünün önde gelen ve örnek gösterilen bir restoran olmak.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Misyonumuz</h3>
              </div>
              <p className="text-gray-600">
                En kaliteli malzemelerle, profesyonel ekibimizin ustalığını birleştirerek lezzet ve sunum mükemmelliğine ulaşmak. Müşteri memnuniyetini her zaman ilk sırada tutarak, konforlu ve keyifli bir ortamda, sıcak, samimi ve profesyonel bir hizmet sunmak.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Video Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/pizza.jpg" 
                alt="Restoran İç Mekan" 
                layout="fill" 
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button 
                  onClick={() => setVideoModal(true)} 
                  className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <FaPlay className="ml-1" size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      
      {/* Modal for video */}
      {videoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setVideoModal(false)}>
          <div className="w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="relative pb-[56.25%] h-0">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Restoranımız Tanıtım Videosu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => setVideoModal(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
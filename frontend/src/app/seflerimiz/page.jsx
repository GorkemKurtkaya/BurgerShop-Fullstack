'use client';

import React from 'react';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function SeflerimizSayfasi() {
  const sefler = [
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
    {
      id: 3,
      name: 'Muhammed Eraslan',
      position: 'Pastane Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122705/bf759112-fa35-43d8-96a1-96757c29fec2.png',
    },
    {
      id: 4,
      name: 'Berkay Özgün',
      position: 'Et Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122654/8fa45218-df8d-4b43-87c7-e22ae99df2d3.png',
    },
    {
      id: 5,
      name: 'Berk Kendirlioğlu',
      position: 'Soğuk Mutfak Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746196152/e0180a02-5d96-4c31-883d-a55760572cd3.png',
    },
    {
      id: 6,
      name: 'Zehra Melike Çiçek',
      position: 'Tatlı Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122762/bc90bdd4-b14e-404e-8e27-9c19d9901e65.png',
    },
    {
      id: 7,
      name: 'Sümeyye Karataş',
      position: 'Deniz Ürünleri Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122711/2e9d2a44-4b7a-4951-9672-1ff2584e75a6.png',
    },
    {
      id: 8,
      name: 'Talha Elmalı',
      position: 'Mutfak Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122607/1741049582621_kn44cy.jpg',
    },
    {
      id: 8,
      name: 'Sabri Alkan',
      position: 'Mutfak Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746123391/3ef669d8-0efd-41c9-88ba-3e59b8e24477.png',
    },
    {
      id: 8,
      name: 'Reşat Gökay Çelik',
      position: 'Mutfak Şefi',
      image: 'https://res.cloudinary.com/dn3bikzbm/image/upload/v1746123427/6b879111-1990-4e7e-b764-85040f1aa32e.png',
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: 'url("/images/chef-hero.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Şeflerimiz</h1>
          <p className="text-xl text-gray-200 mt-4">Restoranımızın Mutfak Kahramanları</p>
        </div>
      </div>
      
      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <p className="uppercase text-red-500 tracking-wider font-medium mb-2">ŞEFLERİMİZLE TANIŞIN</p>
            <h2 className="text-3xl md:text-4xl font-serif">Menünün Arkasındaki Ustalar</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sefler.map((sef) => (
              <div key={sef.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                <div className="relative h-80 md:h-96">
                  <Image 
                    src={sef.image} 
                    alt={sef.name} 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-medium">{sef.name}</h3>
                  <p className="text-red-500 mt-1">{sef.position}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/iletisim" 
              className="inline-block px-8 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              İLETİŞİME GEÇİN
            </a>
          </div>
        </div>
      </section>
      
      {/* Chef Quote Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
            </svg>
            <blockquote className="text-2xl font-serif mb-8">
              "İyi yemek, samimi bir ekip ve tutku ile hazırlanan lezzetler... 
              Bu üç unsur bir araya geldiğinde, bir restoran sadece bir yemek yeme yeri olmaktan çıkar, 
              bir deneyim merkezine dönüşür."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4">
                <Image 
                  src="https://res.cloudinary.com/dn3bikzbm/image/upload/v1746199733/e0ad9f97-9e2c-4510-a5d4-2e9e5ed405f8.png" 
                  alt="Ahmet Buğra Kadıoğlu" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-bold">Ahmet Buğra Kadıoğlu</p>
                <p className="text-gray-600">Baş Şef & Kurucu</p>
              </div>
              <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4">
                <Image 
                  src="https://res.cloudinary.com/dn3bikzbm/image/upload/v1746122599/1694514652576_nzpk4l.jpg" 
                  alt="Görkem Kurtakaya" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-bold">Görkem Kurtkaya</p>
                <p className="text-gray-600">Baş Şef & Kurucu</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 
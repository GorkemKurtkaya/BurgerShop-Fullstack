"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Iletisim() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API çağrısını burada yapabilirsiniz
      // const res = await fetch('/api/contact', {...});
      
      // Şimdilik sadece başarılı mesajı gösterelim
      toast.success('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error('Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      console.error('İletişim formu gönderim hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">İletişim</h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-2xl font-semibold mb-4">Bize Ulaşın</h2>
              <p className="mb-4">
                Sorularınız, önerileriniz veya rezervasyon talepleriniz için bize ulaşabilirsiniz.
              </p>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2">Adres</h3>
                <p>Ahmet Piriştina Kültür Merkezi, Şemikler, Ordu Blv No: 210, 35560 Karşıyaka/İzmir</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2">Telefon</h3>
                <p>+90 (232) 123 45 67</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2">E-posta</h3>
                <p>info@elmalirestorant.com</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2">Çalışma Saatleri</h3>
                <p>Her gün: 09:00 - 17:00</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-7">
            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-2xl font-semibold mb-4">İletişim Formu</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Adınız Soyadınız</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">E-posta Adresiniz</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Telefon Numaranız</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Mesajınız</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full py-2 px-4 bg-amber-500 text-white font-medium rounded hover:bg-amber-600 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
} 
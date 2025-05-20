'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { FaUser, FaEdit, FaHistory, FaCreditCard, FaMapMarkerAlt, FaBell, FaChevronRight } from 'react-icons/fa';
import Siparislerim from '../siparislerim/page';

const ProfilPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hesap-bilgileri');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    // Diğer kullanıcı bilgileri buraya eklenebilir
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);


  const menuItems = [
    { title: 'Hesap Bilgileri', id: 'hesap-bilgileri', icon: <FaUser className="mr-2" /> },
    { title: 'Geçmiş Siparişlerim', id: 'siparislerim', icon: <FaHistory className="mr-2" /> },
  ];

  const fetchUserData = async () => {
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-auth`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!authResponse.ok) {
        router.push('/auth?type=login');
        return null;
      }

      const { user } = await authResponse.json();
      return user;
    } catch (error) {
      console.error('Kullanıcı bilgileri alınırken hata:', error);
      router.push('/auth?type=login');
      return null;
    }
  };

  useEffect(() => {
    // Kullanıcı bilgilerini getiren fonksiyon
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const currentUser = await fetchUserData();
        if (!currentUser) return;
        setUser(currentUser);

        const userId = currentUser.id; // Kullanıcı ID'sini al

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          // Kullanıcı bilgileri alınamazsa oturum açma sayfasına yönlendir
          router.push('/auth?type=login');
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  // Hesap Bilgileri gösterimi
  const renderHesapBilgileri = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Hesap Bilgileri</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-28 h-28 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <FaUser className="w-16 h-16" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ad Soyad</p>
              <p className="text-lg font-medium text-gray-800">{userInfo.name || 'Ad Soyad'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">E-posta</p>
              <p className="text-lg font-medium text-gray-800">{userInfo.email || 'ornek@mail.com'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Telefon</p>
              <p className="text-lg font-medium text-gray-800">{userInfo.phone || '555-555-5555'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Son Giriş</p>
              <p className="text-lg font-medium text-gray-800">{new Date().toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          {/* <div className="mt-8 flex justify-end">
            <button
              onClick={() => setActiveTab('hesap-duzenle')}
              className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center hover:bg-red-600 transition-colors"
            >
              <FaEdit className="mr-2" />
              Profili Düzenle
            </button>
          </div> */}
        </div>
      )}
    </div>
  );

  // Hesap düzenleme formu
  const renderHesapDuzenle = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Profili Düzenle</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
            <input
              type="text"
              name="ad"
              value={userInfo.name?.split(' ')[0] || ''}
              onChange={(e) => { }} // İlgili state güncellemesi eklenecek
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
            <input
              type="text"
              name="soyad"
              value={userInfo.name?.split(' ')[1] || ''}
              onChange={(e) => { }} // İlgili state güncellemesi eklenecek
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
          <input
            type="email"
            name="email"
            value={userInfo.email || ''}
            onChange={(e) => { }} // İlgili state güncellemesi eklenecek
            className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
          <input
            type="tel"
            name="telefon"
            value={userInfo.phone || ''}
            onChange={(e) => { }} // İlgili state güncellemesi eklenecek
            className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
          <input
            type="date"
            name="dogumTarihi"
            value={userInfo.birthDate || ''}
            onChange={(e) => { }} // İlgili state güncellemesi eklenecek
            className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('hesap-bilgileri')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );

  // Geçmiş siparişler
  const renderSiparislerim = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Geçmiş Siparişlerim</h2>
      <Siparislerim hideHero={true} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white ">
      {/* Hero Section */}
      <div className="relative h-[30vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/images/food-bg.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Profilim</h1>
          <p className="text-xl text-gray-200 mt-2 max-w-3xl mx-auto">
            Hesap bilgilerinizi yönetin ve geçmiş siparişlerinizi görüntüleyin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol Menü */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-5 sticky top-20">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">Hesap Menüsü</h2>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${activeTab === item.id
                        ? 'bg-red-50 text-red-600'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    <FaChevronRight className="ml-auto text-sm" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sağ İçerik */}
          <div className="md:w-3/4">
            {activeTab === 'hesap-bilgileri' && renderHesapBilgileri()}
            {activeTab === 'hesap-duzenle' && renderHesapDuzenle()}
            {activeTab === 'siparislerim' && renderSiparislerim()}
          </div>
        </div>
      </div>

      {/* Profil İpuçları Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Profil Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-red-500">Hesap Güvenliği</h3>
              <p className="text-gray-600">Hesap bilgilerinizi güncel tutun ve düzenli olarak şifrenizi değiştirin.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-red-500">Sipariş Takibi</h3>
              <p className="text-gray-600">Geçmiş siparişlerinizi görüntüleyin ve tekrar sipariş verin.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-red-500">Adres Yönetimi</h3>
              <p className="text-gray-600">Birden fazla teslimat adresi ekleyerek siparişlerinizi daha hızlı tamamlayın.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilPage; 
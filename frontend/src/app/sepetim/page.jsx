"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaTruck } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Sepetim() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [user, setUser] = useState(null);

  // Kullanıcı bilgilerini al
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

  // Sepeti getir
  const fetchCart = async () => {
    try {
      setLoading(true);
      const currentUser = await fetchUserData();
      if (!currentUser) return;
      setUser(currentUser);

      // API'den sepet verilerini al
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/basket/${currentUser.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        credentials: 'include'
      });

      // if (!response.ok) {
      //   throw new Error('Sepet yüklenirken bir hata oluştu');
      // }

      const data = await response.json();
      const apiCartItems = data.response || [];

      // localStorage'dan ürün detaylarını al
      const localStorageCart = JSON.parse(localStorage.getItem('cart') || '[]');

      // API'deki ürünleri localStorage'daki detaylarla birleştir
      const mergedCartItems = apiCartItems.map(apiItem => {
        const localItem = localStorageCart.find(item => item.id === apiItem.productId);
        if (localItem) {
          return {
            ...localItem,
            quantity: apiItem.quantity // API'deki miktarı kullan
          };
        }
        return null;
      }).filter(item => item !== null);

      setCartItems(mergedCartItems);

      // Toplam tutarı hesapla
      const totalAmount = mergedCartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      setTotal(totalAmount);
    } catch (err) {
      console.error('Sepet getirme hatası:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Miktar güncelleme
  const updateQuantity = async (itemId, action) => {
    try {
      if (!user) {
        const currentUser = await fetchUserData();
        if (!currentUser) return;
        setUser(currentUser);
      }

      // Mevcut ürünün miktarını bul
      const currentItem = cartItems.find(item => item.id === itemId);
      if (!currentItem) return;

      // Yeni miktarı hesapla
      let newQuantity = action === 'increment' ? currentItem.quantity + 1 : currentItem.quantity - 1;

      // API'de güncelle
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/basket/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          productId: itemId,
          action: action
        })
      });

      if (!response.ok) {
        throw new Error('Miktar güncellenirken bir hata oluştu');
      }

      // Eğer miktar 0'a düştüyse, sepeti yeniden yükle
      if (newQuantity === 0) {
        await fetchCart();
        return;
      }

      // Sepeti güncelle
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Toplam tutarı güncelle
      setTotal(prevTotal => {
        const itemPrice = currentItem.price;
        if (action === 'increment') {
          return prevTotal + itemPrice;
        } else {
          return prevTotal - itemPrice;
        }
      });

      // localStorage'ı güncelle
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      localStorage.setItem('cart', JSON.stringify(
        localCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      ));

      // Navbar'ı güncelle
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert(error.message);
    }
  };

  // Sepeti boşalt
  const removeItem = async () => {
    try {
      if (!user) {
        const currentUser = await fetchUserData();
        if (!currentUser) return;
        setUser(currentUser);
      }

      // API'den sepeti sil
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/basket/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Sepet boşaltılırken bir hata oluştu');
      }

      // localStorage'dan sepeti temizle
      localStorage.setItem('cart', '[]');

      // Navbar'ı güncelle
      window.dispatchEvent(new Event('cartUpdated'));

      // Sepeti yeniden yükle
      await fetchCart();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert(error.message);
    }
  };

  const stripePromise = loadStripe('pk_test_51RI6JBHBvviLecOXsV3IOepY0QaWP5GFy2I5Nb5DfVswTQJxjzAO2QN2YtYOdb68Cy2vykkERWjcnUmHDA4nQyv900wCDWRFT1');

  const handleCheckout = async () => {
    try {
      if (!user) {
        const currentUser = await fetchUserData();
        if (!currentUser) return;
        setUser(currentUser);
      }

      // Butonu devre dışı bırak
      setIsOrderProcessing(true);

      if (!address.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Uyarı',
          text: 'Lütfen teslimat adresi giriniz.',
          confirmButtonText: 'Tamam'
        });
        setIsOrderProcessing(false);
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        alert('Sepetiniz boş!');
        setIsOrderProcessing(false);
        return;
      }

      const stripe = await stripePromise;

      console.log('Gönderilen veriler:', {
        user_id: user.id,
        products: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        address: address
      });

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/checkout/create-checkout-session`, {
        user_id: user.id,
        products: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        address: address
      });

      const { url, order_id } = response.data;

      // Sipariş ID'sini localStorage'a kaydet
      localStorage.setItem('currentOrderId', order_id);

      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.");
      setIsOrderProcessing(false);
    }
  };

  // Siparişi tamamla
  const completeOrder = async () => {
    try {
      if (!user) {
        const currentUser = await fetchUserData();
        if (!currentUser) return;
        setUser(currentUser);
      }

      if (!address.trim()) {
        alert('Lütfen teslimat adresi giriniz');
        return;
      }

      setIsOrderProcessing(true);

      // Sipariş için ürünleri hazırla
      const orderProducts = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          products: orderProducts,
          address: address
        })
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulurken bir hata oluştu');
      }

      // Sipariş başarılı olduysa sepeti temizle
      await removeItem(); // Mevcut removeItem fonksiyonu sepeti temizleyecek

      // Başarılı mesajı göster ve siparişlerim sayfasına yönlendir
      alert('Siparişiniz başarıyla oluşturuldu!');
      router.push('/siparislerim');

    } catch (error) {
      console.error('Sipariş hatası:', error);
      alert(error.message);
    } finally {
      setIsOrderProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20">
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
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hata</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchCart}
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-[30vh] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: 'url("/images/food-bg.jpg")' }}>
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sepetim</h1>
            <p className="text-xl text-gray-200 mt-2 max-w-3xl mx-auto">
              Siparişinizi tamamlamak için bir adım kaldı
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-red-500">
              <FaShoppingCart className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-600 mb-6">Sepetinizde henüz ürün bulunmuyor.</p>
            <Link
              href="/siparis-ver"
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              Sipariş Ver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[30vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/images/food-bg.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sepetim</h1>
          <p className="text-xl text-gray-200 mt-2 max-w-3xl mx-auto">
            Siparişinizi tamamlamak için bir adım kaldı
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sepetinizdeki Ürünler</h2>
          <button
            onClick={removeItem}
            className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <FaTrash className="mr-2" />
            <span>Sepeti Boşalt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sepet Ürünleri */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, "decrement")}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-gray-900 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, "increment")}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-red-500">
                          {(item.price * item.quantity).toFixed(2)} ₺
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Sipariş Özeti</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{total.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-500 font-medium">Ücretsiz</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="text-red-500">{total.toFixed(2)} ₺</span>
                  </div>
                </div>

                {/* Adres Alanı */}
                <div className="mt-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Teslimat Adresi
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                    placeholder="Teslimat adresinizi giriniz..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isOrderProcessing || cartItems.length === 0}
                  className={`w-full bg-red-500 text-white py-3 rounded-full font-medium transition-colors mt-6 flex items-center justify-center space-x-2
                    ${(isOrderProcessing || cartItems.length === 0) ? 'opacity-75 cursor-not-allowed' : 'hover:bg-red-600'}`}
                >
                  {isOrderProcessing ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2" />
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <span>Siparişi Tamamla</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teslimat Bilgileri */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Teslimat Bilgileri</h2>
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

      {/* Alışverişe Devam Et CTA */}
      <section className="py-12 bg-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Alışverişe Devam Et</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Sepetinize eklemek istediğiniz başka ürünler mi var? Menümüzden seçiminizi yapın.
          </p>
          <Link
            href="/siparis-ver"
            className="inline-block bg-white text-red-500 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Menüye Dön
          </Link>
        </div>
      </section>
    </div>
  );
} 
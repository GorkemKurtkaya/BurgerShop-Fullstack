'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingBag, FaHistory, FaClock, FaChevronDown, FaChevronUp, FaTruck, FaCheck, FaTimes, FaSpinner, FaBox, FaUtensils, FaFileInvoice } from 'react-icons/fa';
import Swal from 'sweetalert2';


const SiparislerimContent = ({ hideHero }) => {
    const [siparisler, setSiparisler] = useState([]);
    const [urunDetaylari, setUrunDetaylari] = useState({});
    const [yukleniyor, setYukleniyor] = useState(true);
    const [acilanDetaylar, setAcilanDetaylar] = useState({});
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

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


    const urunDetayiGetir = async (productId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                console.warn(`Ürün bilgisi alınamadı. ID: ${productId}, Status: ${response.status}`);
                return {
                    id: productId,
                    title: 'Ürün bilgisi alınamadı',
                    price: 0,
                    description: 'Bu ürün artık mevcut değil veya bilgileri alınamadı.',
                    image_url: '/images/food-bg.jpg'
                };
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Ürün detayı getirilirken hata (ID: ${productId}):`, error);
            return {
                id: productId,
                title: 'Ürün bilgisi alınamadı',
                price: 0,
                description: 'Bu ürün artık mevcut değil veya bilgileri alınamadı.',
                image_url: '/images/food-bg.jpg'
            };
        }
    };

    const detayToggle = (siparisId) => {
        setAcilanDetaylar(prev => ({
            ...prev,
            [siparisId]: !prev[siparisId]
        }));
    };

    const siparisIptalEt = async (orderId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({ status: 'cancelled' })
            });

            if (!response.ok) {
                throw new Error('Sipariş iptal edilirken bir hata oluştu');
            }

            // Başarılı bir şekilde iptal edildikten sonra siparişleri yenile
            setSiparisler(prevSiparisler => 
                prevSiparisler.map(siparis => 
                    siparis.id === orderId 
                        ? { ...siparis, status: 'cancelled' } 
                        : siparis
                )
            );
            
            Swal.fire({
                title: 'Başarılı!',
                text: 'Siparişiniz iptal edildi.',
                icon: 'success',
                iconColor: '#10b981',
                confirmButtonColor: '#dc2626',
                background: '#1f1f1f',
                color: '#fff',
                confirmButtonText: 'Tamam',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm'
                }
            });
        } catch (error) {
            console.error('Sipariş iptal hatası:', error);
            alert('Sipariş iptal edilirken bir hata oluştu: ' + error.message);
        }
    };

    const faturaIndir = async (orderId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Fatura bilgileri alınamadı');
            }

            const faturalar = await response.json();
            const fatura = faturalar.find(f => f.order_id === orderId);
            
            if (fatura && fatura.pdf_url) {
                // Google Drive URL'sini doğrudan aç
                window.open(fatura.pdf_url, '_blank');
            } else {
                throw new Error('Bu sipariş için fatura henüz oluşturulmamış');
            }
        } catch (error) {
            console.error('Fatura indirme hatası:', error);
            alert('Fatura indirilirken bir hata oluştu: ' + error.message);
        }
    };

    const siparisleriKontrolEt = async () => {
        try {
            // Kullanıcı henüz yüklenmemişse, işlemi atla
            if (!user) return;
            
            // Sadece admin kullanıcılar için istek oluştur
            if (user.role === "admin") {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/check-orders`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                
                // Siparişleri güncelle
                siparisleriGetir();
            } else {
                // Kullanıcının siparişlerinde 1 saatten eski olanları kontrol et ve UI'ı güncelle
                if (siparisler.length === 0) return;
                
                const birSaatOncesi = new Date();
                birSaatOncesi.setHours(birSaatOncesi.getHours() - 1);
                
                const guncelSiparisler = siparisler.map(siparis => {
                    if (siparis.status === 'pending' && 
                        new Date(siparis.created_at) < birSaatOncesi) {
                        return { ...siparis, status: 'cancelled' };
                    }
                    return siparis;
                });
                
                if (JSON.stringify(guncelSiparisler) !== JSON.stringify(siparisler)) {
                    setSiparisler(guncelSiparisler);
                }
            }
        } catch (error) {
            console.error('Siparişleri kontrol ederken hata:', error);
        }
    };

    const siparisleriGetir = async () => {
        try {
            const currentUser = await fetchUserData();
            if (!currentUser) return;
            setUser(currentUser);

            const userId = currentUser.id;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Siparişler getirilirken bir hata oluştu');
            }


            const data = await response.json();
            // Siparişleri tarihe göre sırala (en yeni en üstte)
            const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setSiparisler(sortedData);

            // Tüm ürün detaylarını çek
            const urunler = {};
            for (const siparis of sortedData) {
                for (const urun of siparis.products) {
                    if (!urunler[urun.product_id]) {
                        const detay = await urunDetayiGetir(urun.product_id);
                        if (detay) {
                            urunler[urun.product_id] = detay;
                        }
                    }
                }
            }
            setUrunDetaylari(urunler);
        } catch (error) {
            console.error('Hata:', error);
            setError(error.message);
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        siparisleriGetir();
        siparisleriKontrolEt();

        // Siparişleri her 30 saniyede bir yenile ve kontrol et
        const interval = setInterval(() => {
            if (!yukleniyor) {
                siparisleriGetir();
                siparisleriKontrolEt();
            }
        }, 30000);

        // Clean up interval
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const clearCart = async () => {
            if (orderId) {
                try {
                    const currentUser = await fetchUserData();
                    if (!currentUser) return;
                    setUser(currentUser);

                    const userId = currentUser.id;

                    // API'den sepeti sil
                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/basket/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get('token')}`,
                        },
                        credentials: 'include'
                    });

                    // localStorage'dan sepeti temizle
                    localStorage.setItem('cart', '[]');

                    // Navbar'ı güncelle
                    window.dispatchEvent(new Event('cartUpdated'));
                } catch (error) {
                    console.error('Sepet temizleme hatası:', error);
                }
            }
        };

        clearCart();
    }, [orderId]);

    // Sipariş durumuna göre renk ve stil bilgileri
    const getDurumStili = (durum) => {
        switch (durum) {
            case 'completed':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    border: 'border-green-200',
                    hover: 'hover:bg-green-100'
                };
            case 'pending':
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700',
                    border: 'border-blue-200',
                    hover: 'hover:bg-blue-100'
                };
            case 'preparing':
                return {
                    bg: 'bg-yellow-50',
                    text: 'text-yellow-700',
                    border: 'border-yellow-200',
                    hover: 'hover:bg-yellow-100'
                };
            case 'on_delivery':
                return {
                    bg: 'bg-purple-50',
                    text: 'text-purple-700',
                    border: 'border-purple-200',
                    hover: 'hover:bg-purple-100'
                };
            case 'cancelled':
                return {
                    bg: 'bg-gray-200',
                    text: 'text-gray-700',
                    border: 'border-gray-300',
                    hover: 'hover:bg-gray-300'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    hover: 'hover:bg-gray-100'
                };
        }
    };

    if (yukleniyor) {
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

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            {!hideHero && (
                <div className="relative h-[30vh] bg-cover bg-center flex items-center justify-center"
                    style={{ backgroundImage: 'url("/images/order-bg.jpg")' }}>
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                    <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Siparişlerim</h1>
                        <p className="text-xl text-gray-200 mt-2 max-w-3xl mx-auto">
                            Tüm siparişlerinizi ve sipariş detaylarınızı buradan takip edebilirsiniz
                        </p>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-12">
                {siparisler.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-lg mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 text-red-500">
                            <FaShoppingBag className="w-full h-full" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Henüz Siparişiniz Yok</h2>
                        <p className="text-gray-600 mb-6">Siparişleriniz burada görüntülenecektir.</p>
                        <Link
                            href="/siparis-ver"
                            className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
                        >
                            Sipariş Ver
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {siparisler.map((siparis) => (
                            <div 
                                key={siparis.id} 
                                className={`rounded-lg shadow-lg p-6 border transition-shadow ${
                                    siparis.status === 'cancelled' 
                                        ? 'bg-gray-100 border-gray-300 text-gray-700' 
                                        : 'bg-white border-gray-200 hover:shadow-xl'
                                }`}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold text-gray-900">Sipariş No: <span className="text-red-500">#{siparis.id.slice(0, 8)}</span></p>
                                        <p className="text-gray-600 my-1 flex items-center">
                                            <FaClock className="mr-2 text-gray-400" />
                                            Tarih: {new Date(siparis.created_at).toLocaleDateString('tr-TR')}
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            Adres: {siparis.address}
                                        </p>
                                        <p className={`text-xl font-bold mt-2 md:hidden ${siparis.status === 'cancelled' ? 'text-gray-500' : 'text-red-500'}`}>
                                            {siparis.amount.toFixed(2)} ₺
                                        </p>
                                        {siparis.status === 'cancelled' && (
                                            <p className="text-gray-500 font-medium mt-2 flex items-center">
                                                <FaTimes className="mr-2 text-gray-500" />
                                                Bu sipariş iptal edilmiştir
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                            <p className={`text-xl font-bold mb-2 hidden md:block ${siparis.status === 'cancelled' ? 'text-gray-500' : 'text-red-500'}`}>
                                                {siparis.amount.toFixed(2)} ₺
                                            </p>
                                            <button
                                                onClick={() => detayToggle(siparis.id)}
                                                className={`flex items-center justify-center px-4 py-2 text-white rounded-full transition-colors ${
                                                    siparis.status === 'cancelled' 
                                                        ? 'bg-gray-500 hover:bg-gray-600' 
                                                        : 'bg-red-500 hover:bg-red-600'
                                                }`}
                                            >
                                                <span>Detaylar</span>
                                                {acilanDetaylar[siparis.id] ?
                                                    <FaChevronUp className="ml-2" /> :
                                                    <FaChevronDown className="ml-2" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {acilanDetaylar[siparis.id] && (
                                    <div className="mt-6 border-t border-gray-200 pt-6 space-y-4 transition-all duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-gray-900 text-lg mb-3">Sipariş Durumu</h3>
                                                <div className="flex flex-col space-y-2">
                                                    {[
                                                        { status: 'pending', icon: <FaCheck className="w-5 h-5" />, text: 'Siparişiniz Alındı' },
                                                        { status: 'preparing', icon: <FaUtensils className="w-5 h-5" />, text: 'Siparişiniz Hazırlanıyor' },
                                                        { status: 'on_delivery', icon: <FaTruck className="w-5 h-5" />, text: 'Siparişiniz Yola Çıktı' },
                                                        { status: 'completed', icon: <FaBox className="w-5 h-5" />, text: 'Siparişiniz Teslim Edildi' },
                                                        { status: 'cancelled', icon: <FaTimes className="w-5 h-5" />, text: 'Siparişiniz İptal Edildi' }
                                                    ].map((statusOption) => {
                                                        const durumStili = getDurumStili(statusOption.status);
                                                        const aktifDurum =
                                                            (siparis.status === 'completed' && statusOption.status === 'completed') ||
                                                            (siparis.status === 'pending' && statusOption.status === 'pending') ||
                                                            (siparis.status === 'preparing' && statusOption.status === 'preparing') ||
                                                            (siparis.status === 'on_delivery' && statusOption.status === 'on_delivery') ||
                                                            (siparis.status === 'delivered' && statusOption.status === 'delivered') ||
                                                            (siparis.status === 'cancelled' && statusOption.status === 'cancelled');

                                                        return (
                                                            <div
                                                                key={statusOption.status}
                                                                className={`flex items-center space-x-2 p-2 rounded-md ${aktifDurum
                                                                        ? `${durumStili.bg} ${durumStili.text} font-medium`
                                                                        : 'bg-gray-50 text-gray-500'
                                                                    }`}
                                                            >
                                                                {statusOption.icon}
                                                                <span>{statusOption.text}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex space-x-2 mt-4">
                                                    <button
                                                        onClick={() => faturaIndir(siparis.id)}
                                                        className="flex items-center justify-center flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        <FaFileInvoice className="mr-2" />
                                                        Fatura İndir
                                                    </button>
                                                    
                                                    {(siparis.status === 'completed' || siparis.status === 'pending') && (
                                                        <button
                                                            onClick={() => siparisIptalEt(siparis.id)}
                                                            className="flex items-center justify-center flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                                        >
                                                            <FaTimes className="mr-2" />
                                                            İptal Et
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-gray-900 text-lg mb-3 border-b border-gray-200 pb-2">Sipariş Detayları</h3>
                                                {siparis.status === 'cancelled' && (
                                                    <div className="p-4 bg-gray-200 text-gray-700 rounded-lg flex items-center mb-4">
                                                        <FaTimes className="w-5 h-5 mr-2" />
                                                        <p className="font-medium">Bu sipariş iptal edildiği için ürün detayları gri tonlarda gösterilmektedir.</p>
                                                    </div>
                                                )}
                                                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg mb-4">
                                                    <p className="font-medium mb-1">Sipariş Bilgisi</p>
                                                    <p className="text-sm">Siparişin hazırlanma süresi ortalama 30-40 dakikadır. Eğer ödemede sorun oluştuysa ödemeniz otomatik olarak süre zarfında iptal olur.</p>
                                                    {siparis.status === 'pending' && (
                                                        <p className="text-sm mt-2 text-red-600 font-medium">Dikkat: Siparişiniz bekleme durumunda. Eğer 1 saat içinde hazırlanmaya başlamazsa otomatik olarak iptal edilecektir.</p>
                                                    )}
                                                </div>
                                                {siparis.products.map((item, index) => {
                                                    const urun = urunDetaylari[item.product_id];
                                                    if (!urun) return null;

                                                    return (
                                                        <div 
                                                            key={index} 
                                                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg transition-colors ${
                                                                siparis.status === 'cancelled'
                                                                    ? 'bg-gray-200 text-gray-600'
                                                                    : 'bg-gray-50 hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            <div className="w-20 h-20 sm:w-20 sm:h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={urun.image_url}
                                                                    alt={urun.title}
                                                                    fill
                                                                    className={`object-cover ${siparis.status === 'cancelled' ? 'opacity-70' : ''}`}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className={`font-semibold text-md ${siparis.status === 'cancelled' ? 'text-gray-700' : 'text-gray-900'}`}>
                                                                    {urun.name || urun.title}
                                                                </p>
                                                                <p className="text-gray-600 text-sm">
                                                                    {item.quantity} adet x {urun.price.toFixed(2)} ₺
                                                                </p>
                                                                <p className="text-gray-500 mt-1 text-sm line-clamp-1">{urun.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`font-bold text-md ${siparis.status === 'cancelled' ? 'text-gray-600' : 'text-red-500'}`}>
                                                                    {(item.quantity * urun.price).toFixed(2)} ₺
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sipariş İpuçları Bölümü */}
            {!hideHero && (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Sipariş Bilgileri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 text-red-500">Sipariş Takibi</h3>
                            <p className="text-gray-600">Siparişlerinizi bu sayfadan kolayca takip edebilirsiniz. Sipariş durumları anlık olarak güncellenir.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 text-red-500">Teslimat Süresi</h3>
                            <p className="text-gray-600">Siparişleriniz genellikle 30-45 dakika içerisinde hazırlanıp adresinize teslim edilir.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 text-red-500">Sipariş İptali</h3>
                            <p className="text-gray-600">Siparişiniz hazırlanmaya başlamadan önce iptal edilebilir. Detaylı bilgi için bizimle iletişime geçin.</p>
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* CTA Section */}
            {!hideHero && (
            <section className="py-12 bg-red-500 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Yeni Bir Sipariş Verin</h2>
                    <p className="mb-8 max-w-2xl mx-auto">
                        Lezzetli yemeklerimizden sipariş vermek için menümüze göz atın.
                    </p>
                    <Link
                        href="/siparis-ver"
                        className="inline-block bg-white text-red-500 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                    >
                        Sipariş Ver
                    </Link>
                </div>
            </section>
            )}
        </div>
    );
};

// Ana bileşen
export default function Siparislerim(props) {
    return (
        <SiparislerimContent hideHero={props.hideHero} />
    );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // URL parametresini kontrol et ve formu buna göre ayarla
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'register') {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [searchParams]);

  // Giriş yapmış kullanıcı kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-auth`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          router.push('/');
        }
      } catch (error) {
        console.error('Auth kontrolü hatası:', error);
      }
    };

    checkAuth();
  }, [router]);

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      iconColor: icon === 'success' ? '#10b981' : '#dc2626',
      confirmButtonColor: '#dc2626',
      background: '#1f1f1f',
      color: '#fff',
      confirmButtonText: 'Tamam',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content',
        confirmButton: 'swal-custom-confirm'
      },
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      },
      buttonsStyling: true,
      padding: '2em',
      timerProgressBar: true,
      timer: 3000,
      toast: false,
      position: 'center',
      allowOutsideClick: false,
      backdrop: `
        rgba(0,0,0,0.75)
      `
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      const endpoint = isSignup ? 'register' : 'login';
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (!isSignup) {
          showAlert('Başarılı!', 'Giriş yapıldı, yönlendiriliyorsunuz...', 'success');
          setTimeout(() => {
            router.push('/');
            window.location.reload();
          }, 2000);
        } else {
          setIsSignup(false);
          setFormData({
            email: '',
            name: '',
            password: ''
          });
          showAlert('Başarılı!', 'Kayıt işlemi tamamlandı, giriş yapabilirsiniz.', 'success');
        }
      } else {
        const errorData = await response.json();
        setFormError(errorData.error || (isSignup ? 'Kayıt işlemi başarısız!' : 'Giriş işlemi başarısız!'));
      }
    } catch (error) {
      console.error(isSignup ? 'Kayıt hatası:' : 'Giriş hatası:', error);
      setFormError(isSignup ? 'Kayıt olurken bir hata oluştu!' : 'Giriş yapılırken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/burger.jpg")' }}></div>
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
        <div className="max-w-md w-full bg-black/30 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignup ? "Hesap Oluşturun" : "Hesabınıza Giriş Yapın"}
            </h2>
            <p className="text-gray-300">
              {isSignup ? "Zaten hesabınız var mı?" : "Veya"}{' '}
              <button 
                onClick={() => {
                  setIsSignup(!isSignup);
                  setFormError('');
                }} 
                className="font-medium text-amber-400 hover:text-amber-300"
              >
                {isSignup ? "Giriş yapın" : "yeni bir hesap oluşturun"}
              </button>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {formError && (
              <div className="bg-red-900/60 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-300">{formError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-gray-900/70 text-white focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md placeholder-gray-400"
                    placeholder="ornek@mail.com"
                  />
                </div>
              </div>
              
              {isSignup && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-900/70 text-white focus:ring-amber-500 focus:border-amber-500 block w-full pl-3 pr-3 py-3 border border-gray-700 rounded-md placeholder-gray-400"
                    placeholder="Ad Soyad"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-gray-900/70 text-white focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 rounded bg-gray-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Beni hatırla
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-400 hover:text-amber-300">
                    Şifrenizi mi unuttunuz?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaSignInAlt className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                </span>
                {loading ? (isSignup ? 'Kayıt yapılıyor...' : 'Giriş yapılıyor...') : (isSignup ? 'Kayıt Ol' : 'Giriş Yap')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

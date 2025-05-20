import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope,FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 border-t-8 border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">E</span>
              </div>
              <span className="text-white font-bold text-lg">Elmalı Restorant</span>
            </Link>
            <p className="text-gray-400 text-sm">
              2001 yılından beri İzmir'de lezzet ve kaliteyi bir araya getiriyoruz. Geleneksel tatları modern yorumlarla buluşturarak misafirlerimize unutulmaz bir deneyim sunuyoruz.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="/www.instagram.com/elmalitech/" className="text-gray-400 hover:text-white">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/elmalitech/" className="text-gray-400 hover:text-white">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Linkler */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-4">Linkler</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/menu" className="text-gray-400 hover:text-white transition-colors">Menü</Link></li>
              <li><Link href="/siparis" className="text-gray-400 hover:text-white transition-colors">Online Sipariş</Link></li>
              <li><Link href="/seflerimiz" className="text-gray-400 hover:text-white transition-colors">Şeflerimiz</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-4">İletişim Bilgileri</h3>
            <div className="flex items-start mb-4">
              <div className="mt-1 mr-4 text-red-500">
                <FaMapMarkerAlt size={18} />
              </div>
              <p className="text-gray-400">
                İzmir Kuzey Tekmer, Atatürk Cad. No:123<br />
                Konak, İzmir 35000
              </p>
            </div>
            <div className="flex items-start mb-4">
              <div className="mt-1 mr-4 text-red-500">
                <FaPhone size={18} />
              </div>
              <p className="text-gray-400">
                +90 (232) 123 45 67<br />
                +90 (232) 765 43 21
              </p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-red-500">
                <FaEnvelope size={18} />
              </div>
              <p className="text-gray-400">
                info@elmalirestorant.com<br />
                rezervasyon@elmalirestorant.com
              </p>
            </div>
          </div>

          {/* Bülten */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-4">En Son Duyurularımız</h3>
            <form className="mt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-l focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded-r hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Alt Footer */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Elmalı Restorant - Tüm Hakları Saklıdır.
          </p>
          <div className="mt-4 md:mt-0">
            <Link href="/kullanim-kosullari" className="text-gray-400 text-sm hover:text-white mr-4">
              Kullanım Koşulları
            </Link>
            <Link href="/gizlilik-politikasi" className="text-gray-400 text-sm hover:text-white">
              Gizlilik Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
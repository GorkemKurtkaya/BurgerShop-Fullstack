# 🍔 Restoran Sipariş ve Yönetim Sistemi

Bu proje, Elmalı Tech staj programı kapsamında geliştirilmiş bir **web tabanlı restoran sipariş ve yönetim sistemidir**. Kullanıcılar online olarak sipariş verebilirken, işletme sahipleri bu siparişleri anlık olarak takip edebilir. Modern yazılım mimarileri kullanılarak hem kullanıcı deneyimi hem de teknik sürdürülebilirlik ön planda tutulmuştur.

## 👨‍💻 Geliştiriciler
- Görkem Kurtkaya  
- Ahmet Buğra Kadıoğlu

## 📌 Proje Özeti

Web uygulaması üzerinden:
- Kullanıcılar menüdeki ürünleri inceleyip sepetlerine ekleyebilir.
- Güvenli bir şekilde ödeme yapabilirler.
- İşletme sahipleri siparişleri gerçek zamanlı takip edebilir.

Bu süreçlerde **JWT authentication**, **mikroservis mimarisi**, **anlık veri aktarımı**, **ödeme entegrasyonu** gibi gelişmiş teknolojiler kullanılmıştır.

---

## 🧰 Kullanılan Teknolojiler

### ⚙️ Backend
- **Node.js & Express.js**: RESTful API geliştirme.
- **Supabase**
  - **PostgreSQL**: Veritabanı çözümü.
  - **Auth**: Kullanıcı kimlik doğrulama (JWT tabanlı).
- **Redis**: Hızlı ve geçici veri saklama (sepet yönetimi).
- **Stripe API**: Güvenli test kartlarıyla ödeme entegrasyonu.
- **Kafka**: Mikroservisler arası iletişim.
- **Socket.IO**: Siparişlerin admin paneline anlık aktarımı.
- **Mikroservis Mimarisi**: Fatura oluşturma işlemi bağımsız bir servis olarak ayrıldı.

### 💻 Frontend
- **Next.js**: SSR (Server Side Rendering) destekli modern frontend framework.
- **Tailwind CSS**: Hızlı ve ölçeklenebilir stillendirme.
- **Ant Design**: Admin paneli için kullanıcı dostu bileşenler.
- **Context API**: Global durum yönetimi.
- **Bileşen Tabanlı Yapı**: Tekrar kullanılabilir UI yapısı.

---

## 🚀 Canlı Sunucu Bilgileri

| Servis       | URL |
|--------------|-----|
| **Frontend** (AWS App Runner) | [Frontend Linki](https://c2f6rapdaj.eu-central-1.awsapprunner.com/) |
| **Backend** (Google Cloud Run) | [Backend Linki](https://gcloudetest-559293271562.europe-west1.run.app/) |
| **Mikroservis** (Fatura) | [Fatura Servisi](https://microservice-559293271562.europe-west1.run.app) |

---

## ✅ Proje Özellikleri

- ✅ Online sipariş sistemi  
- ✅ Gerçek zamanlı admin paneli  
- ✅ Stripe ile ödeme entegrasyonu  
- ✅ Mikroservislerle ayrılmış görev dağılımı  
- ✅ Socket.io ile anlık bildirim  
- ✅ JWT ile güvenli oturumlar  
- ✅ Supabase ile kullanıcı yönetimi  
- ✅ Redis ile hızlı sepet işlemleri

---

## 📊 Katkı Dağılımı

| Geliştirici | Görev |
|-------------|-------|
| **Görkem Kurtkaya** | Backend mimarisi, mikroservis entegrasyonu, ödeme sistemi (Stripe), Socket.IO ile anlık iletişim, veritabanı yapısı (Supabase & Redis), frontend geliştirme (kullanıcı arayüzleri, admin paneli, responsive tasarım) |
| **Ahmet Buğra Kadıoğlu** | Frontend geliştirme, kullanıcı arayüzleri, tasarım düzenlemeleri |

---

## 🙏 Teşekkür

Bu projeyi geliştirme sürecinde desteklerini esirgemeyen **Elmalı Tech ailesine**, bize rehberlik eden mentorlarımıza ve birlikte keyifle çalıştığım ekip arkadaşıma teşekkür ederim.  
Bu proje, yazılım alanındaki gelişimimde önemli bir yapı taşı olmuş ve kariyerime güçlü bir temel kazandırmıştır.

---

## 🏷️ Etiketler
`#Next.js` `#Node.js` `#Supabase` `#Stripe` `#Redis` `#Kafka` `#Socket.IO` `#Mikroservis` `#StajProjesi`


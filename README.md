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


##  Ekran Görüntüleri

### 👨‍🍳 Kullanıcı Arayüzü (Müşteri Tarafı)

| 1. Ana Sayfa | 2. Menü |
|--------------|--------|
| <img width="400" alt="Ana Sayfa" src="https://github.com/user-attachments/assets/1bb10c62-5e26-463e-8759-12ab94a0d0a3" /> | <img width="400" alt="Menü" src="https://github.com/user-attachments/assets/b96b9aee-e989-4bc1-ad41-f3e8bb1c984b" /> |

| 3. Sipariş Ver | 4. Sepetim |
|----------------|-----------|
| <img width="400" alt="Sipariş Ver" src="https://github.com/user-attachments/assets/1b146b54-aedd-4b25-9e19-243fed572d50" /> | <img width="400" alt="Sepetim" src="https://github.com/user-attachments/assets/dd373ce9-0677-460a-9adb-2189a4138bf2" /> |

| 5. Stripe ile Ödeme Sayfası | 6. Siparişlerim |
|-----------------------------|-----------------|
| <img width="400" alt="Ödeme Sayfası" src="https://github.com/user-attachments/assets/76068539-4ff9-43d9-811a-75b91c81c6ca" /> | <img width="400" alt="Siparişlerim" src="https://github.com/user-attachments/assets/37beb1d9-9eb1-4aaf-94f3-22776f36f98c" /> |

### 👨‍💼 Yönetici Paneli (Admin Tarafı)

| 7. Admin Panel Ana Sayfası | 8. Menü Yönetimi |
|---------------------------|------------------|
| <img width="400" alt="Admin Ana Sayfa" src="https://github.com/user-attachments/assets/44a99d00-f79b-4039-81fe-7acb218e20d2" /> | <img width="400" alt="Menü Yönetimi" src="https://github.com/user-attachments/assets/5d8f761f-a926-4726-8fb1-aa65e9f9f5f6" /> |

| 9. Siparişler | 10. Raporlar |
|---------------|--------------|
| <img width="400" alt="Siparişler" src="https://github.com/user-attachments/assets/d8180c58-d093-478f-8e38-565064ee6972" /> | <img width="400" alt="Raporlar" src="https://github.com/user-attachments/assets/c280bb17-cfc7-41f9-b89e-e74acff505f6" /> |

| 11. Rapor Detayları | 12. Raporun Devamı |
|---------------------|--------------------|
| <img width="400" alt="Rapor Detayları" src="https://github.com/user-attachments/assets/3dd55669-9e99-4856-ac2c-fef82a013225" /> | <img width="400" alt="Rapor Devamı" src="https://github.com/user-attachments/assets/903a13bf-459a-4e52-af37-c79afabe1386" /> |


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


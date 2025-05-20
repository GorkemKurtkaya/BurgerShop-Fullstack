# Restaurant Admin Panel

Bu proje, bir restoran yönetim sistemi için admin panel uygulamasıdır. Next.js ve Tailwind CSS kullanılarak geliştirilmiştir.

## Özellikler

- 📊 Dashboard ile genel istatistikler
- 👥 Kullanıcı yönetimi
- 🍽️ Sipariş yönetimi
- 📱 Responsive tasarım
- 🎨 Modern ve kullanıcı dostu arayüz

## Teknolojiler

- Next.js 14
- React
- Tailwind CSS
- Docker

## Başlangıç

### Gereksinimler

- Node.js 18 veya üzeri
- npm veya yarn
- Docker (opsiyonel)

### Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd restaurant-admin
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

4. Tarayıcınızda [http://localhost:5173](http://localhost:5173) adresini açın.

### Docker ile Çalıştırma

```bash
docker-compose up --build
```

## Proje Yapısı

```
frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   └── users/
│   │   └── layout.jsx
│   ├── components/
│   └── styles/
├── public/
├── package.json
└── tailwind.config.js
```

## Özellikler Detayı

### Dashboard
- Toplam sipariş sayısı
- Toplam gelir
- Aktif siparişler
- Toplam kullanıcı sayısı
- Son siparişler listesi

### Sipariş Yönetimi
- Sipariş listesi görüntüleme
- Sipariş durumu güncelleme
- Sipariş detayları görüntüleme
- Sipariş filtreleme

### Kullanıcı Yönetimi
- Kullanıcı listesi görüntüleme
- Kullanıcı durumu güncelleme
- Kullanıcı detayları görüntüleme
- Kullanıcı filtreleme

## Geliştirme

### Kod Stili

- ESLint ve Prettier kullanılmaktadır
- Tailwind CSS ile stil tanımlamaları
- Component-based mimari

### Yeni Özellik Ekleme

1. İlgili route'u oluşturun
2. Gerekli componentleri ekleyin
3. API entegrasyonunu yapın
4. Test edin



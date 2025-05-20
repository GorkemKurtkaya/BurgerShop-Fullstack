import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import supabase from './config/supabaseClient.js';
import { google } from 'googleapis';

// Google Drive API yapılandırması
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), 'google-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export const createInvoicePDF = async (invoice) => {
  try {
    // Sipariş detaylarını veritabanından çek
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', invoice.order_id)
      .single();

    if (orderError) throw new Error(`Sipariş detayları alınamadı: ${orderError.message}`);

    // Ürün detaylarını ayrı bir sorgu ile al
    const productIds = order.products.map(p => p.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price')
      .in('id', productIds);

    if (productsError) throw new Error(`Ürün detayları alınamadı: ${productsError.message}`);

    // Ürün bilgilerini sipariş bilgileriyle birleştir
    const orderProducts = order.products.map(orderProduct => {
      const product = products.find(p => p.id === orderProduct.product_id);
      return {
        ...orderProduct,
        title: product?.title || 'Ürün Bulunamadı',
        price: product?.price || 0
      };
    });

    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const pdfPath = path.join(invoicesDir, `invoice-${invoice.id}.pdf`);
    const fontPath = path.join(process.cwd(), 'fonts', 'Roboto-Medium.ttf');

    // Font dosyasının varlığını kontrol et
    if (!fs.existsSync(fontPath)) {
      throw new Error('Roboto-Medium.ttf font dosyası bulunamadı!');
    }

    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50
    });

    // Fontu yükle
    doc.registerFont('Roboto', fontPath);
    doc.font('Roboto');

    return new Promise(async (resolve, reject) => {
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Başlık
      doc.fontSize(20)
         .text('FATURA', 200, 50, { align: 'center' })
         .fontSize(10)
         .text('Elmalı Restoran', 200, 80, { align: 'center' })
         .text('Adres: Ahmet Piriştina Kültür Merkezi, Şemikler, Ordu Blv No: 210, 35560 Karşıyaka/İzmir', 200, 95, { align: 'center'})
         .text('E-posta: contact@elmalitech.com', 200, 130, { align: 'center' })
         .moveDown();

      // Fatura Bilgileri
      doc.fontSize(12)
         .text(`Fatura No: ${invoice.id}`, 50, 150)
         .text(`Tarih: ${new Date().toLocaleString('tr-TR')}`, 50, 170)
         .text(`Sipariş No: ${order.id}`, 50, 190)
         .moveDown();

      // Müşteri Bilgileri
      doc.fontSize(12)
         .text('MÜŞTERİ BİLGİLERİ', 50, 220)
         .fontSize(10)
         .text(`Adres: ${order.address || 'Belirtilmemiş'}`, 50, 260)
         .moveDown();

      // Ürün Tablosu
      const tableTop = 300;
      const itemCodeX = 50;
      const descriptionX = 150;
      const quantityX = 350;
      const priceX = 400;
      const amountX = 500;

      // Tablo Başlığı
      doc.fontSize(10)
         .text('Ürün Kodu', itemCodeX, tableTop)
         .text('Ürün Adı', descriptionX, tableTop)
         .text('Adet', quantityX, tableTop)
         .text('Birim Fiyat', priceX, tableTop)
         .text('Toplam', amountX, tableTop);

      // Ürün Listesi
      let y = tableTop + 20;
      orderProducts.forEach(product => {
        doc.fontSize(10)
           .text(product.product_id.substring(0, 8), itemCodeX, y)
           .text(product.title, descriptionX, y)
           .text(product.quantity.toString(), quantityX, y)
           .text(`${product.price.toFixed(2)} TL`, priceX, y)
           .text(`${(product.price * product.quantity).toFixed(2)} TL`, amountX, y);
        y += 20;
      });

      // Toplam
      doc.fontSize(12)
         .text('TOPLAM:', priceX, y + 20)
         .text(`${order.amount.toFixed(2)} TL`, amountX, y + 20);

      // Alt Not
      doc.fontSize(10)
         .text('Teşekkür ederiz!', 200, y + 50, { align: 'center' })
         .text('Bu fatura elektronik ortamda oluşturulmuştur.', 200, y + 70, { align: 'center' });

      // PDF'i sonlandır
      doc.end();

      writeStream.on('finish', async () => {
        try {
          // PDF'i Google Drive'a yükle
          const fileMetadata = {
            name: `fatura-${invoice.id}.pdf`,
            parents: ['1yq_KE3al7tguaalteJFdMgzZVUNzdbsn']
          };

          const media = {
            mimeType: 'application/pdf',
            body: fs.createReadStream(pdfPath),
          };


          const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
          });

          // PDF dosyasını yerel diskten sil
          fs.unlinkSync(pdfPath);

          console.log('PDF Google Drive\'a yüklendi:', response.data.webViewLink);
          resolve(response.data.webViewLink);
        } catch (error) {
          console.error('Google Drive yükleme hatası:', error);
          console.error('Hata detayları:', {
            message: error.message,
            code: error.code,
            errors: error.errors
          });
          reject(error);
        }
      });

      writeStream.on('error', (error) => {
        console.error('PDF oluşturma hatası:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('PDF oluşturma işleminde hata:', error);
    throw error;
  }
};

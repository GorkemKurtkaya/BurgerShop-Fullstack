import express from 'express';
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { createInvoicePDF } from './pdfGenerator.js';
import supabase from './config/supabaseClient.js';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
app.use(express.json());

// Cloudinary yapılandırması
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Supabase bağlantı kontrolü
const checkSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('invoices').select('count').limit(1);
        if (error) throw error;
        console.log('Supabase bağlantısı başarılı');
    } catch (error) {
        console.error('Supabase bağlantı hatası:', error);
        throw error;
    }
};

// Kafka ayar
const kafka = new Kafka({
    clientId: 'invoice-service',
    brokers: ['pkc-rgm37.us-west-2.aws.confluent.cloud:9092'],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.CONFLUENT_API_KEY,
      password: process.env.CONFLUENT_API_SECRET,
    },
    // brokers: ['kafka:9092'],

    // LOCALDE ÇALIŞTIRMAK İÇİN AŞAĞIDAKİ KODU KULLANINIZ
    // brokers:['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'invoice-group' });


const run = async () => {
    try {
        // Önce Supabase bağlantısını kontrol et
        await checkSupabaseConnection();

        await consumer.connect();
        console.log('Kafka consumer bağlantısı başarılı');
        
        await consumer.subscribe({ topic: 'payment-success', fromBeginning: true });
        console.log('payment-success topic\'ine abone olundu');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const paymentInfo = JSON.parse(message.value.toString());
                    console.log('Fatura Bilgisi Geldi:', paymentInfo);
                    await createInvoice(paymentInfo);
                } catch (error) {
                    console.error('Mesaj işleme hatası:', error);
                }
            },
        });
    } catch (error) {
        console.error('Kafka consumer hatası:', error);
    }
};

// Fatura oluştur
const createInvoice = async (paymentInfo) => {
    const { orderId, user_id, amount, products } = paymentInfo;

    try {
        // 1. Veritabanına invoice kaydet
        const { data: invoice, error: insertError } = await supabase
            .from('invoices')
            .insert([
                { order_id: orderId, user_id: user_id, amount: amount, products: products }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Veritabanı kayıt hatası:', insertError);
            throw insertError;
        }
        console.log('Fatura Veritabanına Kaydedildi:', invoice);

        // 2. PDF oluştur ve Google Drive'a yükle
        try {
            const pdfUrl = await createInvoicePDF(invoice);
            console.log('PDF Google Drive\'a yüklendi:', pdfUrl);

            // 3. Veritabanında pdf_url güncelle
            const { error: updateError } = await supabase
                .from('invoices')
                .update({ pdf_url: pdfUrl })
                .eq('id', invoice.id);

            if (updateError) {
                console.error('PDF URL güncelleme hatası:', updateError);
                throw updateError;
            }

            console.log('Fatura PDF oluşturuldu ve Google Drive\'a yüklendi.');
        } catch (pdfError) {
            console.error('PDF işleme hatası:', pdfError);
            throw pdfError;
        }
    } catch (error) {
        console.error('Fatura oluşturulurken hata:', error);
        throw error;
    }
};

const PORT = process.env.PORT || 4500;

app.get('/', (req, res) => {
    res.send('✅ Fatura Service Çalışıyor');
}
);

app.listen(PORT, () => {
    console.log(`Fatura Service ${PORT} portunda çalışıyor`);
    run().catch(console.error);
});

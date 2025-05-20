import express from "express";
const router = express.Router();
import { getProductById } from "../services/productService.js";
import { createOrderService, updateOrderStatus } from "../services/orderService.js";
import Stripe from "stripe";
import { sendMessage } from '../utils/kafka.js';
import { getIO } from "../utils/socket.js";
import { removeCart } from "../services/basketService.js";
import axios from "axios";


const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { user_id, products, address } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error("Ürün listesi boş!");
    }

    // Supabase'den ürün detaylarını çekiyoruz
    const line_items = [];

    for (const product of products) {
      const productData = await getProductById(product.product_id);

      if (!productData) {
        throw new Error(`Ürün bulunamadı: ${product.product_id}`);
      }

      console.log('Ürün verisi:', productData);

      if (!productData.title) {
        throw new Error(`Ürün adı bulunamadı: ${product.product_id}`);
      }

      line_items.push({
        price_data: {
          currency: 'try',
          product_data: {
            name: productData.title,
            description: productData.description || '',
            images: productData.image_url ? [productData.image_url] : [],
          },
          unit_amount: Math.round(productData.price * 100),
        },
        quantity: product.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.FRONTEND_URL}/siparislerim?order_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        user_id,
        address,
        products: JSON.stringify(products)
      }
    });

    // Siparişi oluştur
    const order = await createOrderService({
      user_id,
      products,
      address,
      payment_id: session.id,
      status: 'pending'
    });

    console.log('Sipariş başarıyla oluşturuldu:', order);

    // Socket.io instance'ını al
    try {
      console.log('Socket.io instance alınıyor...');
      const io = getIO();
      console.log('Socket.io instance alındı, bildirim gönderiliyor...');
      
      io.emit("orderCreated", {
        message: "Yeni sipariş oluşturuldu",
        order: {
          id: order.id,
          user_id: user_id,
          status: 'pending',
          created_at: new Date(),
          amount: session.amount_total / 100
        }
      });
      
      console.log('Socket.io bildirimi gönderildi');
    } catch (socketError) {
      console.error('Socket.io hatası:', socketError);
    }

    res.json({ url: session.url, order_id: order.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook'u için endpoint
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Ödeme başarılı olduğunda sipariş durumunu güncelle
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { user_id, products, address } = session.metadata;

    try {
      // Sipariş durumunu güncelle
      await updateOrderStatus(session.payment_intent, "approved");

      await removeCart({ userId: user_id });

      // Kafka'ya fatura bilgilerini gönder
      await sendMessage('payment-success', JSON.stringify({
        orderId: session.payment_intent,
        user_id: user_id,
        amount: session.amount_total / 100, // Stripe cent cinsinden tutar gönderir
        products: products
      }));

      // Sipariş oluşturulduktan sonra socket.io ile bildirim gönder
      const io = getIO();
      io.emit("orderCreated", {
        message: "Yeni sipariş oluşturuldu",
        order,
      });

      console.log('Sipariş durumu güncellendi ve bildirim gönderildi');
    } catch (error) {
      console.error('Sipariş güncelleme hatası:', error);
    }
  }

  res.json({ received: true });
});

export default router;

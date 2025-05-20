import supabase from "../config/supabaseClient.js";
import { sendMessage } from '../utils/kafka.js';

// Ürünlerin toplam fiyatını hesapla
const calculateOrderAmount = async (products) => {
  const productIds = products.map(product => product.product_id);
  
  const { data: dbProducts, error } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  if (error) throw new Error(error.message);

  // Toplam tutarı hesapla
  const totalAmount = products.reduce((total, cartItem) => {
    const product = dbProducts.find(p => p.id === cartItem.product_id);
    if (!product) throw new Error(`Ürün bulunamadı: ${cartItem.product_id}`);
    return total + (product.price * cartItem.quantity);
  }, 0);

  return totalAmount;
};

// Sipariş oluşturma
const createOrderService = async ({ user_id, products, address }) => {
  // Toplam tutarı hesapla
  const amount = await calculateOrderAmount(products);

  const { data, error } = await supabase
    .from("orders")
    .insert([{ user_id, products, amount, address }])
    .select();

  if (error) throw new Error(error.message);

  // Kafka'ya fatura bilgilerini gönder
  try {
    await sendMessage('payment-success', JSON.stringify({
      orderId: data[0].id,
      user_id: user_id, // Kullanıcı adını buradan alabilirsiniz
      amount: amount,
      products: products
    }));
  } catch (kafkaError) {
    console.error('Kafka mesajı gönderilirken hata:', kafkaError);
  }

  return data[0];
};

// Tüm Siparişleri Getir

const getAllOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");
    
    if (error) throw new Error(error.message);
    
    return data;
};

// Kullanıcının tüm siparişlerini getir
const getOrdersByUser = async (user_id) => {
  const { data, error } = await supabase.from("orders").select("*").eq("user_id", user_id);

  if (error) throw new Error(error.message);

  return data;
};

// Tek bir siparişi getir
const getOrderById = async (id) => {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();

  if (error) throw new Error(error.message);

  return data;
};

// Sipariş durumunu güncelle
const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select();

  if (error) throw new Error(error.message);

  return data[0];
};

// Siparişi sil
const deleteOrder = async (id) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return { message: "Order deleted successfully" };
};

export { createOrderService, getOrdersByUser, getOrderById, updateOrderStatus, deleteOrder,getAllOrders };

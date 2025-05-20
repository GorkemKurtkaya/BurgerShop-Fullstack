import { createOrderService, getOrdersByUser, getOrderById, updateOrderStatus, deleteOrder,getAllOrders } from "../services/orderService.js";
import logger from "../utils/logger.js";


// Sipariş oluşturma
const createOrder = async (req, res) => {
  try {
    logger.info("Sipariş Oluşturma İşlemi Başladı");
    const { user_id, products, address } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error("Geçerli ürün listesi gönderilmedi");
    }

    // products array'inin doğru formatta olduğunu kontrol et
    products.forEach(product => {
      if (!product.product_id || !product.quantity || product.quantity <= 0) {
        throw new Error("Her ürün için geçerli product_id ve quantity değerleri gerekli");
      }
    });
    const order = await createOrderService({ user_id, products, address });
    logger.info("Sipariş Başarıyla Oluşturuldu");
    res.status(201).json({ message: "Sipariş başarıyla oluşturuldu", order });
  } catch (error) {
    logger.error("Sipariş Oluşturulurken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Tüm Siparişleri Getir
const fetchAllOrders = async (req, res) => {
    try {
        logger.info("Tüm Siparişleri Getirme İşlemi Başladı");
        const orders = await getAllOrders();
        logger.info("Tüm Siparişler Başarıyla Getirildi");
        res.status(200).json(orders);
    } catch (error) {
        logger.error("Siparişleri Getirirken Hata:", error);
        res.status(400).json({ error: error.message });
    }
};

// Kullanıcının siparişlerini getir
const fetchUserOrders = async (req, res) => {
  try {
    logger.info("Kullanıcı Siparişlerini Getirme İşlemi Başladı");
    const { user_id } = req.params;
    const orders = await getOrdersByUser(user_id);
    logger.info("Kullanıcı Siparişleri Başarıyla Getirildi");
    res.status(200).json(orders);
  } catch (error) {
    logger.error("Kullanıcı Siparişlerini Getirirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Tek bir siparişi getir
const fetchOrderById = async (req, res) => {
  try {
    logger.info("Sipariş Detayı Getirme İşlemi Başladı");
    const { id } = req.params;
    const order = await getOrderById(id);
    logger.info("Sipariş Detayı Başarıyla Getirildi");
    res.status(200).json(order);
  } catch (error) {
    logger.error("Sipariş Detayı Getirilirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Sipariş durumunu güncelle
const changeOrderStatus = async (req, res) => {
  try {
    logger.info("Sipariş Durumu Güncelleme İşlemi Başladı");
    const { id } = req.params;
    const { status } = req.body;
    const order = await updateOrderStatus(id, status);
    logger.info("Sipariş Durumu Başarıyla Güncellendi");
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    logger.error("Sipariş Durumu Güncellenirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Siparişi sil
const removeOrder = async (req, res) => {
  try {
    logger.info("Sipariş Silme İşlemi Başladı");
    const { id } = req.params;
    const result = await deleteOrder(id);
    logger.info("Sipariş Başarıyla Silindi");
    res.status(200).json(result);
  } catch (error) {
    logger.error("Sipariş Silinirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Siparişleri kontrol et ve zamanı geçenleri iptal et
const checkAndUpdateOrderStatus = async (req, res) => {
  try {
    logger.info("Sipariş Zaman Kontrolü İşlemi Başladı");
    const orders = await getAllOrders();
    let updatedCount = 0;
    
    for (const order of orders) {
      // Sadece "pending" durumundaki siparişleri kontrol et
      if (order.status === "pending") {
        const orderDate = new Date(order.created_at);
        const currentDate = new Date();
        const diffInHours = (currentDate - orderDate) / (1000 * 60 * 60); // saat cinsinden fark
        
        // Sipariş 1 saatten daha eski ve hala hazırlanıyor durumuna geçmediyse
        if (diffInHours > 1) {
          await updateOrderStatus(order.id, "cancelled");
          updatedCount++;
          logger.info(`Sipariş ${order.id} zaman aşımı nedeniyle iptal edildi.`);
        }
      }
    }
    
    logger.info(`Sipariş Zaman Kontrolü Tamamlandı. ${updatedCount} sipariş güncellendi.`);
    res.status(200).json({ 
      message: "Orders checked and updated successfully", 
      updated_count: updatedCount 
    });
  } catch (error) {
    logger.error("Sipariş Zaman Kontrolü Sırasında Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

export { createOrder, fetchUserOrders, fetchOrderById, changeOrderStatus, removeOrder, fetchAllOrders, checkAndUpdateOrderStatus };
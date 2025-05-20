import supabase from "../config/supabaseClient.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Ürün ekleme
const addProduct = async (productData, imageFilePath) => {
  try {
    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(imageFilePath, {
      use_filename: true,
      folder: "intern_project",
    });

    const image_url = result.secure_url;

    // Eksik olan satır! Cloudinary'den dönen URL'yi productData'ya ekleyelim:
    productData.image_url = image_url;

    if (!productData.title || !productData.description || !productData.category || !productData.price || !image_url) {
      throw new Error("Tüm alanları doldurunuz");
    }

    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select();

    if (error) throw new Error(error.message);

    return data[0];
  } catch (error) {
    throw new Error(`Ürün eklenirken hata oluştu: ${error.message}`);
  }
};

// Tüm ürünleri getir
const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) throw new Error(error.message);

  return data;
};

// Tek bir ürünü getir
const getProductById = async (id) => {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error) throw new Error(error.message);

  return data;
};

// Ürün güncelleme
const updateProduct = async (id, updates, imageFilePath) => {
  try {
    let image_url = updates.image_url;

    // Eğer yeni bir resim yüklendiyse
    if (imageFilePath) {
      const result = await cloudinary.uploader.upload(imageFilePath, {
        use_filename: true,
        folder: "intern_project",
      });
      image_url = result.secure_url;
    }

    // Güncellenmiş veriyi hazırla
    const updatedData = {
      ...updates,
      image_url: image_url || updates.image_url
    };

    const { data, error } = await supabase
      .from("products")
      .update(updatedData)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);

    return data[0];
  } catch (error) {
    throw new Error(`Ürün güncellenirken hata oluştu: ${error.message}`);
  }
};

// Ürün silme
const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return { message: "Product deleted successfully" };
};

// Popüler ürünleri getir (sipariş miktarına göre)
const getPopularProducts = async (limit = 6) => {
  // Tüm siparişleri çek
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*");

  if (ordersError) throw new Error(ordersError.message);

  // Ürün istatistiklerini topla
  const productStats = {};

  orders.forEach(order => {
    if (order.products && Array.isArray(order.products)) {
      order.products.forEach(product => {
        const productId = product.product_id;
        if (!productStats[productId]) {
          productStats[productId] = 0;
        }
        productStats[productId] += product.quantity;
      });
    }
  });

  // Popülerliğe göre sırala
  const popularProductIds = Object.entries(productStats)
    .sort((a, b) => b[1] - a[1]) // Büyükten küçüğe sırala
    .slice(0, limit) // Belirtilen sayıda ürün al
    .map(entry => entry[0]); // Sadece ürün ID'lerini al

  if (popularProductIds.length === 0) {
    // Popüler ürün yoksa tüm ürünleri getir ve limit kadar döndür
    const { data: allProducts, error: productsError } = await supabase
      .from("products")
      .select("*")
      .limit(limit);

    if (productsError) throw new Error(productsError.message);
    return allProducts;
  }

  // Popüler ürünlerin detaylarını çek
  const { data: popularProducts, error: productsError } = await supabase
    .from("products")
    .select("*")
    .in("id", popularProductIds);

  if (productsError) throw new Error(productsError.message);

  // Popüler ürünleri sipariş sayısına göre sırala
  return popularProducts.sort((a, b) => {
    return (productStats[b.id] || 0) - (productStats[a.id] || 0);
  });
};

export { addProduct, getProducts, getProductById, updateProduct, deleteProduct, getPopularProducts };
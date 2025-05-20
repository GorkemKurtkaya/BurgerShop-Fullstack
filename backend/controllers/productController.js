import { addProduct, getProducts, getProductById, updateProduct, deleteProduct, getPopularProducts } from "../services/productService.js";
import fs from "fs";
import logger from "../utils/logger.js";

// Ürün ekleme
const createProduct = async (req, res) => {
  try {
    logger.info("Ürün Ekleme İşlemi Başladı");
    const product = await addProduct(req.body,req.files.image_url.tempFilePath);
    logger.info("Ürün Başarıyla Eklendi");
    res.status(201).json({ message: "Product added successfully", product });
    fs.unlink(req.files.image_url.tempFilePath, (err) => {
      if (err) {
        logger.error("Temp Dosya Silinemedi:", err);
      } else {
        logger.info("Temp Dosya Başarıyla Silindi");
      }
    });
  } catch (error) {
    if (req.files?.image_url?.tempFilePath) {
      fs.unlink(req.files.image_url.tempFilePath, (err) => {
        if (err) logger.error("Hata Temp Dosya Silinemedi:", err);
      });
    }
    logger.error("Ürün Eklenirken Hata:", error);
    res.status(500).json({
      succeeded: false,
      message: error.message,
    });
  }
};

// Tüm ürünleri getir
const fetchProducts = async (req, res) => {
  try {
    logger.info("Tüm Ürünleri Getirme İşlemi Başladı");
    const products = await getProducts();
    logger.info("Tüm Ürünler Başarıyla Getirildi");
    res.status(200).json(products);
  } catch (error) {
    logger.error("Ürünleri Getirirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Tek bir ürünü getir
const fetchProductById = async (req, res) => {
  try {
    logger.info("Ürün Detayı Getirme İşlemi Başladı");
    const { id } = req.params;
    const product = await getProductById(id);
    logger.info("Ürün Detayı Başarıyla Getirildi");
    res.status(200).json(product);
  } catch (error) {
    logger.error("Ürün Detayı Getirilirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Ürün güncelleme
const editProduct = async (req, res) => {
  try {
    logger.info("Ürün Güncelleme İşlemi Başladı");
    const { id } = req.params;
    const updates = req.body;
    const imageFilePath = req.files?.image_url?.tempFilePath;
    
    const product = await updateProduct(id, updates, imageFilePath);
    
    // Eğer geçici dosya varsa sil
    if (imageFilePath) {
      fs.unlink(imageFilePath, (err) => {
        if (err) {
          logger.error("Temp Dosya Silinemedi:", err);
        } else {
          logger.info("Temp Dosya Başarıyla Silindi");
        }
      });
    }
    
    logger.info("Ürün Başarıyla Güncellendi");
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    // Hata durumunda geçici dosyayı sil
    if (req.files?.image_url?.tempFilePath) {
      fs.unlink(req.files.image_url.tempFilePath, (err) => {
        if (err) logger.error("Hata Temp Dosya Silinemedi:", err);
      });
    }
    logger.error("Ürün Güncellenirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Ürün silme
const removeProduct = async (req, res) => {
  try {
    logger.info("Ürün Silme İşlemi Başladı");
    const { id } = req.params;
    const result = await deleteProduct(id);
    logger.info("Ürün Başarıyla Silindi");
    res.status(200).json(result);
  } catch (error) {
    logger.error("Ürün Silinirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

// Popüler ürünleri getir
const fetchPopularProducts = async (req, res) => {
  try {
    logger.info("Popüler Ürünleri Getirme İşlemi Başladı");
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;
    const products = await getPopularProducts(limit);
    logger.info("Popüler Ürünler Başarıyla Getirildi");
    res.status(200).json(products);
  } catch (error) {
    logger.error("Popüler Ürünleri Getirirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

export { createProduct, fetchProducts, fetchProductById, editProduct, removeProduct, fetchPopularProducts };
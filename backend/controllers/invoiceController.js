import{ getAllInvoices, getInvoiceById, getUserInvoices,getOrderInvoices } from "../services/invoiceService.js";
import logger from "../utils/logger.js";


const getInvoices = async (req, res) => {
    try {
        logger.info("Faturaları Getirme İşlemi Başladı");
        const invoices = await getAllInvoices();
        logger.info("Faturalar Başarıyla Getirildi");
        res.json(invoices);
    } catch (error) {
        logger.error("Faturaları Getirirken Hata:", error);
        res.status(400).json({ error: error.message });
    }
}


const getInvoice = async (req, res) => {
    try {
        logger.info("Fatura Detayı Getirme İşlemi Başladı");
        const invoice = await getInvoiceById(req.params.id);
        logger.info("Fatura Detayı Başarıyla Getirildi");
        res.json(invoice);
    } catch (error) {
        logger.error("Fatura Detayı Getirilirken Hata:", error);
        res.status(400).json({ error: error.message });
    }
}

const getUserInvoice = async (req, res) => {
    try {
        logger.info("Kullanıcı Faturalarını Getirme İşlemi Başladı");
        const user_id = req.params.user_id;
        const invoices = await getUserInvoices(user_id);
        logger.info("Kullanıcı Faturaları Başarıyla Getirildi");
        res.json(invoices);
    } catch (error) {
        logger.error("Kullanıcı Faturalarını Getirirken Hata:", error);
        res.status(400).json({ error: error.message });
    }
}

const getOrderInvoice = async (req, res) => {
    try {
        logger.info("Sipariş Faturalarını Getirme İşlemi Başladı");
        const order_id = req.params.order_id;
        const invoices = await getOrderInvoices(order_id);
        logger.info("Sipariş Faturaları Başarıyla Getirildi");
        res.json(invoices);
    } catch (error) {
        logger.error("Sipariş Faturalarını Getirirken Hata:", error);
        res.status(400).json({ error: error.message });
    }
}


export { getInvoices, getInvoice, getUserInvoice, getOrderInvoice };
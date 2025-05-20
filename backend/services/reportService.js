import supabase from "../config/supabaseClient.js";

const generateReport = async () => {
  try {
    // Tüm siparişleri getir
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    // Tüm ürünleri getir
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) throw productsError;

    // Ürün ID'lerine göre ürün bilgilerini map'le
    const productsMap = {};
    products.forEach(product => {
      productsMap[product.id] = product;
    });

    // Ürün satış istatistiklerini hesapla
    const productStats = {};
    let totalRevenue = 0;

    orders.forEach(order => {
      order.products.forEach(item => {
        const product = productsMap[item.product_id];
        if (!product) return; // Ürün bulunamadıysa atla
        
        if (!productStats[item.product_id]) {
          productStats[item.product_id] = {
            id: product.id,
            name: product.title,
            category: product.category,
            totalSold: 0,
            totalRevenue: 0
          };
        }
        
        productStats[item.product_id].totalSold += item.quantity;
        productStats[item.product_id].totalRevenue += product.price * item.quantity;
        totalRevenue += product.price * item.quantity;
      });
    });

    // En çok satılan ürünleri sırala
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);

    // Rapor verilerini hazırla
    const reportData = {
      totalOrders: orders.length,
      totalRevenue,
      averageOrderAmount: totalRevenue / orders.length,
      topProducts,
      orders: orders.map(order => ({
        id: order.id,
        userId: order.user_id,
        products: order.products.map(item => ({
          productId: item.product_id,
          productName: productsMap[item.product_id]?.title || 'Bilinmeyen Ürün',
          quantity: item.quantity,
          price: productsMap[item.product_id]?.price || 0
        })),
        amount: order.amount,
        address: order.address,
        status: order.status,
        createdAt: order.created_at
      }))
    };

    // Raporu veritabanına kaydet
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert([{
        total_orders: reportData.totalOrders,
        total_revenue: reportData.totalRevenue,
        average_order_amount: reportData.averageOrderAmount,
        top_products: reportData.topProducts,
        orders: reportData.orders,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (reportError) throw reportError;

    return report;
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error);
    throw error;
  }
};

const getAllReports = async () => {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return reports;
  } catch (error) {
    console.error('Raporları getirme hatası:', error);
    throw error;
  }
};

const getReportById = async (id) => {
  try {
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return report;
  } catch (error) {
    console.error('Rapor detayı getirme hatası:', error);
    throw error;
  }
};

export default {
  generateReport,
  getAllReports,
  getReportById
};
"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { IconPackage, IconChefHat, IconCircleCheck, IconMoped, IconCircleX } from '@tabler/icons-react';
import { useAdmin } from '@/contexts/AdminContext';

export default function OrdersPage() {
  const { isAdmin, isLoading: adminLoading, checkAdminAccess } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [expandedArchivedOrders, setExpandedArchivedOrders] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const isAdminValid = await checkAdminAccess();
      if (isAdminValid) {
        fetchOrders();
        fetchUsers();
      }
    };
    fetchData();
  }, [checkAdminAccess]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Siparişler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      
      // Siparişleri aktif ve arşivlenmiş olarak ayır
      const activeOrders = data.filter(order => order.status !== 'completed' && order.status !== 'cancelled');
      const completedOrders = data.filter(order => order.status === 'completed' || order.status === 'cancelled');
      
      setOrders(activeOrders);
      setArchivedOrders(completedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      
      // Siparişlerdeki tüm benzersiz ürün ID'lerini topla
      const productIds = new Set();
      data.forEach(order => {
        order.products.forEach(product => {
          productIds.add(product.product_id);
        });
      });

      // Her ürün için detay bilgilerini çek
      const productDetails = {};
      for (const productId of productIds) {
        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`, {
          credentials: 'include'
        });
        if (productResponse.ok) {
          const productData = await productResponse.json();
          productDetails[productId] = productData;
        }
      }
      setProducts(productDetails);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Kullanıcılar yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Sipariş durumu güncellenirken bir hata oluştu');
      }
      toast.success('Sipariş durumu başarıyla güncellendi');
      fetchOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleArchivedOrderExpansion = (orderId) => {
    setExpandedArchivedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          border: 'border-blue-200',
          hover: 'hover:bg-blue-100'
        };
      case 'preparing':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          hover: 'hover:bg-yellow-100'
        };
      case 'on_delivery':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-800',
          border: 'border-purple-200',
          hover: 'hover:bg-purple-100'
        };
      case 'completed':
        return {
          bg: 'bg-green-50',
          text: 'text-green-800',
          border: 'border-green-200',
          hover: 'hover:bg-green-100'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          border: 'border-red-200',
          hover: 'hover:bg-red-100'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-800',
          border: 'border-gray-200',
          hover: 'hover:bg-gray-100'
        };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Sipariş Alındı';
      case 'preparing':
        return 'Siparişiniz Hazırlanıyor';
      case 'on_delivery':
        return 'Siparişiniz Yola Çıktı';
      case 'completed':
        return 'Siparişiniz Tamamlandı';
      case 'cancelled':
        return 'Sipariş İptal Edildi';
      default:
        return 'Sipariş Alındı';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  const renderActiveOrdersTable = () => {
    // Siparişleri tarihe göre sırala (en yeni en üstte)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => {
                const user = users.find(u => u.id === order.user_id);
                const isExpanded = expandedOrders.has(order.id);
                const statusColors = getStatusColor(order.status);
                
                return (
                  <>
                    <tr 
                      key={order.id} 
                      className={`${statusColors.bg} ${statusColors.border} border-l-4 transition-colors cursor-pointer ${statusColors.hover}`} 
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user ? user.name : 'Bilinmeyen Kullanıcı'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.amount} TL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${statusColors.text} ${statusColors.bg}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className={`${statusColors.text} hover:opacity-80 font-medium`}>
                          {isExpanded ? 'Kapat' : 'Detaylar'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan="6" className={`px-6 py-4 ${statusColors.bg}`}>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-gray-900">Sipariş Durumu</h3>
                              <div className="flex flex-col space-y-2">
                                {[
                                  { status: 'pending', icon: <IconPackage />, text: 'Sipariş Alındı' },
                                  { status: 'preparing', icon: <IconChefHat />, text: 'Siparişiniz Hazırlanıyor' },
                                  { status: 'on_delivery', icon: <IconMoped />, text: 'Siparişiniz Yola Çıktı' },
                                  { status: 'completed', icon: <IconCircleCheck />, text: 'Siparişiniz Tamamlandı' },
                                  { status: 'cancelled', icon: <IconCircleX />, text: 'Sipariş İptal Edildi' }
                                ].map((statusOption) => {
                                  const optionColors = getStatusColor(statusOption.status);
                                  return (
                                    <button
                                      key={statusOption.status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(order.id, statusOption.status);
                                      }}
                                      className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                                        order.status === statusOption.status
                                          ? `${optionColors.bg} ${optionColors.text}`
                                          : 'hover:bg-gray-100'
                                      }`}
                                    >
                                      {statusOption.icon}
                                      <span>{statusOption.text}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-gray-900">Sipariş Detayları</h3>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Adres:</span> {order.address}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Sipariş Tarihi:</span> {new Date(order.created_at).toLocaleDateString('tr-TR')}
                                  <br />
                                  <span className="font-medium">Sipariş Saati:</span> {new Date(order.created_at).toLocaleTimeString('tr-TR')}
                                </p>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Ürünler:</span>
                                  <ul className="list-disc list-inside mt-1">
                                    {order.products.map((product, index) => (
                                      <li key={index}>
                                        {products[product.product_id]?.title || 'Ürün yükleniyor...'} x {product.quantity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderArchivedOrdersTable = () => {
    // Arşivlenmiş siparişleri tarihe göre sırala (en yeni en üstte)
    const sortedArchivedOrders = [...archivedOrders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedArchivedOrders.map((order) => {
                const user = users.find(u => u.id === order.user_id);
                const isExpanded = expandedArchivedOrders.has(order.id);
                const statusColors = getStatusColor(order.status);
                
                return (
                  <>
                    <tr 
                      key={order.id} 
                      className={`${statusColors.bg} ${statusColors.border} border-l-4 transition-colors cursor-pointer ${statusColors.hover}`} 
                      onClick={() => toggleArchivedOrderExpansion(order.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user ? user.name : 'Bilinmeyen Kullanıcı'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.amount} TL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className={`${statusColors.text} hover:opacity-80 font-medium`}>
                          {isExpanded ? 'Kapat' : 'Detaylar'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan="5" className={`px-6 py-4 ${statusColors.bg}`}>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-gray-900">Sipariş Durumu</h3>
                              <div className="flex items-center space-x-2 p-2 rounded-md bg-green-100 text-green-800">
                                <IconCircleCheck className="w-5 h-5" />
                                <span>Siparişiniz Tamamlandı</span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-gray-900">Sipariş Detayları</h3>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Adres:</span> {order.address}
                                </p>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Ürünler:</span>
                                  <ul className="list-disc list-inside mt-1">
                                    {order.products.map((product, index) => (
                                      <li key={index}>
                                        {products[product.product_id]?.title || 'Ürün yükleniyor...'} x {product.quantity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Toplam Tutar:</span> {order.amount} TL
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Sipariş Tarihi:</span> {new Date(order.created_at).toLocaleDateString('tr-TR')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Müşteri:</span> {user ? user.name : 'Bilinmeyen Kullanıcı'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'active'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aktif Siparişler
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'archived'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Arşivlenmiş Siparişler
          </button>
        </div>
      </div>

      {activeTab === 'active' ? renderActiveOrdersTable() : renderArchivedOrdersTable()}

      {/* Sipariş Detay Modalı */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Sipariş Detayları</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sipariş No</h3>
                <p className="mt-1 text-sm text-gray-900">#{selectedOrder.id.slice(0, 8)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Müşteri</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {users.find(u => u.id === selectedOrder.user_id)?.name || 'Bilinmeyen Kullanıcı'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Adres</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ürünler</h3>
                <div className="mt-1 space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="text-sm text-gray-900">
                      {products[product.product_id]?.title || 'Ürün yükleniyor...'} x {product.quantity} - {products[product.product_id]?.price || 0} TL
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Toplam Tutar</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.amount} TL</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {getStatusText(selectedOrder.status)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sipariş Tarihi</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedOrder.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
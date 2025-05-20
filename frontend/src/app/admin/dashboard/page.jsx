"use client";

import { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useAdmin } from '@/contexts/AdminContext';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

export default function DashboardPage() {
  const { isAdmin, isLoading: adminLoading, checkAdminAccess } = useAdmin();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
    totalUsers: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [notificationActive, setNotificationActive] = useState(false);
  const prevActiveOrdersRef = useRef(0);
  const orderAudioRef = useRef(null);

  useEffect(() => {
    // Ses elementi oluştur
    orderAudioRef.current = new Audio('/notification.wav');

    const socket = io('https://gcloudetest-559293271562.europe-west1.run.app/', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Socket.io bağlantısı başarılı:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.io bağlantı hatası:', error);
    });

    socket.on('disconnect', () => {
      console.log('Socket.io bağlantısı kesildi');
    });


    // Sipariş oluşturulduğunda bildirim gönder
    socket.on('orderCreated', (data) => {
      console.log('Yeni sipariş bildirimi alındı:', data);
      try {
        setNotificationActive(true);
        if (orderAudioRef.current) {
          orderAudioRef.current.play().catch(e => console.log('Ses çalma hatası:', e));
        }
        // Kullanıcıya bildirim göster
        Swal.fire({
          title: 'Yeni Sipariş',
          text: `Yeni sipariş alındı`,
          icon: 'info',
          confirmButtonText: 'Tamam'
        });

        if (data.order) {
          // Yeni siparişi recentOrders listesinin başına ekle
          setRecentOrders(prevOrders => {
            // Eğer sipariş zaten varsa ekleme
            if (prevOrders.some(order => order.id === data.order.id)) {
              return prevOrders;
            }
            // Eğer 5'ten fazla sipariş varsa en eski olanı çıkar
            if (prevOrders.length >= 5) {
              prevOrders.pop();
            }
            // Yeni siparişi ekle
            const newOrder = {
              id: data.order.id,
              customer_name: 'Yeni Sipariş',
              total: data.order.amount || 0,
              status: data.order.status,
              created_at: data.order.created_at
            };
            return [newOrder, ...prevOrders.slice(0, 4)];
          });

          // Aktif sipariş sayısını güncelle
          setStats(prevStats => ({
            ...prevStats,
            activeOrders: prevStats.activeOrders + 1,
            totalOrders: prevStats.totalOrders + 1
          }));
        }
      } catch (error) {
        console.error('Sipariş bildirimi işleme hatası:', error);
      }
    });

    // Veri çekme işlemi ve bildirim kontrolü
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Önce admin kontrolü yap
        const isAdminValid = await checkAdminAccess();
        if (!isAdminValid) return;

        // Siparişleri al
        const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
          credentials: 'include'
        });
        if (!ordersResponse.ok) {
          throw new Error('Siparişler yüklenirken bir hata oluştu');
        }
        const ordersData = await ordersResponse.json();

        // Kullanıcıları al
        const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
          credentials: 'include'
        });
        if (!usersResponse.ok) {
          throw new Error('Kullanıcılar yüklenirken bir hata oluştu');
        }
        const usersData = await usersResponse.json();

        // Aktif kullanıcıları hesapla (son 5 dakika içinde işlem yapanlar)
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        const activeUsersCount = usersData.filter(user => {
          const lastActivity = new Date(user.last_activity || 0);
          return lastActivity > fiveMinutesAgo;
        }).length;

        setActiveUsers(activeUsersCount);

        // Son 24 saat için saatlik aktif kullanıcı verilerini oluştur
        const hourlyData = Array(24).fill(0);
        usersData.forEach(user => {
          if (user.last_activity) {
            const activityTime = new Date(user.last_activity);
            const hour = activityTime.getHours();
            hourlyData[hour]++;
          }
        });

        setActiveUsersData(hourlyData);

        // İstatistikleri hesapla
        const totalOrders = ordersData.length;
        const totalRevenue = ordersData.reduce((sum, order) => sum + order.amount, 0);
        const activeOrders = ordersData.filter(order => order.status !== 'completed').length;
        const totalUsers = usersData.length;

        // Aktif sipariş varsa bildirim göster
        if (activeOrders > 0) {
          setNotificationActive(true);

          // Aktif sipariş artarsa ses çal
          if (prevActiveOrdersRef.current < activeOrders && prevActiveOrdersRef.current !== 0) {
            // Ses çal
            if (orderAudioRef.current) {
              orderAudioRef.current.play().catch(e => console.log('Ses çalma hatası:', e));
            }
          }
        } else {
          setNotificationActive(false);
        }

        prevActiveOrdersRef.current = activeOrders;

        setStats({
          totalOrders,
          totalRevenue,
          activeOrders,
          totalUsers
        });

        // Aylık verileri hesapla
        const dailyStats = {};
        ordersData.forEach(order => {
          const date = new Date(order.created_at);
          const day = date.toISOString().split('T')[0]; // YYYY-MM-DD formatında
          if (!dailyStats[day]) {
            dailyStats[day] = 0;
          }
          dailyStats[day] += order.amount;
        });

        const dailyDataArray = Object.entries(dailyStats)
          .map(([day, amount]) => ({
            day,
            amount
          }))
          .sort((a, b) => new Date(a.day) - new Date(b.day));

        setMonthlyData(dailyDataArray);

        // Popüler ürünleri hesapla
        const productStats = {};
        ordersData.forEach(order => {
          if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
              if (!productStats[product.product_id]) {
                productStats[product.product_id] = 0;
              }
              productStats[product.product_id] += product.quantity;
            });
          }
        });

        // Ürün detaylarını al
        const productDetails = {};
        for (const productId of Object.keys(productStats)) {
          const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`, {
            credentials: 'include'
          });
          if (productResponse.ok) {
            const productData = await productResponse.json();
            productDetails[productId] = productData;
          }
        }

        const popularProductsArray = Object.entries(productStats)
          .map(([productId, quantity]) => ({
            name: productDetails[productId]?.title || `Ürün ${productId}`,
            quantity
          }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setPopularProducts(popularProductsArray);

        // Son siparişleri hazırla
        const ordersWithUsers = await Promise.all(
          ordersData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Tarihe göre sırala
            .slice(0, 5) // En son 5 siparişi al
            .map(async (order) => {
              const user = usersData.find(u => u.id === order.user_id);
              return {
                id: order.id,
                customer_name: user ? user.name : 'Bilinmeyen Kullanıcı',
                total: order.amount,
                status: order.status,
                created_at: order.created_at
              };
            })
        );

        setRecentOrders(ordersWithUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // 30 saniyede bir verileri güncelle
    const interval = setInterval(fetchDashboardData, 3000000);

    return () => {
      clearInterval(interval);
      socket.off("orderCreated");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
      if (orderAudioRef.current) {
        orderAudioRef.current.pause();
        orderAudioRef.current.currentTime = 0;
      }
    };
  }, [checkAdminAccess]);


  /////// Chart.js grafikleri


  useEffect(() => {
    let barChart = null;
    let doughnutChart = null;
    let activeUsersChart = null;

    if (monthlyData.length > 0 && popularProducts.length > 0) {
      // Bar Chart
      const barCtx = document.getElementById('barChart');
      if (barCtx) {
        barChart = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: monthlyData.map(data => new Date(data.day).toLocaleDateString('tr-TR')),
            datasets: [{
              label: 'Günlük Gelir',
              data: monthlyData.map(data => data.amount),
              backgroundColor: '#6366F1',
              borderColor: '#6366F1',
              borderWidth: 1,
              borderRadius: 4,
              barThickness: 'flex',
              maxBarThickness: 20
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }

      // Doughnut Chart - Popüler Ürünler
      const doughnutCtx = document.getElementById('doughnutChart');
      if (doughnutCtx) {
        doughnutChart = new Chart(doughnutCtx, {
          type: 'doughnut',
          data: {
            labels: popularProducts.map(product => product.name),
            datasets: [{
              data: popularProducts.map(product => product.quantity),
              backgroundColor: [
                '#6366F1',
                '#818CF8',
                '#A5B4FC',
                '#C7D2FE',
                '#E0E7FF'
              ],
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 12,
                  padding: 15
                }
              }
            },
            cutout: '70%'
          }
        });
      }

      // Active Users Chart
      const activeUsersCtx = document.getElementById('activeUsersChart');
      if (activeUsersCtx) {
        activeUsersChart = new Chart(activeUsersCtx, {
          type: 'line',
          data: {
            labels: Array(24).fill().map((_, i) => `${i}:00`),
            datasets: [{
              label: 'Aktif Kullanıcılar',
              data: activeUsersData,
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (barChart) {
        barChart.destroy();
      }
      if (doughnutChart) {
        doughnutChart.destroy();
      }
      if (activeUsersChart) {
        activeUsersChart.destroy();
      }
    };
  }, [monthlyData, popularProducts, activeUsersData]);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Sipariş Alındı';
      case 'preparing':
        return 'Sipariş Hazırlanıyor';
      case 'on_delivery':
        return 'Sipariş Yola Çıktı';
      case 'completed':
        return 'Sipariş Tamamlandı';
      default:
        return 'Sipariş Alındı';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Gelir */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)} TL</p>
              <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                +4.4%
              </span>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Toplam Kullanıcı */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                +2.6%
              </span>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Toplam Sipariş */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                +3.1%
              </span>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Aktif Siparişler */}
        <style jsx>{`
          @keyframes pulse-animation {
            0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
            50% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
          }
          .animate-continuous-pulse {
            animation: pulse-animation 2s infinite;
          }
        `}</style>
        <div className={`bg-white rounded-lg shadow-md p-4 ${stats.activeOrders > 0 ? 'border-2 border-red-500 animate-continuous-pulse' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Aktif Siparişler</p>
              <p className={`text-2xl font-bold ${stats.activeOrders > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.activeOrders}</p>
              <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                +3.1%
              </span>
            </div>
            <div className={`p-3 rounded-full ${stats.activeOrders > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${stats.activeOrders > 0 ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
        {/* Bar Chart */}
        <div className="col-span-2 bg-white rounded-md shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="text-lg font-semibold text-gray-500">Günlük Gelir Grafiği</h4>
          </div>
          <div className="relative p-4 h-72">
            <canvas id="barChart"></canvas>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-md shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="text-lg font-semibold text-gray-500">Popüler Ürünler</h4>
          </div>
          <div className="relative p-4 h-72">
            <canvas id="doughnutChart"></canvas>
          </div>
        </div>

        {/* Active Users Chart */}
        {/* <div className="col-span-3 bg-white rounded-md shadow-lg">
          <div className="p-4 border-b">
            <h4 className="text-lg font-semibold text-gray-500">Şu Anki Aktif Kullanıcılar</h4>
          </div>
          <div className="p-4">
            <span className="text-2xl font-medium text-gray-500">{activeUsers}</span>
            <span className="text-sm font-medium text-gray-500 ml-2">Kullanıcı</span>
          </div>
          <div className="relative p-4 h-72">
            <canvas id="activeUsersChart"></canvas>
          </div>
        </div> */}
      </div>

      {/* Son Siparişler */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Son Siparişler</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total} TL</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
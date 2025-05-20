"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import { useAdmin } from '@/contexts/AdminContext';

const Reports = () => {
  const { isAdmin, isLoading: adminLoading, checkAdminAccess } = useAdmin();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const columns = [
    {
      title: 'Rapor ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString('tr-TR'),
    },
    {
      title: 'Toplam Sipariş',
      dataIndex: 'total_orders',
      key: 'total_orders',
    },
    {
      title: 'Toplam Gelir',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      render: (text) => `₺${text.toFixed(2)}`,
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => router.push(`/admin/reports/${record.id}`)}
          >
            Detay
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadPDF(record.id)}
          >
            İndir
          </Button>
        </Space>
      ),
    },
  ];

  const handleDownloadPDF = async (reportId) => {
    try {
      setLoading(true);
      setIsModalVisible(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/${reportId}`);
      if (response.data.success) {
        setSelectedReport(response.data);
      } else {
        message.error('Rapor detayları alınamadı');
        setIsModalVisible(false);
      }
    } catch (error) {
      message.error('Rapor detayları alınırken bir hata oluştu');
      setIsModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReport(null);
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/generate`);
      if (response.data.success) {
        setReports(prevReports => [response.data.data, ...prevReports]);
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('Rapor oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const isAdminValid = await checkAdminAccess();
        if (isAdminValid) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports`);
          if (response.data.success) {
            setReports(response.data.data);
          } else {
            message.error(response.data.message);
          }
        }
      } catch (error) {
        message.error('Raporlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [checkAdminAccess]);

  if (loading || adminLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button
          type="primary"
          onClick={generateReport}
          loading={loading}
          size="large"
        >
          Yeni Rapor Oluştur
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={reports}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title="PDF Hazırlanıyor"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {selectedReport ? (
            <PDFDownloadLink
              document={<ReportPDF report={selectedReport} />}
              fileName={`rapor-${selectedReport.data.id}.pdf`}
              onClick={() => {
                setTimeout(() => {
                  handleModalClose();
                }, 1000);
              }}
            >
              {({ loading }) => (
                <div>
                  <p>PDF hazırlandı! İndirme başlıyor...</p>
                  <Button type="primary" loading={loading}>
                    {loading ? 'İndiriliyor...' : 'İndir'}
                  </Button>
                </div>
              )}
            </PDFDownloadLink>
          ) : (
            <div>
              <p>Rapor detayları yükleniyor...</p>
              <Button type="primary" loading>
                Yükleniyor...
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Reports; 
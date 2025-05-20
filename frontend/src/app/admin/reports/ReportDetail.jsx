"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Row, Col, Statistic, Table, Typography, Spin, Button } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, BarChartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const ReportDetail = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  const orderColumns = [
    {
      title: 'Sipariş ID',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
    },
    {
      title: 'Ürünler',
      dataIndex: 'products',
      key: 'products',
      width: '40%',
      render: (products) => products.map(p => `${p.productName} (${p.quantity})`).join(', '),
    },
    {
      title: 'Tarih',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '20%',
      render: (text) => new Date(text).toLocaleDateString('tr-TR'),
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%',
      render: (text) => `₺${text.toFixed(2)}`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: status === 'completed' ? '#52c41a' : '#faad14',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
        </span>
      ),
    },
  ];

  const productColumns = [
    {
      title: 'Ürün Adı',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: '20%',
    },
    {
      title: 'Satış Adedi',
      dataIndex: 'totalSold',
      key: 'totalSold',
      width: '20%',
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
      ),
    },
    {
      title: 'Toplam Gelir',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: '30%',
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ₺{text.toFixed(2)}
        </span>
      ),
    },
  ];

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/${params.id}`);
        if (response.data.success) {
          setReport(response.data.data);
        }
      } catch (error) {
        console.error('Rapor detayları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchReportDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!report) {
    return <div>Rapor bulunamadı</div>;
  }

  const cardStyle = {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    height: '100%',
  };

  const tableStyle = {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  return (
    <div className="p-6">
      <div style={{ marginBottom: '20px' }}>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/reports')}
          style={{
            marginBottom: '16px',
            marginTop: '10px',
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)',
          }}
        >
          Geri Dön
        </Button>
      </div>

      <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
        Rapor Detayları
      </Title>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card style={cardStyle} hoverable>
            <Statistic
              title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Toplam Sipariş</span>}
              value={report.total_orders}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={cardStyle} hoverable>
            <Statistic
              title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Toplam Gelir</span>}
              value={report.total_revenue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="₺"
              precision={2}
              valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={cardStyle} hoverable>
            <Statistic
              title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Ortalama Sipariş Tutarı</span>}
              value={report.average_order_amount}
              prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
              suffix="₺"
              precision={2}
              valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>En Çok Satılan Ürünler</span>} 
        className="mb-6"
        style={cardStyle}
      >
        <div style={tableStyle}>
          <Table
            columns={productColumns}
            dataSource={report.top_products}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>
      </Card>

      <Card 
        title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Sipariş Detayları</span>}
        style={cardStyle}
      >
        <div style={tableStyle}>
          <Table
            columns={orderColumns}
            dataSource={report.orders}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
          />
        </div>
      </Card>
    </div>
  );
};

export default ReportDetail; 
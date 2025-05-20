"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Font kayıtları
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#1890ff',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#1890ff',
    fontWeight: 700,
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '30%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 8,
    color: '#666666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1890ff',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
    flexWrap: 'wrap',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 700,
    color: '#1890ff',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
  date: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'right',
  },
});

const ReportPDF = ({ report }) => {
  // Veri kontrolü
  if (!report || !report.data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Rapor Verisi Bulunamadı</Text>
        </Page>
      </Document>
    );
  }

  const reportData = report.data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Restoran Raporu</Text>
          <Text style={styles.subtitle}>Detaylı Satış ve Sipariş Analizi</Text>
          <Text style={styles.date}>
            Rapor ID: {reportData.id}
          </Text>
          <Text style={styles.date}>
            Oluşturulma Tarihi: {new Date().toLocaleDateString('tr-TR')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Toplam Sipariş</Text>
              <Text style={styles.statValue}>{reportData.total_orders}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Toplam Gelir</Text>
              <Text style={styles.statValue}>{reportData.total_revenue.toFixed(2)} TL</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Ortalama Sipariş Tutarı</Text>
              <Text style={styles.statValue}>{reportData.average_order_amount.toFixed(2)} TL</Text>
            </View>
          </View>
        </View>

        {reportData.top_products && reportData.top_products.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>En Çok Satılan Ürünler</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '30%' }]}>Ürün Adı</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '20%' }]}>Kategori</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '25%' }]}>Satış Adedi</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '25%' }]}>Toplam Gelir</Text>
              </View>
              {reportData.top_products.map((product) => (
                <View key={product.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '30%' }]}>{product.name}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{product.category}</Text>
                  <Text style={[styles.tableCell, { width: '25%' }]}>{product.totalSold}</Text>
                  <Text style={[styles.tableCell, { width: '25%' }]}>{product.totalRevenue.toFixed(2)} TL</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {reportData.orders && reportData.orders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sipariş Detayları</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '15%' }]}>Sipariş ID</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '37%' }]}>Ürünler</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '15%' }]}>Tarih</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '13%' }]}>Tutar</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '20%' }]}>Durum</Text>
              </View>
              {reportData.orders.map((order) => (
                <View key={order.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '15%', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }]}>{order.id}</Text>
                  <Text style={[styles.tableCell, { width: '37%', maxWidth: '37%', wordBreak: 'break-word' }]}>
                    {order.products.map(p => `${p.productName} (${p.quantity})`).join(', ')}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </Text>
                  <Text style={[styles.tableCell, { width: '13%' }]}>{order.amount.toFixed(2)} TL</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {order.status === 'pending' ? 'Beklemede' : 
                     order.status === 'preparing' ? 'Hazırlanıyor' : 
                     order.status === 'on_delivery' ? 'Yolda' :
                     order.status === 'completed' ? 'Tamamlandı' : 
                     order.status === 'cancelled' ? 'İptal Edildi' : order.status}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          Bu rapor otomatik olarak oluşturulmuştur. © {new Date().getFullYear()} Restoran Yönetim Sistemi
        </Text>
      </Page>
    </Document>
  );
};

export default ReportPDF; 
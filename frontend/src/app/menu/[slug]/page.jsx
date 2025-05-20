"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${params.slug}`);
        if (!response.ok) {
          throw new Error('Ürün detayları yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <p>Ürün bulunamadı</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/menu"
          className="inline-flex items-center text-yellow-500 hover:text-yellow-400 mb-8"
        >
          ← Menüye Dön
        </Link>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="relative h-96 w-full">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">{product.title}</h1>
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold text-yellow-500">{product.price} TL</span>
              <span className="text-gray-400">{product.category}</span>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">{product.description}</p>
              <p className="text-gray-400 text-sm">
                Eklenme Tarihi: {new Date(product.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
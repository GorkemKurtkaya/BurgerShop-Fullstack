"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MenuItem3D = dynamic(() => import('./MenuItem3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  ),
});

export default function MenuItem({ modelPath, name, price }) {
  return (
    <div className="relative group">
      <div className="h-64 w-full bg-gray-800 rounded-lg overflow-hidden">
        <div className="w-full h-full">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          }>
            <MenuItem3D modelPath={modelPath} name={name} price={price} />
          </Suspense>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-gray-400">{price} TL</p>
      </div>
    </div>
  );
} 
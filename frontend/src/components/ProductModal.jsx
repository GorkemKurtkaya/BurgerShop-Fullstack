import Image from 'next/image';

export default function ProductModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-1/2 h-64">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4">{product.name}</h2>
            <p className="text-2xl text-yellow-500 mb-6">{product.price.toFixed(2)} ₺</p>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">İçindekiler</h3>
              <ul className="space-y-2 text-gray-300">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-2">Hazırlanışı</h3>
              <p className="text-gray-300">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
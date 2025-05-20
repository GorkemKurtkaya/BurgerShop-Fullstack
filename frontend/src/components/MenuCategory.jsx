import Image from 'next/image';
import Link from 'next/link';

export default function MenuCategory({ title, imageUrl, slug, isComingSoon = false }) {
  const content = (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        {isComingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xl font-bold">ÇOK YAKINDA SİZLERLE</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
    </div>
  );

  if (isComingSoon) {
    return content;
  }

  return (
    <Link href={`/menu/${slug}`}>
      {content}
    </Link>
  );
} 
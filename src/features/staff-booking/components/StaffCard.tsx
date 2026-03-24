import { Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/features/staff-booking/mocks/ImageWithFallback';
import { Badge } from './ui/badge';
import { Link } from 'react-router';
import type { PublicServiceItem } from '@/features/service/types';

interface StaffCardProps extends PublicServiceItem {
  displayName?: string;
}

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

export function StaffCard({
  id,
  serviceType,
  description,
  imageUrls,
  areas,
  minPrice,
  maxPrice,
  pricePerSlot,
  displayName,
}: StaffCardProps) {
  const coverImage = imageUrls?.[0] ?? '';
  const avatar = imageUrls?.[1] ?? imageUrls?.[0] ?? '';
  const name = displayName ?? (description ? description.slice(0, 40) : `Staff #${id}`);
  const location = areas?.[0]
    ? `${areas[0].district}, ${areas[0].city}`
    : 'Toàn quốc';
  const startingPrice = formatPrice(minPrice ?? pricePerSlot ?? null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-lavender-100/30 transition-all duration-300"
    >
      <Link to={`/staff/${id}`}>
        {/* Cover Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={coverImage}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-pink-500 hover:bg-white transition-all shadow-sm"
          >
            <Heart className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4">
            <Badge className="bg-white/90 backdrop-blur-sm text-[#4A3B6B] border-none font-medium px-3 py-1 shadow-sm">
              From {startingPrice}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
              <ImageWithFallback
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#4A3B6B] truncate group-hover:text-[#B59DFF] transition-colors">
                {name}
              </h3>
              <p className="text-xs text-gray-500 truncate">{location}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-700">5.0</span>
              <span className="text-[10px] text-yellow-600 opacity-60">(0)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-[#A090C5] bg-[#F8F7FF] px-2.5 py-1 rounded-full border border-[#ECE9FF] uppercase tracking-wider">
              #{description ? description.slice(0, 20) : serviceType}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

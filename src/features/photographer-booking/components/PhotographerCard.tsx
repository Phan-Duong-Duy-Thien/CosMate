import { Heart, Star, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/features/photographer-booking/mocks/ImageWithFallback';
import { Badge } from './ui/badge';
import { Link } from 'react-router';
import type { ProviderProfile } from '@/features/provider/types';

interface PhotographerCardProps {
  id: number;
  shopName: string | null;
  bio: string | null;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  verified?: boolean;
  description?: string | null;
}

export function PhotographerCard({
  id,
  shopName,
  bio,
  avatarUrl,
  coverImageUrl,
  verified,
  description,
}: PhotographerCardProps) {
  const coverImage = coverImageUrl ?? '';
  const avatar = avatarUrl ?? '';
  const name = shopName ?? 'Nhiếp ảnh gia';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-lavender-100/30 transition-all duration-300"
    >
      <Link to={`/photographer/${id}`}>
        {/* Cover Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={coverImage}
            alt={`${name}'s portfolio`}
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
            {verified && (
              <Badge className="bg-white/90 backdrop-blur-sm text-cosmate-ink border-none font-medium px-3 py-1 shadow-sm flex items-center gap-1">
                <BadgeCheck className="w-3 h-3 fill-blue-500 text-white" />
                Đã xác minh
              </Badge>
            )}
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
              <h3 className="font-bold text-cosmate-ink truncate group-hover:text-cosmate-lavender transition-colors">
                {name}
              </h3>
              <p className="text-xs text-gray-500 truncate">{bio ?? 'Nhiếp ảnh gia Cosplay'}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-700">5.0</span>
              <span className="text-[10px] text-yellow-600 opacity-60">(0)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-cosmate-lavender-muted bg-cosmate-lavender-surface-alt px-2.5 py-1 rounded-full border border-cosmate-lavender-border uppercase tracking-wider">
              #{description ? description.slice(0, 20) : 'Photographer'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

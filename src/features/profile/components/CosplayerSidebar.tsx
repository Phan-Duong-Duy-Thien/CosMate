import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Instagram, Star, CalendarCheck } from 'lucide-react';
import { ImageWithFallback } from '../../auth/components/figma/ImageWithFallback';

interface CosplayerSidebarProps {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  bookings: number;
  rating: number;
  location: string;
  instagram: string;
  tags: string[];
}

export const CosplayerSidebar: React.FC<CosplayerSidebarProps> = ({
  name,
  username,
  avatar,
  bio,
  bookings,
  rating,
  location,
  instagram,
  tags,
}) => {
  return (
    <div className="w-full lg:w-[320px] flex-shrink-0">
      <div className="sticky top-8 bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-[#F0F0F0]">
        {/* Identity */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[150px] h-[150px] rounded-[2rem] overflow-hidden mb-6 shadow-xl shadow-[#FFD7E5]/20 ring-4 ring-white"
          >
            <ImageWithFallback
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h1 className="text-2xl font-black text-[#4A3B6B] mb-1">{name}</h1>
          <p className="text-[#B59DFF] font-bold text-sm">{username}</p>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <p className="text-[#6B5A94] text-sm leading-relaxed text-center px-2">
            {bio}
          </p>
        </div>

        {/* Reliability Stats */}
        <div className="bg-[#FDFBFF] rounded-3xl p-5 mb-8 border border-[#F5F1FF]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E0D7FF] flex items-center justify-center text-[#4A3B6B]">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#8E7AB5]">Bookings</span>
              </div>
              <span className="text-sm font-black text-[#4A3B6B]">{bookings} Made</span>
            </div>
            <div className="h-[1px] bg-[#F0E6FF] w-full" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFD7E5] flex items-center justify-center text-[#4A3B6B]">
                  <Star className="w-4 h-4 fill-[#4A3B6B]" />
                </div>
                <span className="text-xs font-bold text-[#8E7AB5]">Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-[#4A3B6B]">{rating.toFixed(1)}</span>
                <span className="text-[10px] text-[#A090C5] font-bold">(Photographer Review)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Links */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F1FF] flex items-center justify-center text-[#B59DFF] group-hover:bg-[#B59DFF] group-hover:text-white transition-all">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#6B5A94] group-hover:text-[#4A3B6B] transition-colors">{location}</span>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF0F5] flex items-center justify-center text-[#D88AA5] group-hover:bg-[#D88AA5] group-hover:text-white transition-all">
              <Instagram className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#6B5A94] group-hover:text-[#4A3B6B] transition-colors">@{instagram}</span>
          </div>
        </div>

        {/* Style Tags */}
        <div className="pt-6 border-t border-[#F0E6FF]">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1.5 bg-[#F5F1FF] text-[#8E7AB5] text-[11px] font-black rounded-xl hover:bg-[#B59DFF] hover:text-white transition-all cursor-pointer border border-transparent hover:border-[#B59DFF]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

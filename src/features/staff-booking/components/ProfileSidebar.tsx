import React from 'react';
import { motion } from 'motion/react';
import { Star, MessageCircle, Calendar, ShieldCheck, Instagram, Twitter, Globe } from 'lucide-react';
import { ImageWithFallback } from '../mocks/ImageWithFallback';

interface ProfileSidebarProps {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  jobs: number;
  responseRate: string;
  bio: string;
  skills: string[];
  location: string;
  onChat?: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  name,
  title,
  avatar,
  rating,
  reviewsCount,
  jobs,
  responseRate,
  bio,
  skills,
  onChat,
}) => {
  return (
    <div className="w-full lg:w-[360px] flex-shrink-0">
      <div className="sticky top-24 bg-white rounded-3xl border border-[#F0E6FF] p-8 shadow-sm">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-6">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-[#E0D7FF] shadow-inner">
              <ImageWithFallback
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-blue-500 p-1 rounded-full border-4 border-white shadow-sm" title="Verified Staff">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#4A3B6B] mb-1">{name}</h1>
          <p className="text-[#8E7AB5] font-medium text-sm px-4 py-1 bg-[#F5F1FF] rounded-full inline-block mb-4">
            {title}
          </p>
          
          <div className="flex items-center gap-1.5 text-sm font-bold text-[#4A3B6B]">
            <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-[#A090C5] font-medium">({reviewsCount} Reviews)</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#F8F7FF] rounded-2xl p-4 text-center border border-[#F0E6FF]">
            <div className="text-xl font-bold text-[#4A3B6B]">{jobs}+</div>
            <p className="text-[10px] uppercase tracking-wider text-[#A090C5] font-bold mt-1">Jobs Done</p>
          </div>
          <div className="bg-[#F8F7FF] rounded-2xl p-4 text-center border border-[#F0E6FF]">
            <div className="text-xl font-bold text-[#4A3B6B]">{responseRate}</div>
            <p className="text-[10px] uppercase tracking-wider text-[#A090C5] font-bold mt-1">Response Rate</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-[#B59DFF] to-[#D7C7FF] text-white font-bold rounded-2xl shadow-lg shadow-[#D7C7FF]/40 flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onChat}
            className="w-full py-4 bg-white border-2 border-[#F0E6FF] text-[#8E7AB5] font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Chat
          </motion.button>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#4A3B6B] uppercase tracking-widest mb-3">Bio</h3>
          <p className="text-[#6B5A94] text-sm leading-relaxed mb-4 italic">
            "{bio}"
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-[#FDF0F5] text-[#D88AA5] text-xs font-semibold rounded-lg"
              >
                #{skill}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 border-t border-[#F0E6FF] pt-6">
          <a href="#" className="w-10 h-10 rounded-xl bg-[#F5F1FF] flex items-center justify-center text-[#B59DFF] hover:bg-[#B59DFF] hover:text-white transition-all shadow-sm">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-xl bg-[#F5F1FF] flex items-center justify-center text-[#B59DFF] hover:bg-[#B59DFF] hover:text-white transition-all shadow-sm">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-xl bg-[#F5F1FF] flex items-center justify-center text-[#B59DFF] hover:bg-[#B59DFF] hover:text-white transition-all shadow-sm">
            <Globe className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

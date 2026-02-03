import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'motion/react';
import { Camera, Heart } from 'lucide-react';
import { ImageWithFallback } from '../../auth/components/figma/ImageWithFallback';
import type { GalleryItem } from '../types';

interface CosplayerGalleryProps {
  items: GalleryItem[];
}

export const CosplayerGallery: React.FC<CosplayerGalleryProps> = ({ items }) => {
  return (
    <div className="w-full">
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1000: 3, 1200: 4 }}>
        <Masonry gutter="20px">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#B59DFF]/20 transition-all duration-500 cursor-pointer"
            >
              <div className="relative aspect-auto overflow-hidden">
                <ImageWithFallback
                  src={item.url}
                  alt={`Cosplay by ${item.photographer}`}
                  className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay with Photographer Credit */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-1">Photography by</p>
                      <p className="text-sm font-black text-white">{item.photographer}</p>
                    </div>
                  </motion.div>
                  
                  <div className="absolute bottom-4 right-4">
                    <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-[#FFD7E5] transition-colors group/heart">
                      <Heart className="w-4 h-4 text-white group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

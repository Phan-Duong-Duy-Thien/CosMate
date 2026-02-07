import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'motion/react';
import { Heart, Eye, Share2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import type { PortfolioImage } from '../types';

interface PortfolioGridProps {
  images: PortfolioImage[];
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ images }) => {
  return (
    <div className="w-full">
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="24px">
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-[#F0E6FF] hover:shadow-xl hover:shadow-[#E0D7FF]/30 transition-all duration-300"
            >
              <div className="relative aspect-auto overflow-hidden">
                <ImageWithFallback
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B6B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h4 className="text-white font-bold text-lg mb-1">{image.title}</h4>
                  <p className="text-white/80 text-xs mb-4">{image.category}</p>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/40 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      {image.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/40 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      {image.views}
                    </button>
                    <button className="ml-auto w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#4A3B6B] hover:bg-[#B59DFF] hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
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

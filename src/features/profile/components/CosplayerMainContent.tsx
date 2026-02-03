import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CosplayerGallery } from './CosplayerGallery';
import type { GalleryItem } from '../types';
import { Heart, Star, Sparkles, MessageCircle } from 'lucide-react';

interface CosplayerMainContentProps {
  galleryItems: GalleryItem[];
}

export const CosplayerMainContent: React.FC<CosplayerMainContentProps> = ({ galleryItems }) => {
  const [activeTab, setActiveTab] = useState('My Gallery');

  const tabs = ['My Gallery', 'Favorite Concepts', 'Reviews'];

  const favorites = [
    { title: 'Cyberpunk Tokyo', count: 12, color: '#E0D7FF' },
    { title: 'Fantasy Forest', count: 8, color: '#FFD7E5' },
    { title: 'Gothic Lolita', count: 5, color: '#D7FFE0' },
  ];

  return (
    <div className="flex-1 min-w-0">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-10 border-b border-[#F0E6FF] mb-10 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-6 text-sm font-black transition-all ${
              activeTab === tab ? 'text-[#4A3B6B]' : 'text-[#A090C5] hover:text-[#8E7AB5]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B59DFF] to-[#FFD7E5] rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'My Gallery' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-[#4A3B6B] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#B59DFF]" />
                  Past Shoots
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#A090C5] uppercase tracking-widest mr-2">Sort by</span>
                  <select className="bg-transparent text-xs font-bold text-[#4A3B6B] border-none focus:ring-0 cursor-pointer">
                    <option>Latest</option>
                    <option>Popular</option>
                  </select>
                </div>
              </div>
              <CosplayerGallery items={galleryItems} />
            </div>
          )}

          {activeTab === 'Favorite Concepts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map((concept, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[2rem] p-8 border border-[#F0E6FF] shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: concept.color }}>
                    <Heart className="w-8 h-8 text-[#4A3B6B]" />
                  </div>
                  <h3 className="text-xl font-black text-[#4A3B6B] mb-2">{concept.title}</h3>
                  <p className="text-[#8E7AB5] text-sm font-bold mb-6">{concept.count} items saved</p>
                  <button className="w-full py-3 bg-[#F5F1FF] text-[#8E7AB5] font-black text-xs rounded-xl hover:bg-[#B59DFF] hover:text-white transition-all">
                    View Collection
                  </button>
                </motion.div>
              ))}
              <div className="border-2 border-dashed border-[#F0E6FF] rounded-[2rem] flex flex-col items-center justify-center p-8 text-[#A090C5] hover:border-[#B59DFF] transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#F5F1FF] flex items-center justify-center mb-4 group-hover:bg-[#B59DFF] transition-colors">
                  <span className="text-2xl font-bold group-hover:text-white">+</span>
                </div>
                <span className="text-sm font-bold">New Concept</span>
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="space-y-6 max-w-2xl">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] p-8 border border-[#F0E6FF] shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#E0D7FF] flex items-center justify-center font-black text-[#4A3B6B]">
                        {i === 1 ? 'DK' : 'AS'}
                      </div>
                      <div>
                        <h4 className="font-black text-[#4A3B6B]">{i === 1 ? 'Do Ky Dung' : 'Alex Studio'}</h4>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#A090C5]">Jan 20, 2026</span>
                  </div>
                  <p className="text-[#6B5A94] text-sm leading-relaxed italic mb-4">
                    "Miku is an amazing cosplayer to work with. She brings so much energy and professional preparation to every shoot. Her poses are natural and she understands lighting perfectly."
                  </p>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#B59DFF]" />
                    <span className="text-[10px] font-black text-[#B59DFF] uppercase tracking-widest">Photographer Endorsement</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

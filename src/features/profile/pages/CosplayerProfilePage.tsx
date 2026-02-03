import { CosplayerSidebar } from '../components/CosplayerSidebar';
import { CosplayerMainContent } from '../components/CosplayerMainContent';
import { motion } from 'motion/react';

export default function CosplayerProfilePage() {
  const cosplayerData = {
    name: "Miku Lan Anh",
    username: "@mikulan",
    avatar: "https://images.unsplash.com/photo-1726643939988-22f4e42c4f1f?auto=format&fit=crop&q=80&w=300",
    bio: "Genshin Impact & Honkai Star Rail main. Love fantasy settings and ethereal lighting. 5+ years of craft experience.",
    bookings: 24,
    rating: 5.0,
    location: "Hanoi, Vietnam",
    instagram: "mikulan_cos",
    tags: ["Genshin", "DarkFantasy", "CuteStyle", "Crafting", "WigStyling"]
  };

  const galleryItems = [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1661347999669-e935ec73f76b?auto=format&fit=crop&q=80&w=800",
      photographer: "Do Ky Dung"
    },
    {
      id: "g2",
      url: "https://images.unsplash.com/photo-1663035046956-8198fd1c01fd?auto=format&fit=crop&q=80&w=800",
      photographer: "Studio Prism"
    },
    {
      id: "g3",
      url: "https://images.unsplash.com/photo-1731462268541-cfdc9eaa8508?auto=format&fit=crop&q=80&w=800",
      photographer: "Gothic Vision"
    },
    {
      id: "g4",
      url: "https://images.unsplash.com/photo-1630996406379-4a5b229545d1?auto=format&fit=crop&q=80&w=800",
      photographer: "Neo Tokyo"
    },
    {
      id: "g5",
      url: "https://images.unsplash.com/photo-1717603775453-badd7037a538?auto=format&fit=crop&q=80&w=800",
      photographer: "Candy Shot"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-[#FFD7E5] selection:text-[#4A3B6B] font-sans">
      <main className="max-w-[1280px] mx-auto py-12 px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-[#FFD7E5]/20 blur-[100px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-[#B59DFF]/10 blur-[100px] rounded-full"
          />
        </div>

        <div className="relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-black text-[#A090C5] uppercase tracking-[0.2em] mb-10 px-4">
            <span className="opacity-50">Community</span>
            <div className="w-1 h-1 rounded-full bg-[#B59DFF]" />
            <span className="opacity-50">Cosplayers</span>
            <div className="w-1 h-1 rounded-full bg-[#B59DFF]" />
            <span className="text-[#4A3B6B]">Profile</span>
          </div>

          {/* 2-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-10">
            <CosplayerSidebar {...cosplayerData} />
            <CosplayerMainContent galleryItems={galleryItems} />
          </div>
        </div>
      </main>
    </div>
  );
}

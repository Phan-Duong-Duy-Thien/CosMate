import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { motion } from 'motion/react';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { ProfileMainContent } from '../components/ProfileMainContent';
import { useProviderProfile } from '@/features/provider/hooks/useProviderProfile';
import { useStartChat } from '@/features/chat/hooks/useStartChat';

export default function PhotographerProfilePage() {
  const { photographerId } = useParams();
  const providerId = photographerId ? Number(photographerId) : undefined;
  const { provider, loading, error } = useProviderProfile(providerId!);
  const { startChat, loading: chatLoading } = useStartChat()

  if (loading) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]">
        <div className="rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb] px-10 py-12 shadow-[10px_10px_0_0_rgba(30,27,75,0.35)]">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" aria-hidden />
          <p className="mt-4 text-center text-sm font-extrabold text-indigo-950">Đang tải hồ sơ…</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="home-anime flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]">
        <div className="max-w-md rounded-[1.25rem] border-[4px] border-red-700/35 bg-red-50 px-8 py-10 text-center shadow-[8px_8px_0_0_rgba(127,29,29,0.2)]">
          <p className="text-sm font-extrabold text-red-900">{error ?? "Không tìm thấy nhiếp ảnh gia"}</p>
        </div>
      </div>
    );
  }

  const handleChat = () => {
    if (provider.userId) startChat(provider.userId, provider.shopName ?? undefined)
  }

  const photographerData = {
    name: provider.shopName ?? 'Nhiếp ảnh gia Cosplay',
    title: 'Nhiếp ảnh gia Cosplay',
    avatar: provider.avatarUrl ?? '',
    bio: provider.bio ?? '',
    jobs: 0,
    rating: 5.0,
    reviewsCount: 0,
    responseRate: '95%',
    location: 'TP. Hồ Chí Minh',
    skills: [],
  };

  const portfolioItems = [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800',
      title: 'Genshin Impact - Raiden Shogun',
      category: 'Fantasy Ngoại cảnh',
      likes: '1.2k',
      views: '15k',
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1560932763-0ad9298a995f?auto=format&fit=crop&q=80&w=800',
      title: 'Chân dung Cyberpunk Neon',
      category: 'Chụp đêm',
      likes: '856',
      views: '12k',
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1621446173275-27427183ef28?auto=format&fit=crop&q=80&w=800',
      title: 'Tinh linh Rừng cổ',
      category: 'Kỹ xảo / Fantasy',
      likes: '2.1k',
      views: '25k',
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800',
      title: 'Cosplay Tech-wear hiện đại',
      category: 'Phong cách đường phố',
      likes: '945',
      views: '8k',
    },
    {
      id: 'p5',
      url: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800',
      title: 'Bộ ảnh Thánh đường Gothic',
      category: 'Điện ảnh (Cinematic)',
      likes: '1.5k',
      views: '18k',
    },
    {
      id: 'p6',
      url: 'https://images.unsplash.com/photo-1627137504228-a2990a274515?auto=format&fit=crop&q=80&w=800',
      title: 'Quyết đấu Samurai trong tuyết',
      category: 'Studio / Hiệu ứng',
      likes: '3.2k',
      views: '42k',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-[#FFD7E5] selection:text-[#4A3B6B] font-sans flex flex-col">
      <div className="flex-1 max-w-[1280px] mx-auto py-12 px-6 lg:px-8 w-full">
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
          {/* 2-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-10">
            <ProfileSidebar {...photographerData} onChat={handleChat} />
            <ProfileMainContent portfolioItems={portfolioItems} providerId={providerId} />
          </div>
        </div>
      </div>
    </div>
  );
}
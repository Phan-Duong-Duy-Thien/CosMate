import { Link } from 'react-router-dom';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { ProfileMainContent } from '../components/ProfileMainContent';
import { motion } from 'motion/react';

export default function StaffProfilePage() {
  // Dữ liệu giả lập cho Staff (Đã Việt hóa)
  const staffData = {
    name: "Đỗ Kỳ Dũng",
    title: "Chuyên gia Trang điểm & Tạo mẫu Wig",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    // Bio tiếng Việt
    bio: "Chào, mình là Dũng! Mình chuyên hóa thân các nhân vật qua lớp trang điểm chi tiết, tạo mẫu tóc giả bất chấp trọng lực và hỗ trợ tại hiện trường. Mình đảm bảo bạn sẽ hoàn hảo trong mọi khung hình.",
    jobs: 100,
    rating: 5.0,
    reviewsCount: 52,
    responseRate: "98%",
    location: "TP. Hồ Chí Minh",
    skills: ["Trang điểm HD", "Tạo mẫu Wig", "Sửa trang phục", "Hỗ trợ tạo dáng", "Vận chuyển đạo cụ"]
  };

  const portfolioItems = [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800",
      title: "Raiden Shogun - Styling trọn gói",
      category: "Wig & Makeup",
      likes: "1.2k",
      views: "15k"
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1560932763-0ad9298a995f?auto=format&fit=crop&q=80&w=800",
      title: "Makeup Cyberpunk LED",
      category: "Makeup Sáng tạo",
      likes: "856",
      views: "12k"
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1621446173275-27427183ef28?auto=format&fit=crop&q=80&w=800",
      title: "Đạo cụ Tinh linh rừng",
      category: "Làm đạo cụ",
      likes: "2.1k",
      views: "25k"
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800",
      title: "Hỗ trợ Styling Tech-wear",
      category: "Styling",
      likes: "945",
      views: "8k"
    },
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800",
      title: "Hóa trang Gothic Loli",
      category: "Makeup",
      likes: "1.5k",
      views: "18k"
    },
    {
      id: "p6",
      url: "https://images.unsplash.com/photo-1627137504228-a2990a274515?auto=format&fit=crop&q=80&w=800",
      title: "Hỗ trợ chụp tuyết",
      category: "Trợ lý",
      likes: "3.2k",
      views: "42k"
    }
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
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-10 px-4" aria-label="Breadcrumb">
            <Link to="/" className="text-[#A090C5] opacity-50 hover:text-[#B59DFF] transition-colors">Dịch vụ</Link>
            <div className="w-1 h-1 rounded-full bg-[#B59DFF]" aria-hidden />
            <Link to="/staffs" className="text-[#A090C5] opacity-50 hover:text-[#B59DFF] transition-colors">Staffs</Link>
            <div className="w-1 h-1 rounded-full bg-[#B59DFF]" aria-hidden />
            <span className="text-[#4A3B6B] font-bold" aria-current="page">Profile</span>
          </nav>

          {/* 2-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-10">
            <ProfileSidebar {...staffData} />
            <ProfileMainContent portfolioItems={portfolioItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
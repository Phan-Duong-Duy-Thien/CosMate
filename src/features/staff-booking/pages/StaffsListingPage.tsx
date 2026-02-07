import { Link } from 'react-router-dom';
import { StaffCard } from '@/features/staff-booking/components/StaffCard';
import { ListingFilterBar } from '@/features/staff-booking/components/ListingFilterBar';
import { Button } from '@/features/staff-booking/components/ui/button';
import { motion } from 'motion/react';

// Dữ liệu giả lập (đã Việt hóa)
const STAFF_LIST = [
  {
    id: '1',
    name: 'Đỗ Kỳ Dũng',
    location: 'TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1568095984489-e40233cb5f08?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1770122468825-0dfb7aec8687?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviewsCount: 52,
    startingPrice: '500.000đ',
    tags: ['Trang điểm', 'Tạo mẫu Wig', 'Cosplay'] 
  },
  {
    id: '2',
    name: 'Elena Nguyễn',
    location: 'Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1612237372447-633d5ced1be1?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1688422137323-5b0f37db7b31?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 128,
    startingPrice: '750.000đ',
    tags: ['May trang phục', 'Làm đạo cụ', 'Fantasy']
  },
  {
    id: '3',
    name: 'Minh Hoàng',
    location: 'Đà Nẵng',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 84,
    startingPrice: '400.000đ',
    tags: ['Trợ lý', 'Hỗ trợ ánh sáng', 'Stylist']
  },
  {
    id: '4',
    name: 'Akira Trần',
    location: 'TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1568095984489-e40233cb5f08?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1587930708915-55a36837263b?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviewsCount: 31,
    startingPrice: '1.000.000đ',
    tags: ['Trang điểm SFX', 'Hiệu ứng', 'Neon Style']
  },
  {
    id: '5',
    name: 'Sophie Lê',
    location: 'Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1612237372447-633d5ced1be1?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1594472136675-eaafd91ab546?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 45,
    startingPrice: '600.000đ',
    tags: ['Stylist', 'Thời trang', 'Đường phố']
  },
  {
    id: '6',
    name: 'Kevin Vũ',
    location: 'TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1743360688819-4e70acf9b76b?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 67,
    startingPrice: '550.000đ',
    tags: ['Đạo cụ kiếm', 'Làm giáp', 'Hành động']
  }
];

export default function StaffListingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#FFD7E5] selection:text-[#4A3B6B] font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto py-12 px-6 lg:px-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4" aria-label="Breadcrumb">
          <Link to="/" className="text-[#A090C5] opacity-50 hover:text-[#B59DFF] transition-colors">Dịch vụ</Link>
          <div className="w-1 h-1 rounded-full bg-[#B59DFF]" aria-hidden />
          <span className="text-[#4A3B6B] font-bold" aria-current="page">Staffs</span>
        </nav>
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold text-[#4A3B6B] mb-2"
              >
                Tìm Đội Ngũ Hỗ Trợ
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-lg"
              >
                Khám phá và đặt lịch các chuyên gia hỗ trợ Cosplay tốt nhất trong cộng đồng.
              </motion.p>
            </div>
            <div className="text-sm font-medium text-gray-400">
              Hiển thị <span className="text-[#4A3B6B] font-bold">428</span> nhân sự
            </div>
          </div>

          <ListingFilterBar />
        </header>

        {/* Grid Area */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {STAFF_LIST.map((staffMember) => (
            <StaffCard key={staffMember.id} {...staffMember} />
          ))}
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <Button 
            variant="outline" 
            className="rounded-full px-12 py-6 border-2 border-gray-100 hover:border-[#d4c5f9] hover:bg-[#F8F7FF] transition-all font-bold text-[#4A3B6B]"
          >
            Xem thêm nhân sự
          </Button>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <button className="hover:text-[#B59DFF] transition-colors">Trước</button>
            <div className="flex gap-2">
              {[1, 2, 3, '...', 12].map((n, i) => (
                <button 
                  key={i} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${n === 1 ? 'bg-[#4A3B6B] text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button className="hover:text-[#B59DFF] transition-colors">Tiếp</button>
          </div>
        </div>
      </main>
    </div>
  );
}
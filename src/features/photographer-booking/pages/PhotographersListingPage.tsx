import { Link } from 'react-router-dom';
import { PhotographerCard } from '@/features/photographer-booking/components/PhotographerCard';
import { ListingFilterBar } from '@/features/photographer-booking/components/ListingFilterBar';
import { Button } from '@/features/photographer-booking/components/ui/button';
import { motion } from 'motion/react';

const PHOTOGRAPHERS = [
  {
    id: '1',
    name: 'Do Ky Dung',
    location: 'Ho Chi Minh City, Vietnam',
    avatar: 'https://images.unsplash.com/photo-1568095984489-e40233cb5f08?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1770122468825-0dfb7aec8687?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviewsCount: 52,
    startingPrice: '$45',
    tags: ['Traditional', 'Cosplay', 'Outdoor']
  },
  {
    id: '2',
    name: 'Elena Nguyen',
    location: 'Hanoi, Vietnam',
    avatar: 'https://images.unsplash.com/photo-1612237372447-633d5ced1be1?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1688422137323-5b0f37db7b31?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 128,
    startingPrice: '$60',
    tags: ['Fantasy', 'VFX', 'Cinematic']
  },
  {
    id: '3',
    name: 'Minh Hoang',
    location: 'Da Nang, Vietnam',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 84,
    startingPrice: '$40',
    tags: ['Studio', 'Portrait', 'Minimalist']
  },
  {
    id: '4',
    name: 'Akira Tran',
    location: 'Ho Chi Minh City, Vietnam',
    avatar: 'https://images.unsplash.com/photo-1568095984489-e40233cb5f08?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1587930708915-55a36837263b?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviewsCount: 31,
    startingPrice: '$75',
    tags: ['Cyberpunk', 'Night', 'Neon']
  },
  {
    id: '5',
    name: 'Sophie Le',
    location: 'Hanoi, Vietnam',
    avatar: 'https://images.unsplash.com/photo-1612237372447-633d5ced1be1?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1594472136675-eaafd91ab546?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 45,
    startingPrice: '$55',
    tags: ['Street', 'Portrait', 'Urban']
  },
  {
    id: '6',
    name: 'Kevin Wu',
    location: 'Ho Chi Minh City, Vietnam',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    coverImage: 'https://images.unsplash.com/photo-1743360688819-4e70acf9b76b?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 67,
    startingPrice: '$50',
    tags: ['Anime', 'HighRes', 'Action']
  }
];

export default function PhotographersListingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#FFD7E5] selection:text-[#4A3B6B] font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto py-12 px-6 lg:px-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4" aria-label="Breadcrumb">
          <Link to="/" className="text-[#A090C5] opacity-50 hover:text-[#B59DFF] transition-colors">Services</Link>
          <div className="w-1 h-1 rounded-full bg-[#B59DFF]" aria-hidden />
          <span className="text-[#4A3B6B] font-bold" aria-current="page">Photographers</span>
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
                Find Your Vision
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-lg"
              >
                Discover and book the best cosplay photographers in the community.
              </motion.p>
            </div>
            <div className="text-sm font-medium text-gray-400">
              Showing <span className="text-[#4A3B6B] font-bold">428</span> photographers
            </div>
          </div>

          <ListingFilterBar />
        </header>

        {/* Grid Area */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {PHOTOGRAPHERS.map((photographer) => (
            <PhotographerCard key={photographer.id} {...photographer} />
          ))}
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <Button 
            variant="outline" 
            className="rounded-full px-12 py-6 border-2 border-gray-100 hover:border-[#d4c5f9] hover:bg-[#F8F7FF] transition-all font-bold text-[#4A3B6B]"
          >
            Load More Photographers
          </Button>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <button className="hover:text-[#B59DFF] transition-colors">Previous</button>
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
            <button className="hover:text-[#B59DFF] transition-colors">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}

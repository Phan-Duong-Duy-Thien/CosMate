import { Search, MapPin, DollarSign, Calendar, ChevronDown } from 'lucide-react';
import { Input } from '@/features/photographer-booking/components/ui/input';
import { Button } from '@/features/photographer-booking/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/photographer-booking/components/ui/dropdown-menu';

export function ListingFilterBar() {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-3 shadow-sm mb-12 flex flex-col lg:flex-row items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 w-full lg:w-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Find by name or style..."
          className="pl-11 pr-4 h-12 rounded-2xl border-none bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#d4c5f9] transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        {/* Location Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 rounded-2xl border-gray-100 px-4 flex gap-2 font-medium text-gray-600 hover:bg-gray-50">
              <MapPin className="w-4 h-4 text-[#B59DFF]" />
              Location
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl border-gray-100">
            <DropdownMenuItem>Hanoi</DropdownMenuItem>
            <DropdownMenuItem>Ho Chi Minh City</DropdownMenuItem>
            <DropdownMenuItem>Da Nang</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 rounded-2xl border-gray-100 px-4 flex gap-2 font-medium text-gray-600 hover:bg-gray-50">
              <DollarSign className="w-4 h-4 text-[#FFD7E5]" />
              Price Range
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl border-gray-100">
            <DropdownMenuItem>Under $50</DropdownMenuItem>
            <DropdownMenuItem>$50 - $150</DropdownMenuItem>
            <DropdownMenuItem>$150+</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 rounded-2xl border-gray-100 px-4 flex gap-2 font-medium text-gray-600 hover:bg-gray-50">
              <Calendar className="w-4 h-4 text-[#B8E8C5]" />
              Availability
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl border-gray-100">
            <DropdownMenuItem>This Weekend</DropdownMenuItem>
            <DropdownMenuItem>Next Week</DropdownMenuItem>
            <DropdownMenuItem>Custom Range</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-px bg-gray-100 mx-2 hidden lg:block" />

        {/* Sort By */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 whitespace-nowrap">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 font-bold text-[#4A3B6B] hover:text-[#B59DFF] transition-colors">
                Recommended
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-100">
              <DropdownMenuItem>Recommended</DropdownMenuItem>
              <DropdownMenuItem>Highest Rated</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

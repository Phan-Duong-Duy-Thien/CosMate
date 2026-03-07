// Mock rental counts for costume detail page
// In production, this would come from the backend

interface RentalCountData {
  totalRentals: number
  totalReviews: number
  rating: number
}

// Mock data keyed by providerId or costumeId
const rentalCountData: Record<string, RentalCountData> = {
  "1": { totalRentals: 156, totalReviews: 42, rating: 4.7 },
  "2": { totalRentals: 89, totalReviews: 23, rating: 4.5 },
  "3": { totalRentals: 234, totalReviews: 67, rating: 4.8 },
  "default": { totalRentals: 50, totalReviews: 15, rating: 4.2 },
}

export function getMockRentalCount(identifier: string): RentalCountData {
  return rentalCountData[identifier] || rentalCountData["default"]
}

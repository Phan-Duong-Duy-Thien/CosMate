import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  className?: string
}

export const RatingStars = ({ rating, className }: RatingStarsProps) => {
  const rounded = Math.round(rating * 2) / 2
  return (
    <div className={cn("flex items-center gap-1 text-amber-400", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1
        const isFilled = rounded >= starValue
        const isHalf = rounded + 0.5 === starValue
        return (
          <span key={starValue} className="relative inline-flex h-4 w-4">
            <Star
              className={cn(
                "h-4 w-4 text-amber-200",
                isFilled && "text-amber-400",
                isHalf && "text-amber-300"
              )}
            />
          </span>
        )
      })}
    </div>
  )
}

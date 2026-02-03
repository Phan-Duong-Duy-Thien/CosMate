declare module 'react-responsive-masonry' {
  import type { ReactNode, CSSProperties, ComponentType } from 'react'

  export interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>
    children: ReactNode
    className?: string | null
    style?: CSSProperties | null
    gutterBreakPoints?: Record<number, string>
  }

  export interface MasonryProps {
    children: ReactNode
    gutter?: string
    columnsCount?: number
    className?: string | null
    style?: CSSProperties
    containerTag?: string
    itemTag?: string
    itemStyle?: CSSProperties
    sequential?: boolean
  }

  export const ResponsiveMasonry: ComponentType<ResponsiveMasonryProps>
  const Masonry: ComponentType<MasonryProps>
  export default Masonry
}

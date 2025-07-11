export interface BannerSlide {
  _key?: string
  image: {
    asset: {
      _ref: string
      _type: string
    }
    _type: string
  }
  alt: string
  url: string
  backgroundGradient: string
}

export interface SanityBanner {
  _id: string
  title: string
  bannerType: 'single' | 'carousel'
  slides: BannerSlide[]
  isActive: boolean
  order: number
}

// Legacy slide interface for backward compatibility
export interface Slide {
  id: number
  img: string
  alt: string
  url: string
  bg: string
}
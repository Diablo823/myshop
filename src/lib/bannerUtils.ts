// lib/bannerUtils.ts
import { client, urlFor } from './sanity'
import { SanityBanner, BannerSlide, Slide } from '../types/banner'

// Fetch all active banners from Sanity
export async function getBanners(): Promise<SanityBanner[]> {
  try {
    const banners = await client.fetch(
      `*[_type == "banner" && isActive == true] | order(order asc) {
        _id,
        title,
        bannerType,
        slides[] {
          _key,
          image {
            asset-> {
              _id,
              url,
              metadata {
                dimensions {
                  width,
                  height
                }
              }
            }
          },
          alt,
          url,
          backgroundGradient
        },
        isActive,
        order
      }`
    )
    return banners
  } catch (error) {
    console.error('Error fetching banners:', error)
    return []
  }
}

// Get banners by type
export async function getBannersByType(type: 'single' | 'carousel'): Promise<SanityBanner[]> {
  try {
    const banners = await client.fetch(
      `*[_type == "banner" && bannerType == $type && isActive == true] | order(order asc) {
        _id,
        title,
        bannerType,
        slides[] {
          _key,
          image {
            asset-> {
              _id,
              url,
              metadata {
                dimensions {
                  width,
                  height
                }
              }
            }
          },
          alt,
          url,
          backgroundGradient
        },
        isActive,
        order
      }`,
      { type }
    )
    return banners
  } catch (error) {
    console.error('Error fetching banners by type:', error)
    return []
  }
}

// Convert Sanity banner slides to legacy slide format for backward compatibility
export function convertSanitySlideToLegacy(slide: BannerSlide, index: number): Slide {
  return {
    id: index + 1,
    img: slide.image.asset ? urlFor(slide.image).url() : '',
    alt: slide.alt,
    url: slide.url,
    bg: slide.backgroundGradient || '',
    width: slide.image.asset?.metadata?.dimensions?.width,
    height: slide.image.asset?.metadata?.dimensions?.height,
  }
}

// Get a specific banner by its title/name
export async function getBannerByName(name: string): Promise<SanityBanner | null> {
  try {
    const banner = await client.fetch(
      `*[_type == "banner" && title == $name && isActive == true][0] {
        _id,
        title,
        bannerType,
        slides[] {
          _key,
          image {
            asset-> {
              _id,
              url,
              metadata {
                dimensions {
                  width,
                  height
                }
              }
            }
          },
          alt,
          url,
          backgroundGradient
        },
        isActive,
        order
      }`,
      { name }
    )
    return banner || null
  } catch (error) {
    console.error('Error fetching banner by name:', error)
    return null
  }
}

// Convert Sanity banner to legacy slides array
export function convertSanityBannerToLegacy(banner: SanityBanner): Slide[] {
  return banner.slides.map((slide, index) => convertSanitySlideToLegacy(slide, index))
}

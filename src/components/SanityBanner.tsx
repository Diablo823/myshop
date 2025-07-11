// components/SanityBanner.tsx
import { getBannerByName, convertSanityBannerToLegacy } from "@/lib/bannerUtils";
import Banner from "./Banner";
import SingleBanner from "./SingleBanner";

interface SanityBannerProps {
  bannerName: string;
  autoPlayInterval?: number;
  showControls?: boolean;
  height?: string;
  fallbackSlides?: any[]; // Optional fallback slides
}

export default async function SanityBanner({
  bannerName,
  autoPlayInterval = 7000,
  showControls = false,
  height = "h-[18rem] md:h-[26rem]",
  fallbackSlides = []
}: SanityBannerProps) {
  const banner = await getBannerByName(bannerName);

  if (!banner) {
    // If no banner found and fallback provided, use fallback
    if (fallbackSlides.length > 0) {
      return (
        <Banner
          slides={fallbackSlides}
          autoPlayInterval={autoPlayInterval}
          showControls={showControls}
          height={height}
        />
      );
    }
    // Otherwise, don't render anything
    return null;
  }

  const slides = convertSanityBannerToLegacy(banner);

  if (banner.bannerType === 'carousel') {
    return (
      <Banner
        slides={slides}
        autoPlayInterval={autoPlayInterval}
        showControls={showControls}
        height={height}
      />
    );
  } else {
    return (
      <SingleBanner
        slide={slides[0]}
        height={height}
      />
    );
  }
}
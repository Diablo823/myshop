// components/SanityAppleCarousel.tsx
import { getBannerByName, convertSanityBannerToLegacy } from "@/lib/bannerUtils";
import AppleCarouselClient from "../Applecarouselclient";

interface SanityAppleCarouselProps {
    bannerName: string;
    heading?: string;
    fallbackSlides?: any[];
}

export default async function SanityAppleCarousel({
    bannerName,
    heading,
    fallbackSlides = [],
}: SanityAppleCarouselProps) {
    const banner = await getBannerByName(bannerName);

    if (!banner) {
        if (fallbackSlides.length > 0) {
            return (
                <AppleCarouselClient slides={fallbackSlides} />
            );
        }
        return null;
    }

    const slides = convertSanityBannerToLegacy(banner);

    return <AppleCarouselClient slides={slides} />;
}
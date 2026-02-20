// components/SanityMasonryCard.tsx
import { getBannerByName, convertSanityBannerToLegacy } from "@/lib/bannerUtils";
import MasonryCard from "../MasonryCard";

interface SanityMasonryCardProps {
    bannerName: string;
    columns?: {
        default: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    gap?: string;
    fallbackItems?: any[]; // Optional fallback items
}

export default async function SanityMasonryCard({
    bannerName,
    columns = { default: 2, sm: 2, md: 3, lg: 4, xl: 5 },
    gap = "gap-4",
    fallbackItems = []
}: SanityMasonryCardProps) {
    const banner = await getBannerByName(bannerName);

    if (!banner) {
        // If no banner found and fallback provided, use fallback
        if (fallbackItems.length > 0) {
            return (
                <MasonryCard
                    items={fallbackItems}
                    columns={columns}
                    gap={gap}
                />
            );
        }
        // Otherwise, don't render anything
        return null;
    }

    // Convert banner slides to masonry items
    const items = convertSanityBannerToLegacy(banner);

    return (
        <MasonryCard
            items={items}
            columns={columns}
            gap={gap}
        />
    );
}
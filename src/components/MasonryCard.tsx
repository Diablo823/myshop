"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Define the card type
export interface MasonryCardItem {
    id: number;
    title?: string;
    description?: string;
    img: string;
    url: string;
    alt: string;
    width?: number;
    height?: number;
}

interface MasonryCardProps {
    items: MasonryCardItem[];
    columns?: {
        default: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    gap?: string;
}

const MasonryCard = ({
    items,
    columns = { default: 2, sm: 2, md: 3, lg: 4, xl: 5 },
    gap = "gap-4",
}: MasonryCardProps) => {
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    const handleImageLoad = (id: number) => {
        setLoadedImages((prev) => new Set([...prev, id]));
    };

    if (!items || items.length === 0) {
        return null;
    }

    // HEIGHT-AWARE distribution
    const distributeItems = (columnCount: number) => {
        const cols: MasonryCardItem[][] = Array.from({ length: columnCount }, () => []);
        const colHeights: number[] = Array(columnCount).fill(0);

        items.forEach((item) => {
            // Find the column with minimum height
            const minHeight = Math.min(...colHeights);
            const minHeightIndex = colHeights.indexOf(minHeight);

            // Calculate aspect ratio
            const aspectRatio = item.height && item.width
                ? item.height / item.width
                : 1.5;

            // Add item to shortest column
            cols[minHeightIndex].push(item);
            colHeights[minHeightIndex] += aspectRatio;
        });

        return cols;
    };

    // Get gap size in pixels
    // const getGapSize = () => {
    //     if (gap.includes('gap-2')) return 'gap-2';
    //     if (gap.includes('gap-3')) return 'gap-3';
    //     if (gap.includes('gap-6')) return 'gap-6';
    //     if (gap.includes('gap-8')) return 'gap-8';
    //     return 'gap-4';
    // };

    //const gapClass = getGapSize();
    const gapClass = gap;

    return (
        <div className="w-full mt-4">
            {/* Mobile - default columns */}
            <div className={`md:hidden flex ${gapClass}`}>
                {distributeItems(columns.default).map((column, colIndex) => (
                    <div key={`col-default-${colIndex}`} className={`flex-1 flex flex-col ${gapClass}`}>
                        {column.map((item) => (
                            <MasonryItem
                                key={item.id}
                                item={item}
                                loadedImages={loadedImages}
                                handleImageLoad={handleImageLoad}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Small screens (sm) */}
            {columns.sm && (
                <div className={`hidden md:flex lg:hidden ${gapClass}`}>
                    {distributeItems(columns.sm).map((column, colIndex) => (
                        <div key={`col-sm-${colIndex}`} className={`flex-1 flex flex-col ${gapClass}`}>
                            {column.map((item) => (
                                <MasonryItem
                                    key={item.id}
                                    item={item}
                                    loadedImages={loadedImages}
                                    handleImageLoad={handleImageLoad}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Medium screens (md) */}
            {columns.md && (
                <div className={`hidden lg:flex xl:hidden ${gapClass}`}>
                    {distributeItems(columns.md).map((column, colIndex) => (
                        <div key={`col-md-${colIndex}`} className={`flex-1 flex flex-col ${gapClass}`}>
                            {column.map((item) => (
                                <MasonryItem
                                    key={item.id}
                                    item={item}
                                    loadedImages={loadedImages}
                                    handleImageLoad={handleImageLoad}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Large screens (lg) */}
            {columns.lg && (
                <div className={`hidden xl:flex 2xl:hidden ${gapClass}`}>
                    {distributeItems(columns.lg).map((column, colIndex) => (
                        <div key={`col-lg-${colIndex}`} className={`flex-1 flex flex-col ${gapClass}`}>
                            {column.map((item) => (
                                <MasonryItem
                                    key={item.id}
                                    item={item}
                                    loadedImages={loadedImages}
                                    handleImageLoad={handleImageLoad}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Extra large screens (xl) */}
            {columns.xl && (
                <div className={`hidden 2xl:flex ${gapClass}`}>
                    {distributeItems(columns.xl).map((column, colIndex) => (
                        <div key={`col-xl-${colIndex}`} className={`flex-1 flex flex-col ${gapClass}`}>
                            {column.map((item) => (
                                <MasonryItem
                                    key={item.id}
                                    item={item}
                                    loadedImages={loadedImages}
                                    handleImageLoad={handleImageLoad}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Separate component for masonry item
const MasonryItem = ({
    item,
    loadedImages,
    handleImageLoad
}: {
    item: MasonryCardItem;
    loadedImages: Set<number>;
    handleImageLoad: (id: number) => void;
}) => {
    return (
        <div className="w-full">
            <Link
                href={item.url}
                className="group block relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
                <div className="relative w-full">
                    <div className="relative w-full">
                        <Image
                            src={item.img || "/placeholder.svg"}
                            alt={item.alt || "Masonry item"}
                            width={item.width || 400}
                            height={item.height || 300}
                            className={`w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 ${loadedImages.has(item.id) ? "opacity-100" : "opacity-0"
                                }`}
                            onLoad={() => handleImageLoad(item.id)}
                            loading="lazy"
                        />
                        {/* Loading skeleton */}
                        {!loadedImages.has(item.id) && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                        )}
                    </div>

                    {/* Overlay with title and description */}
                    {(item.title || item.description) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                {item.title && (
                                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                                        {item.title}
                                    </h3>
                                )}
                                {item.description && (
                                    <p className="text-sm text-gray-200 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default MasonryCard;

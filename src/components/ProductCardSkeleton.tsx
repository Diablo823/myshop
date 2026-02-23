import { Skeleton } from '@/components/ui/skeleton'

const ProductCardSkeleton = () => {
    return (
        <div className="flex flex-col rounded-xl bg-white">
            {/* Image area — matches pb-[120%] ratio */}
            <div className="relative pb-[120%] w-full overflow-hidden rounded-xl">
                <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
            </div>

            {/* Content area — matches p-2 gap-y-0.5 */}
            <div className="flex flex-col p-2 gap-y-2 mt-1">
                {/* Brand */}
                <Skeleton className="h-3 w-16 rounded-md" />
                {/* Product name */}
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
                {/* Price row */}
                <div className="flex flex-row gap-2 items-center mt-1">
                    <Skeleton className="h-4 w-14 rounded-md" />
                    <Skeleton className="h-3 w-10 rounded-md" />
                </div>
            </div>
        </div>
    )
}

export default ProductCardSkeleton
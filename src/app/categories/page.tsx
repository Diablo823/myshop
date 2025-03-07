import Image from "next/image";
import Link from "next/link";
import { wixClientServer } from "@/lib/wixClientServer";
import { Button } from "@/components/ui/button";
import { FaShoppingBag } from "react-icons/fa";

const CategoryPage = async () => {
  const wixClient = await wixClientServer();
  const categories = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="bg-pink-100 flex justify-between px-4 sm:px-8 h-64 sm:h-72 md:h-80 mt-5 rounded-2xl">
        {/* TEXT CONTAINER */}
        <div className="w-2/3 flex flex-col justify-center md:items-center md:text-center gap-4 md:gap-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-950 leading-[38px] md:leading-[48px] lg:leading-[56px]">
            Shop by different categories{" "}
            <span className="hidden md:inline">             
              <br />
            </span>
            select your category
          </h1>
          <Button className="rounded-full w-max text-md md:text-lg lg:text-xl md:font-bold bg-amber-300 hover:bg-emerald-300 text-black">
            <span className="font-bold">Buy Now</span>
            <FaShoppingBag className="ml-2" />
          </Button>
        </div>
        {/* IMAGE CONTAINER */}
        <div className="w-1/3 relative">
          <Image
            src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/campaign1.png?updatedAt=1741333459170"
            alt="campaign"
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {categories.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="flex flex-col gap-3 sm:gap-4 md:gap-5 group"
          >
            <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden rounded-2xl">
              <Image
                src={item.media?.mainMedia?.image?.url || "/category.png"}
                alt={item.name || "category"}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h1 className="font-semibold text-lg sm:text-xl md:text-2xl tracking-wide">
              {item.name?.length && item.name.length > 20
                ? `${item.name.substring(0, 25)}...`
                : item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
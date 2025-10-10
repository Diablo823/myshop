import Image from "next/image";
import Link from "next/link";
import { wixClientServer } from "@/lib/wixClientServer";

const CategoryList = async () => {
  const wixClient = await wixClientServer();

  const categories = await wixClient.collections.queryCollections().find();


  return (
    <div className="mt-12 p-2 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-3">
        {categories.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className=""
          >
            <div className="relative bg-slate-100 w-[15rem] h-[18rem]">
              <Image
                src={item.media?.mainMedia?.image?.url || "/category.png"}
                alt="category"
                fill
                sizes="20vw"
                className="object-cover rounded-2xl hover:scale-105 transition-all duration-300"
              />
            </div>
            <h1 className="mt-2 font-bold text-sm tracking-wide">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;





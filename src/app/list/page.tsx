import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import ProductWrapper from "@/components/products/ProductWrapper";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import React, { Suspense } from "react";
import { FaShoppingBag } from "react-icons/fa";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  const cat = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "all-products");

//   let cat;
// try {
//   cat = await wixClient.collections.getCollectionBySlug(
//     searchParams.cat || "all-products"
//   );
  
// } catch (error) {
//   cat = await wixClient.collections.getCollection("00000000-0000-0000-0000-000000000001");
// }

  //console.log(cat);

  return (
    
    <div className="px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative overflow-hidden">
      {/* CAMPAIGN */}
      <div className="bg-pink-100 flex justify-between px-4 h-64 mt-5 rounded-2xl">
        {/* TEXT CONTAINER */}
        <div className="w-2/3 flex flex-col justify-center md:items-center md:text-center gap-6">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-950 leading-[38px] md:leading-[48px]">
            Get the Best Deals on {" "}
            <span className="hidden md:inline">
              
              <br />
            </span>
            selected products
          </h1>
          <Button className="rounded-full w-max text-md md:font-bold bg-amber-300 hover:bg-emerald-300 text-black">
            <span className="font-bold">Buy Now</span>
            <FaShoppingBag />
          </Button>
        </div>
        {/* IMAGE CONTAINER */}
        <div className="w-1/3 relative">
          <Image
            src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/campaign1.png?updatedAt=1741333459170"
            alt="campaign"
            fill
            sizes="25vw"
            className="object-contain"
          />
        </div>
      </div>

      {/* FILTER */}
      <Filter />

      {/* PRODUCTS */}
      <h1 className="mt-12 text-2xl font-bold">{cat?.collection?.name}</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductWrapper
          categoryId={
            cat.collection?._id || "00000000-000000-000000-000000000001"
          }
          searchParams={searchParams}
        />
      </Suspense>
    </div>
    
  );
};

export default ListPage;

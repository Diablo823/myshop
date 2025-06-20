//"use client"

import Banner from "@/components/Banner";
import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
//import ProductWrapper from "@/components/products/ProductWrapper";
import ProductScroll from "@/components/ProductScroll";
import Promotion from "@/components/Promotion";
import SingleBanner from "@/components/SingleBanner";
import SingleVideoBanner from "@/components/SingleVideoBanner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VideoBannerGrid from "@/components/VideoBannerGrid";
import { slides1, slides2, videoSlides, videoSlides2 } from "@/constants";
// import { WixClientContext } from "@/context/WixContext";
// import { useWixClient } from "@/hooks/useWixClient";
// import { wixClientServer } from "@/lib/wixClientServer";
import { Suspense } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const HomePage = async () => {
  // const wixClient = useWixClient();

  // useEffect(() => {
  //   const getProducts = async() => {
  //     const res = await wixClient.products.queryProducts().find();
  //     console.log(res);

  //   }
  //   getProducts();

  // }, [wixClient])

  // const wixClient = await wixClientServer();
  // const response = await wixClient.products.queryProducts().find();
  // const discount = response.items.map((item) => item.priceData)
  // console.log(discount);

  return (
    <div className="w-full min-h-screen">
      {/* <Slider /> */}
      <div className="px-2 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        <Banner
          slides={slides1}
          autoPlayInterval={7000}
          showControls={false}
          height="h-[18rem] md:h-[26rem]"
        />
      </div>

      {/* <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        <SingleVideoBanner slide={videoSlides[0]} />
      </div>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        <VideoBannerGrid slides={videoSlides2} />
      </div> */}

      <div className="mt-20 px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-bold">New Arrivals</h1>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID!}
            limit={12}
          />
        

        <h1 className="mt-5 text-2xl font-bold">Featured Products</h1>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_FEATURED_PRDUCTS_CATEGORY_ID!}
            limit={4}
          />
        
        

        <h1 className="mt-5 text-2xl font-bold">Popular Products</h1>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_POPULAR_PRDUCTS_CATEGORY_ID!}
            limit={6}
          />
        
      </div>

      {/* <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        <SingleBanner
          slide={slides2[0]}
          height="h-[18rem] md:h-[26rem]"
        />
      </div> */}

      <div>
        <Promotion
          days={7}
          title="Flash Sale!"
          description="Don't miss out on our amazing flash sale deals!"
          className="mt-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64"
        />
      </div>
      <div className="mt-8 px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_FEATURED_PRDUCTS_CATEGORY_ID!}
            limit={4}
          />
        
      </div>

      <div className="mt-20 px-2 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <h1 className="flex items-center justify-center gap-12 text-lg md:text-2xl font-bold">
          <span>
            <FaArrowLeft />
          </span>
          Product Categories{" "}
          <span>
            <FaArrowRight />
          </span>
        </h1>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <CategoryList />
        
      </div>

      <div className="mt-20 px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-bold">Facewash</h1>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_FACE_WASH_CATEGORY_ID!}
            limit={4}
          />
        
      </div>

      <div className="mt-20 px-2 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <h1 className="flex items-center justify-center gap-12 text-lg md:text-2xl font-bold">
          <span>
            <FaArrowLeft />
          </span>
          Products You Might Like
          <span>
            <FaArrowRight />
          </span>
        </h1>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <ProductScroll
            categoryId={process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID!}
            limit={20}
          />
        
      </div>

      <div className="mt-20 px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-bold">Hair Care</h1>
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_HAIR_PRODUCTS_CATEGORY_ID!}
            limit={5}
          />
               
      </div>

    </div>
  );
};

export default HomePage;

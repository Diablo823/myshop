import CategoryList from "@/components/CategoryList";
import Promotion from "@/components/Promotion";
import SanityBanner from "@/components/SanityBanner";
import { slides1, slides2, videoSlides, videoSlides2 } from "@/constants";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ProductWrapper from "@/components/products/ProductWrapper";
import ProductScrollWrapper from "@/components/ProductScroll/ProductScrollWrapper";
import ShuffledCategoryWrapper from "@/components/multicategory/ShuffledCategoryWrapper";
import { FaLessThanEqual } from "react-icons/fa6";

export const revalidate = 60; // seconds (Regenerates page every 60 seconds)

const categories = {
  "cat-1": process.env.NEXT_PUBLIC_ALL_PRDUCTS_CATEGORY_ID,
  "cat-2": process.env.NEXT_PUBLIC_FEATURED_PRDUCTS_CATEGORY_ID,
  "cat-3": process.env.NEXT_PUBLIC_POPULAR_PRDUCTS_CATEGORY_ID,
  "cat-4": process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID,
  "cat-5": process.env.NEXT_PUBLIC_FACE_WASH_CATEGORY_ID,
  "cat-6": process.env.NEXT_PUBLIC_HAIR_PRODUCTS_CATEGORY_ID,
  "cat-7": process.env.NEXT_PUBLIC_SHAMPOO_CATEGORY_ID,
  "cat-8": process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID,
  "cat-9": process.env.NEXT_PUBLIC_SKINCARE_PRODUCTS_CATEGORY_ID,
  "cat-10": process.env.NEXT_PUBLIC_TOP_PICKS_CATEGORY_ID,
  "cat-11": process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID,
  "cat-12": process.env.NEXT_PUBLIC_TRENDING_NOW_CATEGORY_ID,
  "cat-13": process.env.NEXT_PUBLIC_TECH_UTILITIES_CATEGORY_ID,
}

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
      <div className="mt-2 px-2 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        {/* <Banner
          slides={slides1}
          autoPlayInterval={7000}
          showControls={false}
          height="h-[18rem] md:h-[26rem]"
        /> */}
        <SanityBanner
          bannerName="homebanner"
          autoPlayInterval={7000}
          showControls={false}
          height="h-[12rem] md:h-[24rem]"
          fallbackSlides={slides1} // Fallback slides if no banner found
        />
      </div>

      {/* <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        <SingleVideoBanner slide={videoSlides[0]} />
      </div>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        <VideoBannerGrid slides={videoSlides2} />
      </div> */}

      <div className="mt-20 px-1 md:px-8 lg:px-16 xl:px-32">
        <h2 className="px-3 text-lg md:textxl font-bold">New Arrivals</h2>

        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID!}
          limit={12}
        />
      </div>

      <div className="mt-10 px-2 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <h2 className="flex items-center justify-center gap-12 text-lg md:text-2xl font-bold">
          <span>
            <FaArrowLeft />
          </span>
          Discover Categories{" "}
          <span>
            <FaArrowRight />
          </span>
        </h2>

        <CategoryList />
      </div>


      <div className="mt-20 px-1 md:px-8 lg:px-16 xl:px-32">
        <h2 className="mt-5 px-3 text-lg md:textxl font-bold">Picked For You</h2>

        <ShuffledCategoryWrapper
          categoryIds={[
            categories["cat-2"]!, // Featured
            categories["cat-3"]!, // Popular
            categories["cat-4"]!, // New Arrivals
          ]}
          limit={12}
          shuffleCategories={true}
          shuffleProducts={true}
          productsPerCategory={30}
          strategy="round-robin"
        />

        <h2 className="mt-5 px-3 text-lg md:textxl font-bold">Beauty Essentials</h2>

        <ShuffledCategoryWrapper
          categoryIds={[
            categories["cat-5"]!, // Face Wash
            categories["cat-9"]!, // Skincare
            categories["cat-7"]!, // Shampoo
            categories["cat-6"]!, // Hair Products
          ]}
          limit={8}
          shuffleCategories={true}
          shuffleProducts={true}
          productsPerCategory={30}
          strategy="weighted"
        />

        <h2 className="mt-5 px-3 text-lg md:text-xl font-bold">
          Featured Products
        </h2>

        <ShuffledCategoryWrapper
          categoryIds={[
            categories["cat-2"]!, // Featured
          ]}
          limit={12}
          shuffleCategories={true}
          shuffleProducts={true}
          productsPerCategory={30}
          strategy="round-robin"
        />

        {/* <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_FEATURED_PRDUCTS_CATEGORY_ID!}
          limit={6}
        /> */}

        <h2 className="mt-5 px-3 text-lg md:text-xl font-bold">
          Popular Products
        </h2>

        <ShuffledCategoryWrapper
          categoryIds={[
            categories["cat-3"]!, // Popular
          ]}
          limit={6}
          shuffleCategories={false}
          shuffleProducts={true}
          productsPerCategory={30}
          strategy="round-robin"
        />

        {/* <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_POPULAR_PRDUCTS_CATEGORY_ID!}
          limit={6}
        /> */}
      </div>

      {/* <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
        <SingleBanner
          slide={slides2[0]}
          height="h-[18rem] md:h-[26rem]"
        />
      </div> */}

      {/* <div>
        <Promotion
          days={7}
          title="Flash Sale!"
          description="Don't miss out on our amazing flash sale deals!"
          className="mt-8 px-4 md:px-8 lg:px-16 xl:px-32"
        />
      </div>
      <div className="mt-8 px-1 md:px-8 lg:px-16 xl:px-32">
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID!}
          limit={5}
        />
      </div> */}


      <div className="mt-20 px-1 md:px-8 lg:px-16 xl:px-32">
        <h2 className="px-3 text-lg md:text-xl font-bold">Facewash</h2>

        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_FACE_WASH_CATEGORY_ID!}
          limit={6}
        />
      </div>

      {/* <div className="mt-20 px-2 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <h2 className="flex items-center justify-center gap-12 text-lg md:text-2xl font-bold">
          <span>
            <FaArrowLeft />
          </span>
          Products You Might Like
          <span>
            <FaArrowRight />
          </span>
        </h2>

        <ProductScrollWrapper
          categoryId={process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID!}
          limit={14}
        />
      </div> */}

      <div className="mt-20 px-1 md:px-8 lg:px-16 xl:px-32">
        <h2 className="px-3 text-lg md:text-xl font-bold">Hair Care</h2>

        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_HAIR_PRODUCTS_CATEGORY_ID!}
          limit={5}
        />
      </div>
    </div>
  );
};

export default HomePage;

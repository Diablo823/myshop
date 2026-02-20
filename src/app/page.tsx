import SanityBanner from "@/components/SanityBanner";
import { slides1, slides2, videoSlides, videoSlides2 } from "@/constants";
import ProductWrapper from "@/components/products/ProductWrapper";
import ProductScrollWrapper from "@/components/ProductScroll/ProductScrollWrapper";
import ShuffledCategoryWrapper from "@/components/multicategory/ShuffledCategoryWrapper";
import SanityProductSection from "@/components/sanity/SanityProductSection";
import SanityShuffledCategorySection from "@/components/sanity/SanityShuffledCategorySection";
import SanityMasonryCard from "@/components/sanity/SanityMasonryCard";
import SanityPromotion from "@/components/sanity/SanityPromotion";

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
      <div className="hidden sm:block mt-2 px-2 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[100vw] overflow-x-hidden">
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
      <div className="mt-2 px-2 overflow-x-hidden sm:hidden">
        <SanityBanner
          bannerName="homebannermobile"
          autoPlayInterval={7000}
          showControls={false}
          height="h-[12rem]"
          fallbackSlides={slides1} // Fallback slides if no banner found
        />
      </div>

      {/* Masonry cards */}
      <div className="mt-8 px-1 md:px-12">
        <h2 className="mt-5 px-3 text-lg md:text-xl font-bold">
          Offers & Deals
        </h2>
        <SanityMasonryCard
          bannerName="masonrybanner1"
          columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          gap="gap-1.5"
          fallbackItems={slides1}
        />
      </div>


      <div className="mt-4 px-1 md:px-8 lg:px-16 xl:px-32">
        <SanityPromotion promotionName="promo2" className="mt-5" />
      </div>



      <SanityProductSection
        sectionSlug="section-1"
        // Optional fallbacks if section not found in Sanity:
        fallbackCategoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID}
        fallbackHeading="New Arrivals"
        fallbackLimit={12}
      />

      {/* Masonry cards */}
      {/* <div className="mt-8 px-1 md:px-12">
        <h2 className="mt-5 px-3 text-lg md:text-xl font-bold">
          Offers & Deals
        </h2>
        <SanityMasonryCard
          bannerName="masonrybanner2"
          columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          gap="gap-1.5"
          fallbackItems={slides1}
        />
      </div> */}






      <SanityProductSection
        sectionSlug="section-2"
        // Optional fallbacks if section not found in Sanity:
        fallbackCategoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID}
        fallbackHeading="New Arrivals"
        fallbackLimit={12}
      />


      <SanityShuffledCategorySection
        sectionSlug="shuffle-1"
        fallbackLimit={12}
      />


      <SanityShuffledCategorySection /* Picked for you */
        sectionSlug="shuffle-2"
        fallbackLimit={12}
      />

    </div>
  );
};

export default HomePage;

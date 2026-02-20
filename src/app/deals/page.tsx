import ProductWrapper from "@/components/products/ProductWrapper";
import Promotion from "@/components/Promotion";
import React from "react";
import { Metadata } from "next";
import SanityBanner from "@/components/SanityBanner";
import SanityMasonryCard from "@/components/sanity/SanityMasonryCard";
import { slides1 } from "@/constants";
import SanityPromotion from "@/components/sanity/SanityPromotion";
import SanityProductSection from "@/components/sanity/SanityProductSection";
import SanityShuffledCategorySection from "@/components/sanity/SanityShuffledCategorySection";

export const revalidate = 60; // seconds (Regenerates page every 60 seconds)

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Deals and Promotions",
    description: "Discover the best deals and promotions on US Cartel. Get discounts on your favorite products every day, week, and month!",
    openGraph: {
      title: "Deals and Promotions - US Cartel",
      description: "Discover the best deals and promotions on US Cartel. Get discounts on your favorite products every day, week, and month!",
      url: "https://uscartel.com/deals",
      siteName: "US Cartel",
      images: [
        {
          url: "https://uscartel.com/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Deals and Promotions on US Cartel"
        }
      ],
      type: "website"
    }
  }
}

const DealPage = () => {
  return (
    <>
      <div className="mt-4 px-2 md:px-8 lg:px-16 xl:px-32">

        {/* Big Screens */}
        <div className="hidden sm:block mt-3">
          <SanityBanner bannerName="dealbanner1"
            height="h-[12rem] md:h-[24rem]"
          />
        </div>
        {/* Small Screens */}
        <div className="block mt-3 sm:hidden">
          <SanityBanner bannerName="dealbannermobile1"
            height="h-[12rem] md:h-[24rem]"
          />
        </div>

        {/* <h2 className="text-lg md:text-xl font-bold">Christmas Special Sales</h2> */}
        {/* <div className="mt-4">
        <Promotion
          startDate="2025-12-07T00:00:00Z"
          days={15}
          title="Christmas Special Sales"
          description="The Offers You've Never Seen Are Coming!"
          />
          </div> */}


        <SanityPromotion promotionName="promo1" className="mt-5" />


        <SanityPromotion promotionName="promo2" className="mt-5" />



        <div className="mt-3">
          <SanityBanner bannerName="dealbanner2"
            height="h-[12rem] md:h-[24rem]"
          />
        </div>

      </div>

      <div className="mt-5 px-1 md:px-12">
        <SanityMasonryCard
          bannerName="masonrybanner1"
          columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          gap="gap-2"
          fallbackItems={slides1}
        />
      </div>

      <SanityProductSection
        sectionSlug="section-1"
        // Optional fallbacks if section not found in Sanity:
        fallbackCategoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID}
        fallbackHeading="New Arrivals"
        fallbackLimit={12}
      />

      <SanityShuffledCategorySection /* Picked for you */
        sectionSlug="shuffle-2"
        fallbackLimit={12}
      />
    </>
  );
};

export default DealPage;

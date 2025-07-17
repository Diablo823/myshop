import ProductWrapper from "@/components/products/ProductWrapper";
import Promotion from "@/components/Promotion";
import React from "react";

const DealPage = () => {
  return (
    <div className="px-2 md:px-8 lg:px-16 xl:px-32">
      <div>
        <Promotion
          days={1}
          title="Daily Offers"
          description="Get discounts on products everyday!"
        />
      </div>
      <div>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID!}
          limit={6}
        />
      </div>
      <div className="mt-6">
        <Promotion
          days={7}
          title="Weekly Offers"
          description="Get discounts on products every single week!"
        />
      </div>
      <div>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID!}
          limit={8}
        />
      </div>
      <div className="mt-6">
        <Promotion
          days={20}
          title="Monthly Offers"
          description="Get amazing discounts everymonth!"
        />
      </div>
      <div>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_POPULAR_PRDUCTS_CATEGORY_ID!}
          limit={8}
        />
      </div>
    </div>
  );
};

export default DealPage;

import ProductWrapper from "@/components/products/ProductWrapper";
import Promotion from "@/components/Promotion";
import React from "react";

const DealPage = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div>
        <Promotion
          days={1}
          title="Daily Offers"
          description="Get discounts on products everyday!"
        />
      </div>
      <div>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID!}
          limit={6}
        />
      </div>
      <div>
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
      <div>
        <Promotion
          days={20}
          title="Monthly Offers"
          description="Get amazing discounts everymonth!"
        />
      </div>
      <div>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID!}
          limit={16}
        />
      </div>
    </div>
  );
};

export default DealPage;

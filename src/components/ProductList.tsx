import Image from "next/image";
import Link from "next/link";
import React from "react";
import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";
import { Badge } from "./ui/badge";

const PRODUCT_PER_PAGE = 20;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const wixClient = await wixClientServer();

  const productQuery = wixClient.products
    .queryProducts()
    //@ts-ignore
    .contains("name", searchParams?.name || "") //startsWith was here instead of contain
    .eq("collectionIds", categoryId)
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 999999)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    );
  //.find();

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");

    if (sortType === "asc") {
      productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery.descending(sortBy);
    }
  }

  const response = await productQuery.find();

  //console.log(response);

  const calculateDiscount = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div className="mt-12 flex gap-y-6 gap-x-8 justify-between flex-wrap ">
      {response.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="flex flex-col shadow-sm rounded-lg gap-4 w-[45%] sm:w-[45%] md:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-60 sm:h-72 rounded-lg">
            <Badge className="absolute top-2 right-2 z-20 bg-[#800020] hover:bg-[#800020] text-xs text-white">
              {calculateDiscount(
                product.priceData?.price || 0,
                product.priceData?.discountedPrice || 0
              )}
              % OFF
            </Badge>
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt="product"
              fill
              sizes="25vw"
              loading="lazy"
              className="absolute object-cover z-10 rounded-lg hover:opacity-0 transition-opacity ease-in duration-500"
            />
            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt="product"
                fill
                sizes="25vw"
                loading="lazy"
                className="absolute rounded-lg object-cover "
              />
            )}
          </div>
          <div className="flex p-2 justify-between gap-4">
            <span className="text-xs md:text-base font-bold">
              {product?.name?.length && product.name.length > 20
                ? `${product.name.substring(0, 20)}...`
                : product?.name || "No Name"}
            </span>
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-base font-bold">
                ₹{product.priceData?.discountedPrice}
              </span>
              <span className="text-xs md:text-base font-bold text-gray-700 line-through">
                ₹{product.priceData?.price}
              </span>
            </div>
          </div>
          {product.additionalInfoSections && (
            <div
              className="text-md text-gray-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (section: any) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            ></div>
          )}

          {/* <Button className="rounded-lg w-fit bg-emerald-300 text-gray-950 hover:bg-emerald-500">
            <span>ADD TO</span>
            <FaShoppingCart />
          </Button> */}
        </Link>
      ))}

      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={response.currentPage || 0}
          hasPrev={response.hasPrev()}
          hasNext={response.hasNext()}
        />
      ) : null}
    </div>
  );
};

export default ProductList;

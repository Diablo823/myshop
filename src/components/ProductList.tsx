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
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {response.items.map((product: products.Product) => (
          <Link
            href={"/" + encodeURIComponent(product.slug || "")}
            className="group flex flex-col rounded-2xl border bg-slate-50 shadow-sm transition-all hover:shadow-md"
            key={product._id}
          >
            <div className="relative pb-[120%] md:pb-[120%] w-full overflow-hidden rounded-t-2xl">
              <Badge className="absolute right-2 top-2 z-20 bg-[#800020] px-2 py-1 text-xs text-white hover:bg-[#800020]">
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover hover:scale-105 transition-all duration-300"
              />
              {/* {product.media?.items && (
                <Image
                  src={product.media?.items[1]?.image?.url || "/product.png"}
                  alt="product"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              )} */}
            </div>

            <div className="flex flex-row justify-between p-2 gap-4">
              
              <span className="text-xs md:text-sm font-bold">
                {product?.name?.length && product.name.length > 20
                  ? `${product.name.substring(0, 25)}...`
                  : product?.name || "No Name"}
              </span>

              {product.priceData?.price ===
              product.priceData?.discountedPrice ? (
                <span className="text-sm font-bold text-black">
                  ₹{product.priceData?.price}
                </span>
              ) : (
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-black">
                      ₹{product.priceData?.discountedPrice}
                    </span>
                    <span className="text-xs font-bold text-gray-500 line-through">
                      ₹{product.priceData?.price}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {product.additionalInfoSections && (
              <div
                className="px-3 pb-3 text-xs text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    product.additionalInfoSections.find(
                      (section: any) => section.title === "shortDesc"
                    )?.description || ""
                  ),
                }}
              ></div>
            )}
          </Link>
        ))}
      </div>

      {searchParams?.cat || searchParams?.name ? (
        <div className="mt-8">
          <Pagination
            currentPage={response.currentPage || 0}
            hasPrev={response.hasPrev()}
            hasNext={response.hasNext()}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ProductList;

// h-[300px] md:h-[425px]

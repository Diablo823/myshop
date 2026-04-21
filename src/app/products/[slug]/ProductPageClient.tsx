"use client";

import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import React, { useState, useMemo, useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import ShareUrlButton2 from "@/components/ShareUrlButton2";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackInStockNotificationButton from "@/components/BackInStockNotificationButton";
import { FaArrowDown, FaBox, FaTruck } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import ProcessingBox from "@/components/ProcessingBox";

interface AdditionalInfoSection {
  title?: string;
  description?: string;
}

interface ProductPageClientProps {
  product: any; // You should type this properly based on your Wix product type
}

const ProductPageClient = ({ product }: ProductPageClientProps) => {
  // Helper Function to find thfirst available variant
  const getInitialSelectedOptions = () => {
    if (!product.productOptions || !product.variants) {
      return {};
    }

    // Check if this product has real variants (not just the default one)
    const hasRealVariants =
      product.variants.length > 1 ||
      (product.variants.length === 1 &&
        product.variants[0]._id !== "00000000-0000-0000-0000-000000000000");

    if (!hasRealVariants) {
      return {};
    }

    const firstAvailableVariant = product.variants.find(
      (variant: any) =>
        variant.stock?.inStock &&
        variant.stock?.quantity &&
        variant.stock.quantity > 0 &&
        variant._id !== "00000000-0000-0000-0000-000000000000"
    );

    if (firstAvailableVariant && firstAvailableVariant.choices) {
      // Return the choices from the first available variant
      return firstAvailableVariant.choices;
    }

    // Fallback to first choice of each option if no variants are available
    return (
      product.productOptions
        ?.map((option: any) => ({
          [option.name || ""]: option.choices?.[0].description || "",
        }))
        ?.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {}) || {}
    );
  };

  // State to track selected options
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map((option: any) => ({
        [option.name || ""]: option.choices?.[0].description || "",
      }))
      ?.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {}) || {}
  );

  // State to track current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State to track active tab
  const [activeTab, setActiveTab] = useState<"specifications" | "delivery" | "features">(
    "delivery"
  );

  // Helper function to get current stock number
  const getCurrentStockNumber = () => {
    // If product has variants, find the selected variant's stock
    if (
      product.variants &&
      product.variants.length > 0 &&
      product.productOptions &&
      product.productOptions.length > 0
    ) {
      const hasRealVariants =
        product.variants.length > 1 ||
        (product.variants.length === 1 &&
          product.variants[0]._id !== "00000000-0000-0000-0000-000000000000");

      if (hasRealVariants) {
        // Find the variant that matches selected options
        const selectedVariant = product.variants.find((variant: any) => {
          if (!variant.choices) return false;

          return Object.entries(selectedOptions).every(
            ([optionName, choiceValue]) => {
              return variant.choices[optionName] === choiceValue;
            }
          );
        });

        return selectedVariant?.stock?.quantity || 0;
      }
    }

    // Fallback to product stock
    return product.stock?.quantity || 0;
  };

  const currentStockNumber = getCurrentStockNumber();

  // ─── Meta Pixel: ViewContent ───────────────────────────────────────────────
  const viewContentFired = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq && !viewContentFired.current) {
      viewContentFired.current = true;
      const price = product.priceData?.discountedPrice ?? product.priceData?.price ?? 0;
      window.fbq("track", "ViewContent", {
        content_ids: [product._id],
        content_name: product.name,
        content_type: "product",
        value: price,
        currency: "INR",
      });
    }
  }, [product._id]);

  // Configure DOMPurify once
  // Updated DOMPurify configuration to preserve HTML formatting
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      "p", // paragraphs
      "br", // line breaks
      "b", // bold
      "strong", // strong emphasis
      "i", // italic
      "em", // emphasis
      "u", // underline
      "ul", // unordered list
      "ol", // ordered list
      "li", // list item
      "span", // inline container
      "div", // block container
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6", // headings
    ],
    ALLOWED_ATTR: [
      "style", // inline styles
      "class", // CSS classes
      "id", // Element IDs
      "href", // Links (if you have any)
    ],
  };

  const calculateDiscount = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const filteredSections = product.additionalInfoSections?.filter(
    (section: AdditionalInfoSection) =>
      (section.title && section.description === "") ||
      (section.title === "" && section.description)
  );

  // const selectedOptionsMedia = product.productOptions?.flatMap(
  //   (option: any) => {
  //     const selectedChoice = option.choices?.find(
  //       (choice: any) =>
  //         choice.description === selectedOptions[option.name || ""]
  //     );
  //     return selectedChoice?.media?.items ?? [];
  //   }
  // );

  // // Determine which media to show
  // const mediaToShow =
  //   selectedOptionsMedia?.length > 0
  //     ? selectedOptionsMedia
  //     : product.media?.items;

  // Memoize the media calculations to prevent unnecessary re-renders
  const selectedOptionsMedia = useMemo(() => {
    return product.productOptions?.flatMap(
      (option: any) => {
        const selectedChoice = option.choices?.find(
          (choice: any) =>
            choice.description === selectedOptions[option.name || ""]
        );
        return selectedChoice?.media?.items ?? [];
      }
    );
  }, [product.productOptions, selectedOptions]);

  // Determine which media to show
  const mediaToShow = useMemo(() => {
    return selectedOptionsMedia?.length > 0
      ? selectedOptionsMedia
      : product.media?.items;
  }, [selectedOptionsMedia, product.media?.items]);

  return (
    <>
      {/* MOBILE: Full Width Images (visible only on mobile) */}
      <div className="block lg:hidden w-full mt-2 mb-2">
        <ProductImages
          items={mediaToShow}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
        />
      </div>

      {/* MAIN CONTENT CONTAINER WITH PADDING */}
      <div className="lg:min-h-[calc(100vh-80px)] px-2 md:px-8 lg:px-16 xl:px-32 relative flex flex-col lg:flex-row gap-12">
        {/* DESKTOP: Images with padding and sticky positioning */}
        <div className="hidden lg:block w-full lg:w-2/5 lg:sticky lg:top-20 lg:self-start">
          <ProductImages
            items={mediaToShow}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="w-full lg:w-3/5 flex flex-col gap-3 mt-2 lg:mt-5">
          {product.brand ? (
            <h2 className="text-sm md:text-lg font-bold tracking-wider text-black">
              {product.brand}
            </h2>
          ) : null}
          <div className="h-[2px] bg-gray-100" />
          <h1 className="text-base lg:text-lg font-bold">{product.name}</h1>

          <div className="h-[2px] bg-gray-100" />

          {product.priceData?.price === product.priceData?.discountedPrice ? (
            <h2 className="text-lg font-bold text-black">
              ₹{product.priceData?.price}
            </h2>
          ) : (
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-">
                ₹{product.priceData?.discountedPrice}
              </h3>
              <h3 className="text-lg font-bold line-through text-red-600">
                ₹{product.priceData?.price}
              </h3>
              <div className="text-xs text-green-600 font-bold flex flex-row gap-1 items-center">
                <span>
                  <FaArrowDown />
                </span>
                <span>
                  {calculateDiscount(
                    product.priceData?.price || 0,
                    product.priceData?.discountedPrice || 0
                  )}
                  % OFF
                </span>
              </div>
              <Badge className="bg-pink-900 text-xs text-white rounded-lg">
                {product.ribbon}
              </Badge>
            </div>
          )}

          <div className="h-[2px] bg-gray-100" />

          {product.variants &&
            product.variants.length > 0 &&
            product.productOptions &&
            product.productOptions.length > 0 &&
            (product.variants.length > 1 ||
              (product.variants.length === 1 &&
                product.variants[0]._id !==
                "00000000-0000-0000-0000-000000000000")) ? (
            <CustomizeProducts
              productId={product._id!}
              variants={product.variants}
              productOptions={product.productOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          ) : (
            <Add
              productId={product._id!}
              variantId="00000000-0000-0000-0000-000000000000"
              stockNumber={product.stock?.quantity || 0}
              //new props after metapixel
              productName={product.name}
              productPrice={product.priceData?.discountedPrice
                ?? product.priceData?.price ?? 0}
            />
          )}

          {currentStockNumber === 0 ? (
            <BackInStockNotificationButton
              product={product}
              selectedOptions={selectedOptions}
            />
          ) : null}

          <ShareUrlButton2 buttonText="Share this product" />

          <div className="h-[2px] bg-gray-100" />

          {/* NAVIGATION TABS */}
          <div className="w-full mt-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("delivery")}
                className={`px-6 py-3 font-semibold text-sm transition-all ${activeTab === "delivery"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`px-6 py-3 font-semibold text-sm transition-all ${activeTab === "features"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-3 font-semibold text-sm transition-all ${activeTab === "specifications"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Specifications
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="mt-6">
              {activeTab === "delivery" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <ProcessingBox
                    processingText="Processing"
                    processingValue="0 Days"
                    dispatchingText="Shipping"
                    dispatchValue="1 Day"
                    deliveryText="Delivery"
                    deliveryValue="4 - 7 Days"
                  />
                </div>
              )}

              {activeTab === "features" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">

                  {/* Additional Info Sections */}
                  <div className="space-y-2.5">
                    {product.additionalInfoSections?.map(
                      (section: AdditionalInfoSection) => {
                        if (section.title && section.description) {
                          return (
                            <div key={section.title}>
                              <Accordion type="single" collapsible className="group">
                                <AccordionItem
                                  value={section.title || "info"}
                                  className="
                      border border-violet-100 rounded-2xl overflow-hidden
                      bg-gradient-to-br from-white to-violet-50/30
                      shadow-sm shadow-violet-100/50
                      transition-all duration-200
                      hover:border-violet-300/60 hover:shadow-md hover:shadow-violet-200/40
                      data-[state=open]:border-violet-300/80
                      data-[state=open]:shadow-lg data-[state=open]:shadow-violet-200/50
                      data-[state=open]:bg-gradient-to-br data-[state=open]:from-white data-[state=open]:to-violet-50/60
                    "
                                >
                                  <AccordionTrigger
                                    className="
                        px-5 py-4 font-semibold text-sm text-slate-700
                        hover:text-violet-700 hover:no-underline
                        transition-colors duration-150
                        [&>svg]:text-violet-400 [&>svg]:transition-transform [&>svg]:duration-200
                      "
                                  >
                                    <span className="flex items-center gap-2.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                      {section.title}
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent className="px-5 pb-5">
                                    <div className="pt-1 border-t border-violet-100/70">
                                      <p
                                        className="text-slate-500 text-sm leading-relaxed mt-3"
                                        dangerouslySetInnerHTML={{
                                          __html: DOMPurify.sanitize(
                                            section.description || "",
                                            sanitizeConfig
                                          ),
                                        }}
                                      />
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      }
                    )}
                  </div>

                  {/* Filtered Sections */}
                  {filteredSections && filteredSections.length > 0 && (
                    <div className="
        relative overflow-hidden
        rounded-3xl border border-violet-200/60
        bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/60
        shadow-md shadow-violet-100/40
        px-5 md:px-7 py-5
      ">
                      {/* Decorative top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 rounded-t-3xl" />

                      <div className="flex flex-col gap-3 mt-1">
                        {filteredSections.map((section: AdditionalInfoSection) => {
                          if (section.title && section.description === "") {
                            return (
                              <div
                                key={section.title}
                                className="flex items-center gap-3 text-sm text-slate-600 font-medium group/item"
                              >
                                <span className="
                    relative flex-shrink-0 w-2 h-2
                  ">
                                  <span className="absolute inset-0 rounded-full bg-violet-400" />
                                  <span className="absolute inset-0 rounded-full bg-violet-300 scale-150 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                                </span>
                                {section.title}
                              </div>
                            );
                          } else if (section.title === "" && section.description) {
                            return (
                              <div
                                key={section.description}
                                className="
                    text-xs font-bold uppercase tracking-widest
                    text-violet-500 pt-3 mt-1
                    border-t border-violet-200/60
                    first:border-none first:pt-0 first:mt-0
                  "
                              >
                                {section.description}
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="
      relative overflow-hidden
      rounded-3xl border border-slate-200/70
      bg-gradient-to-br from-white via-slate-50/50 to-violet-50/20
      shadow-md shadow-slate-100/60
      px-5 md:px-8 py-6
    ">
                    {/* Decorative top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 rounded-t-3xl" />

                    <div
                      className="
          text-sm md:text-base text-slate-600 leading-relaxed
          prose prose-sm max-w-none mt-1
          prose-headings:text-slate-800 prose-headings:font-semibold prose-headings:tracking-tight
          prose-strong:text-slate-700 prose-strong:font-semibold
          prose-li:text-slate-600 prose-li:marker:text-violet-400
          prose-a:text-violet-500 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
          prose-p:text-slate-500 prose-p:leading-relaxed
          prose-hr:border-violet-100
        "
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          product.description || "",
                          sanitizeConfig
                        ),
                      }}
                    />
                  </div>
                </div>
              )}


            </div>
          </div>

          <div className="h-[2px] bg-gray-100 mt-2" />


        </div>
      </div>
    </>
  );
};

export default ProductPageClient;

import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import ProductPageClient from "./ProductPageClient";
import ProductScrollWrapper from "@/components/ProductScroll/ProductScrollWrapper";
import ProductWrapper from "@/components/products/ProductWrapper";
import { Metadata } from "next";
import DomPurify from "isomorphic-dompurify";
import RelatedProductsWrapper from "@/components/products/RelatedProductsWrapper";
import MultiCategoryRelatedWrapper from "@/components/multicategory/MultiCategoryProductWrapper";
import ShuffledCategoryWrapper from "@/components/multicategory/ShuffledCategoryWrapper";
import SanityProductSection from "@/components/sanity/SanityProductSection";

// CRITICAL: Set timeout limit and force dynamic rendering
export const maxDuration = 10;
export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable caching, always fetch fresh data

const sanitizeConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTETT: true,
};

let productCache: { [key: string]: any } = {};

async function getProduct(slug: string) {
  // Check cache first
  if (productCache[slug]) {
    return productCache[slug];
  }

  const wixClient = await wixClientServer();
  const decodedSlug = decodeURIComponent(slug);

  const products = await wixClient.products
    .queryProducts()
    .eq("slug", decodedSlug)
    .find();

  const product = products.items[0];

  // Cache for this request
  if (product) {
    productCache[slug] = product;
  }

  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Use cached product or fetch
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const productImage = product.media?.mainMedia?.image?.url;

  const price = parseFloat(
    (
      product.price?.formatted?.discountedPrice ||
      product.price?.formatted?.price ||
      "0"
    ).replace(/[^0-9.]/g, "")
  );
  const currency = product.price?.currency || "INR";
  const inStock = product.stock?.inStock !== false;
  const canonicalUrl = `https://uscartel.com/products/${slug}`;

  // SANITIZE AND PREPARE DESCRIPTION
  const rawDescription =
    product.description ||
    `Buy ${product.name} at the best price from US Cartel`;
  const cleanDescription = DomPurify.sanitize(rawDescription, sanitizeConfig);

  // Truncate description to 200 characters for metadata
  const truncatedDescription =
    cleanDescription.length > 200
      ? cleanDescription.slice(0, 200) + "..."
      : cleanDescription;

  return {
    title: `${product.name} - US Cartel`,
    description: truncatedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} - US Cartel`,
      description: truncatedDescription,
      url: canonicalUrl,
      images: productImage
        ? [
          {
            url: `${productImage}?w=1200&h=630&fit=crop`,
            width: 1200,
            height: 630,
            alt: product.name || "Product of US Cartel",
          },
        ]
        : [
          {
            url: "https://uscartel.com/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "US Cartel - Your one-stop shop for the best products",
          },
        ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name!,
      description: truncatedDescription,
      images: productImage ? [`${productImage}?w=1200&h=630&fit=crop`] : [],
    },
    // Removed 'other' field - JSON-LD will be added directly in the component
  };
}

const SinglePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Use cached product (already fetched in generateMetadata)
  const product = await getProduct(slug);

  if (!product || !product.visible) {
    // Clear cache on not found
    delete productCache[slug];
    return notFound();
  }

  // Prepare schema data
  const productImage = product.media?.mainMedia?.image?.url;

  // const price = parseFloat(
  //   (
  //     product.price?.formatted?.discountedPrice ||
  //     product.price?.formatted?.price ||
  //     "0"
  //   ).replace(/[^0-9.]/g, "")
  // );

  // Parse price with fallback
  let rawPriceString =
    product.price?.formatted?.discountedPrice ||
    product.price?.formatted?.price ||
    "0";
  rawPriceString = rawPriceString.replace(/[^0-9.]/g, ""); // Strip non-numeric chars

  const price = parseFloat(rawPriceString);

  //console.log(typeof (price))

  // Validation check
  if (isNaN(price) || price <= 0) {
    // Fallback: Skip schema or set a default/error. For now, log and skip 'offers' in schema.
    console.error(`Invalid price for product ${product._id}: ${rawPriceString}`);
    // In productSchema, you could conditionally omit 'offers' or set price to null, but Google prefers valid prices.
    // For simplicity, we'll set to 0.00 but in real scenarios, exclude the product from indexing if no price.
  } else {
    // Proceed with .toFixed(2) in the schema as before
  }

  const currency = product.price?.currency || "INR";
  const inStock = product.stock?.inStock !== false;
  const canonicalUrl = `https://uscartel.com/products/${slug}`;

  // SANITIZE DESCRIPTION
  const rawDescription =
    product.description ||
    `Buy ${product.name} at the best price from US Cartel`;
  const cleanDescription = DomPurify.sanitize(rawDescription, sanitizeConfig);

  // Create complete Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: cleanDescription,
    image: productImage,
    sku: product.sku || product._id,
    brand: product.brand
      ? {
        "@type": "Brand",
        name: product.brand,
      }
      : {
        "@type": "Brand",
        name: "US Cartel",
      },
    offers: {
      "@type": "Offer",
      // FIX 1: Add .toFixed(2) here
      price: (isNaN(price) || price <= 0) ? "0.00" : price.toFixed(2),
      priceCurrency: currency,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonicalUrl,
      // FIX 2: Add condition (Crucial for Amazon-style cards)
      itemCondition: "https://schema.org/NewCondition",
      // FIX 3: Add your ₹25 shipping fee
      shippingDetails: {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "25.00", // Change if not free
          "currency": currency
        }
      },
      seller: {
        "@type": "Organization",
        name: "US Cartel",
        url: "https://uscartel.com",
      },
    },
  };


  // ADD THIS: Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://uscartel.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://uscartel.com/list?cat=all-products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        // Note: last item doesn't have "item" property
      }
    ]
  };

  // Filter out "all products" category ID
  const ALL_PRODUCTS_CATEGORY_ID = "00000000-0000-0000-0000-000000000001";
  const filteredCollectionIds = (product.collectionIds || []).filter(
    (id: string) => id !== ALL_PRODUCTS_CATEGORY_ID
  );

  // Clear cache after use to prevent memory leaks
  delete productCache[slug];

  return (
    <>
      {/* Product Schema - Must be at the top for Google to detect */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {/* ADD THIS: Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Client Component for main product display */}
      <ProductPageClient product={product} />

      {/* Server Components for product recommendations */}



      <div className="px-1 md:px-8 lg:px-16 xl:px-32">
        <ShuffledCategoryWrapper
          heading="You May Also Like"
          categoryIds={filteredCollectionIds}
          limit={12}
          shuffleCategories={true}
          shuffleProducts={true}
          productsPerCategory={30}
          strategy="weighted"
        />
      </div>


      {/* Related Products Section - Uses multiple algorithms */}
      <div className="px-1 md:px-8 lg:px-16 xl:px-32">
        <h2 className="px-3 text-lg md:text-xl font-bold mt-8">
          Recommended For You
        </h2>
        <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
          <RelatedProductsWrapper productId={product._id!} limit={10} />
        </Suspense>
      </div>

      <div className="px-1 md:px-8 lg:px-16 xl:px-32">
        <h2 className="px-3 text-lg md:text-xl font-bold mt-6">
          Recommended Products
        </h2>
        <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
          <MultiCategoryRelatedWrapper
            categoryIds={filteredCollectionIds}
            currentProductId={product._id!}
            limit={8}
            productsPerCategory={20}
            shuffle={true}
          />
        </Suspense>
      </div>

      <SanityProductSection
        sectionSlug="section-1"
        // Optional fallbacks if section not found in Sanity:
        fallbackCategoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID}
        fallbackHeading="New Arrivals"
        fallbackLimit={12}
      />

      <div className="px-1 md:px-8 lg:px-16 xl:px-32">
        <h2 className="px-3 text-lg md:text-xl font-bold mt-8">
          More Selections
        </h2>
        <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
          <MultiCategoryRelatedWrapper
            categoryIds={filteredCollectionIds}
            currentProductId={product._id!}
            limit={6}
            shuffle={true}
          />
        </Suspense>
      </div>
    </>
  );
};

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="group flex flex-col rounded-2xl border bg-slate-50 shadow-sm animate-pulse"
          >
            <div className="relative pb-[120%] w-full overflow-hidden rounded-t-2xl bg-gray-200"></div>
            <div className="flex flex-row justify-between p-2 gap-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SinglePage;
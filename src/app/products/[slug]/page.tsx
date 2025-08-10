import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import React from "react";
import ProductPageClient from "./ProductPageClient";
import ProductScrollWrapper from "@/components/ProductScroll/ProductScrollWrapper";
import ProductWrapper from "@/components/products/ProductWrapper";
import { Metadata } from "next";
import  DomPurify  from "isomorphic-dompurify";

const sanitizeConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTETT: true,
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {

  const wixClient = await wixClientServer();
  const decodedSlug = decodeURIComponent(params.slug);

  const products = await wixClient.products.queryProducts().eq("slug", decodedSlug).find();

  if (!products.items[0]) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    }
  }

  const product = products.items[0];
  const productImage = product.media?.mainMedia?.image?.url;
  //const price = product.price?.formatted?.discountedPrice || product.price?.formatted?.price;

  const price = parseFloat(
    (product.price?.formatted?.discountedPrice || product.price?.formatted?.price || "0")
      .replace(/[^0-9.]/g, '')
  );
  const currency = product.price?.currency || "USD";
  const inStock = product.stock?.inStock !== false;
  const canonicalUrl = `https://uscartel.com/products/${params.slug}`;

  // SANITIZE AND PREPARE DESCRIPTION
  const rawDescription = product.description || `Buy ${product.name} at the best price from US Cartel`;
  const cleanDescription = DomPurify.sanitize(rawDescription, sanitizeConfig);

  // Truncate description to 200 characters for metadata
  const truncatedDescription = cleanDescription.length > 200 ? cleanDescription.slice(0, 200) + '...' : cleanDescription;

 // Structured data for rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": cleanDescription,
    "image": productImage,
    "brand": product.brand ? {
      "@type": "Brand",
      "name": product.brand
    } : undefined,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "url": canonicalUrl,
      "seller": {
        "@type": "Organization",
        "name": "US Cartel"
      }
    }
  };
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
      images: productImage ? [
        {
          url: `${productImage}?w=1200&h=630&fit=crop`,
          width: 1200,
          height: 630,
          alt: product.name || "Product of US Cartel",
        }
      ] : [
        {
          url: "https://uscartel.com/og-image.png",
          width: 1200,
          height: 630,
          alt: "US Cartel - Your one-stop shop for the best products",
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name!,
      description: truncatedDescription,
      images: productImage ? [`${productImage}?w=1200&h=630&fit=crop`] : [],
    },
    other: {
      'json-ld': JSON.stringify(jsonLd)
    }
  };
}

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const wixClient = await wixClientServer();

  const decodedSlug = decodeURIComponent(params.slug)
  
  const products = await wixClient.products
    .queryProducts()
    .eq("slug", decodedSlug)
    .find();

  if (!products.items[0] || !products.items[0].visible) {
    return notFound();
  }

  const product = products.items[0];

  return (
    <>
      {/* Client Component for main product display */}
      <ProductPageClient product={product} />

      {/* Add structured data to body */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.media?.mainMedia?.image?.url,
            "brand": product.brand,
            "offers": {
              "@type": "Offer",
              "price": product.price?.price,
              "priceCurrency": product.price?.currency || "USD",
              "availability": product.stock?.inStock 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
      
      {/* Server Components for product recommendations */}
      <div className="px-2 md:px-8 lg:px-16 xl:px-32">
        <h2 className="text-lg md:text-xl font-bold mt-8">More Picks</h2>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID!}
          limit={6}
        />
      </div>

      {/* SCROLL SECTION */}
      <div className="px-2 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <ProductScrollWrapper
          categoryId={process.env.NEXT_PUBLIC_ALL_PRDUCTS_CATEGORY_ID!}
          limit={16}
        />
      </div>
      <div className="px-2 md:px-8 lg:px-16 xl:px-32">
        <h2 className="text-lg md:text-xl font-bold mt-8">More Selections</h2>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_POPULAR_PRDUCTS_CATEGORY_ID!}
          limit={10}
        />
      </div>

      {/*<h2 className="px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64 text-lg md:text-xl font-bold mt-8">Essentials for you</h2>
       <div className="px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <ProductScrollWrapper
          categoryId={process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID!}
          limit={20}
        />
      </div> */}

      {/* <RelatedProducts productId={product._id!} /> */}
    </>
  );
};

export default SinglePage;

/* interface RelatedProductsProps {
  productId: string;
}

async function RelatedProducts({ productId }: RelatedProductsProps) {
  const wixClient = await wixClientServer();
  const algorithm = await wixClient.recommendations.listAvailableAlgorithms();

  console.log(JSON.stringify(algorithm, null, 2));

  return <div>

  </div>
  
} */
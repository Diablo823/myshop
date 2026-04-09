import { NextResponse } from "next/server";
import { wixClientServer } from "@/lib/wixClientServer";

export const dynamic = "force-dynamic";

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

export async function GET() {
    try {
        const wixClient = await wixClientServer();

        // Paginate through ALL products
        let allProducts: any[] = [];
        let page = 0;
        const pageSize = 100;

        while (true) {
            const result = await wixClient.products
                .queryProducts()
                .hasSome("productType", ["physical", "digital"])
                .limit(pageSize)
                .skip(page * pageSize)
                .find();

            allProducts = [...allProducts, ...result.items];
            if (!result.hasNext() || result.items.length === 0) break;
            page++;
        }

        const feedItems = allProducts
            .filter((product) => product.media?.mainMedia?.image?.url) // skip products with no image
            .map((product) => {
                const originalPrice = product.priceData?.price ?? 0;
                const discountedPrice = product.priceData?.discountedPrice ?? originalPrice;
                const mainImageUrl = product.media?.mainMedia?.image?.url ?? "";
                const productUrl = `https://www.uscartel.com/products/${encodeURIComponent(product.slug || "")}`;
                const availability = product.stock?.inStock === false ? "out of stock" : "in stock";

                // Replace the plainDescription line with this:
                const imageAltTexts = (product.media?.items ?? [])
                    .filter((item: any) => item.image?.altText)
                    .map((item: any) => item.image.altText)
                    .join(". ");

                const baseDescription = product.description
                    ? stripHtml(product.description).substring(0, 400)
                    : product.name ?? "";

                const plainDescription = imageAltTexts
                    ? `${baseDescription} ${imageAltTexts}`.substring(0, 500)
                    : baseDescription;

                // Additional images — skip videos, skip duplicates of main image, max 9
                const additionalImageTags = (product.media?.items ?? [])
                    .filter(
                        (item: any) =>
                            item.image?.url &&
                            item.image.url !== mainImageUrl
                    )
                    .slice(0, 9)
                    .map(
                        (item: any) =>
                            `    <g:additional_image_link>${item.image.url}</g:additional_image_link>`
                    )
                    .join("\n");

                // Only add sale_price tag if there's an actual discount
                const salePriceLine =
                    discountedPrice < originalPrice
                        ? `    <g:sale_price>${discountedPrice} INR</g:sale_price>`
                        : "";

                const brandLine = product.brand
                    ? `    <g:brand><![CDATA[${product.brand}]]></g:brand>`
                    : "";

                return `
  <item>
    <g:id><![CDATA[${product._id}]]></g:id>
    <g:title><![CDATA[${product.name}]]></g:title>
    <g:description><![CDATA[${plainDescription}]]></g:description>
    <g:link>${productUrl}</g:link>
    <g:image_link>${mainImageUrl}</g:image_link>
${additionalImageTags}
    <g:price>${originalPrice} INR</g:price>
${salePriceLine}
    <g:availability>${availability}</g:availability>
    <g:condition>new</g:condition>
${brandLine}
  </item>`;
            })
            .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>US Cartel Products</title>
    <link>https://www.uscartel.com</link>
    <description>US Cartel Product Catalog</description>
${feedItems}
  </channel>
</rss>`;

        return new NextResponse(xml, {
            headers: {
                "Content-Type": "application/xml; charset=utf-8",
                "Cache-Control": "public, max-age=43200, s-maxage=43200", // 12 hours
            },
        });

    } catch (error) {
        console.error("Pinterest feed generation error:", error);
        return new NextResponse("Feed generation failed", { status: 500 });
    }
}
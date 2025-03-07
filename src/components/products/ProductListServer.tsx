import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";

const PRODUCT_PER_PAGE = 12;

export async function getProducts({
  categoryId,
  limit,
  page = 0,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  page?: number;
  searchParams?: any;
}) {
  const wixClient = await wixClientServer();

  const productQuery = wixClient.products
    .queryProducts()
    //@ts-ignore
    .contains("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 999999)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(page * (limit || PRODUCT_PER_PAGE));

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");

    if (sortType === "asc") {
      productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery.descending(sortBy);
    }
  }

  return await productQuery.find();
}
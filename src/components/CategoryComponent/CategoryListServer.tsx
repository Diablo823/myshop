import { wixClientServer } from "@/lib/wixClientServer";
import CategoryListClient from "./CategoryList2";


export default async function CategoryListServer() {
  const wixClient = await wixClientServer();
  const categories = await wixClient.collections.queryCollections().find();

  return <CategoryListClient initialCategories={categories.items} />;
}
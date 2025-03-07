import { wixClientServer } from "@/lib/wixClientServer";
import CategoryList from "./CategoryList";


export default async function CategoryListServer() {
  const wixClient = await wixClientServer();
  const categories = await wixClient.collections.queryCollections().find();

  return <CategoryList initialCategories={categories.items} />;
}
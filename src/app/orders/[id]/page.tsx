import { notFound } from "next/navigation";
import { wixClientServer } from "@/lib/wixClientServer";
import { orders } from "@wix/ecom";
import OrderDetails from "./OrderDetails";
import { formatDistanceToNow } from "date-fns";

type OrderType = orders.Order;

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //const id = params.id;
  const { id } = await params;
  const wixClient = await wixClientServer();

  let order: OrderType;
  try {
    order = await wixClient.orders.getOrder(id);
  } catch (error) {
    return notFound();
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Date not available";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return `${dateObj.toLocaleDateString()} (${formatDistanceToNow(dateObj, {
      addSuffix: true,
    })})`;
  };

  const transformWixImageUrl = (wixUrl: string): string => {
    const match = wixUrl.match(/image:\/\/v1\/(.*?)(\/|$|\?|#)/);
    if (!match) return "/placeholder.jpg";
    return `https://static.wixstatic.com/media/${match[1]}`;
  };

  const getProductName = (item: any): string => {
    if (typeof item.productName === "string") {
      return item.productName;
    }
    if (item.productName?.original) {
      return item.productName.original;
    }
    return "Product Name Not Available";
  };

  const getProductDetails = (descriptionLines: any[]) => {
    let size = "";
    let color = "";

    descriptionLines?.forEach((line) => {
      if (line.lineType === "PLAIN_TEXT" && line.name?.original === "Size") {
        size = line.plainTextValue?.original || "";
      }
      if (line.lineType === "COLOR" && line.name?.original === "Color") {
        color = line.colorInfo?.original || "";
      }
    });

    return { size, color };
  };

  // Prepare the data to pass to the client component
  const lineItems =
    order.lineItems?.map((item: any) => {
      const { size, color } = getProductDetails(item.descriptionLines || []);
      return {
        _id: item._id || `item-${Math.random().toString(36).substr(2, 9)}`, // Ensuring _id is a string
        productName: getProductName(item),
        image: item.image
          ? transformWixImageUrl(item.image)
          : "/placeholder.jpg",
        size: size || "N/A",
        color: color || "N/A",
        quantity: Number(item.quantity || 0), // Ensure quantity is a number
        price: item.price?.formattedAmount || "N/A",
      };
    }) || [];

  const orderData = {
    order,
    formattedDate: formatDate(order.purchasedDate),
    lineItems,
  };

  return <OrderDetails orderData={orderData} />;
}

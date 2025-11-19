"use client";
import { format } from "date-fns";
import { Order, OrderLineItem } from "./ProfileData";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { HourglassMediumIcon } from "@phosphor-icons/react";

interface OrdersListProps {
  initialOrders: Order[];
  initialCursor: string | null;
  contactId?: string;
}

const OrdersList = ({ initialOrders, initialCursor, contactId }: OrdersListProps) => {
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const formatDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PP");
  };

  const transformWixImageUrl = (wixUrl: string): string => {
    const match = wixUrl.match(/image:\/\/v1\/(.*?)(\/|$|\?|#)/);
    if (!match) return "/placeholder.jpg";
    return `https://static.wixstatic.com/media/${match[1]}`;
  };

  const formatDateTime = (
    dateString: string | Date | null | undefined
  ): string => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPp");
  };

  const handleLoadMore = async () => {
    if (!cursor || !contactId || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const response = await fetch("/api/profile/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId,
          cursor,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrdersList((prev) => [...prev, ...(data.orders || [])]);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error("Error loading more orders:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl pt-4 px-2 border border-white/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full"></div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Order History
        </h2>
      </div>

      <div className="space-y-6 py-3">
        {ordersList.length > 0 ? (
          <>
            {ordersList.map((order: Order) => (
              <div
                key={order._id}
                className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
              >
                <div className="flex flex-row justify-between items-center mb-4 gap-3">
                  <div>
                    <p className="font-bold text-sm md:text-lg text-gray-900">
                      Order #{order.number}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      {formatDateTime(order.purchasedDate)}
                    </p>
                  </div>

                  {order.status === "APPROVED" ? (
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-xs md:text-sm font-semibold shadow-sm w-fit">
                      {order.status}
                    </span>
                  ) : order.status === "CANCELED" ? (
                    <span className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full text-xs md:text-sm font-semibold shadow-sm w-fit">
                      {order.status}{" "}
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 rounded-full text-sm font-semibold shadow-sm w-fit">
                      {order.status}{" "}
                    </span>
                  )}
                </div>

                <Link href={`/orders/${order._id}`}>
                  <div className="space-y-4 cursor-pointer">
                    {(order.lineItems as OrderLineItem[])?.map(
                      (item: OrderLineItem) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 p-2 mb-2 hover:bg-blue-50 rounded-2xl transition-all duration-200 border border-transparent hover:border-blue-200"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={
                                typeof item.image === "string"
                                  ? transformWixImageUrl(item.image)
                                  : "/api/placeholder/100/100"
                              }
                              alt={
                                (item.productName as { original: string })
                                  ?.original || "Product image"
                              }
                              fill
                              sizes="80px"
                              className="object-cover rounded-xl shadow-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">
                              {
                                (item.productName as { original: string })
                                  ?.original
                              }
                            </p>
                            <p className="text-xs text-gray-600 font-medium">
                              Quantity:{" "}
                              <span className="font-bold">{item.quantity}</span>{" "}
                              × {item.price?.formattedAmount}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Link>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-bold text-lg text-gray-800">Total:</span>
                  <span className="font-bold text-lg text-gray-900 bg-blue-50 px-4 py-2 rounded-xl shadow-sm">
                    {order.priceSummary?.total?.formattedAmount}
                  </span>
                </div>
              </div>
            ))}

            {cursor && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-gradient-to-r from-gray-800 to-gray-950 hover:from-gray-900 hover:to-black text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin"><HourglassMediumIcon size={22} weight="bold" /></span>
                      Loading...
                    </span>
                  ) : (
                    "See More"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center mb-4">
                <Image
                  src="/hippocart.webp"
                  alt="No Orders"
                  width={164}
                  height={164}
                />
              </div>
              <p className="text-gray-600 text-xl font-bold mb-2">
                No Orders Yet!
              </p>
              <p className="text-sm text-gray-700 mb-6">
                Order your first product & Start your shopping journey inside US
                Cartel
              </p>
            </div>
            <Link href="/list?cat=all-products" className="inline-block">
              <div className="flex gap-2 items-center bg-gradient-to-r from-[#BE5103] to-[#99431F] hover:from-[#99431F] hover:to-[#7A3419] text-white font-bold px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
                <span>
                  <FaShoppingCart size={22} />
                </span>
                <span className="text-lg">Start Shopping</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
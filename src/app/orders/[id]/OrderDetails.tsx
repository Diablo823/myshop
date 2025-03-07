"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orders } from "@wix/ecom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CancellationRequestForm } from "@/components/CancellationRequestFrom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";


type LineItem = {
  _id: string;
  productName: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: string;
};

type OrderDataProps = {
  order: orders.Order;
  formattedDate: string;
  lineItems: LineItem[];
};

const OrderDetails = ({ orderData }: { orderData: OrderDataProps }) => {
  const { order, formattedDate, lineItems } = orderData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  
  const { toast } = useToast();

  // Modify only the cancelOrder function in your OrderDetails component

  const handleCancelOrder = async () => {
    setIsCanceling(true);
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order._id,
          restockAllItems: true,
          sendOrderCanceledEmail: true,
          customMessage: "Your order has been cancelled."
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Cancellation failed');
      }

      toast({
        title: "Success!",
        description: "Order cancelled successfully",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
      setIsDialogOpen(false);
    }
  };

  const isOrderCanceled = order.status === "CANCELED" || cancelSuccess;

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between items-center">
            <span>Order Details</span>
            <span className="text-lg font-normal">
              #{order.number || "N/A"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Order Status</h3>
              <p className="font-medium">{cancelSuccess ? "CANCELLED" : order.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Payment Status</h3>
              <p className="font-medium">{order.paymentStatus || "N/A"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Delivery Status</h3>
              <p className="font-medium">
                {order.fulfillmentStatus === "NOT_FULFILLED"
                  ? "UNFULFILLED"
                  : order.fulfillmentStatus === "FULFILLED"
                  ? "FULFILLED"
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Product Details */}
          {lineItems.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 mb-4">
              <div className="flex flex-row gap-4">
                <div className="w-1/4">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={200}
                    height={200}
                    className="rounded-xl w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{item.productName}</h3>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p>{item.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p>{item.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p>{item.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="mb-4">{order.buyerInfo?.email || "N/A"}</p>
                <p className="text-sm text-gray-500 mb-1">Order Date</p>
                <p>{formattedDate}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {order.recipientInfo?.address ? (
                  <>
                    <p>{order.recipientInfo.address.addressLine1}</p>
                    {order.recipientInfo.address.addressLine2 && (
                      <p>{order.recipientInfo.address.addressLine2}</p>
                    )}
                    <p>{order.recipientInfo.address.city}</p>
                    <p>{order.recipientInfo.address.subdivisionFullname}</p>
                    <p>
                      {order.recipientInfo.address.countryFullname} -{" "}
                      {order.recipientInfo.address.postalCode}
                    </p>
                  </>
                ) : (
                  <p>No shipping address available</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>
                  {order.priceSummary?.subtotal?.formattedAmount || "₹0.00"}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>
                  {order.priceSummary?.shipping?.formattedAmount || "₹0.00"}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>
                  {order.priceSummary?.tax?.formattedAmount || "₹0.00"}
                </span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>
                  {order.priceSummary?.total?.formattedAmount || "₹0.00"}
                </span>
              </div>
            </div>

                

            <div className="flex items-center justify-center gap-6 mt-6">
              <Link href="/">
                <Button className="bg-black hover:bg-gray-950">Continue</Button>
              </Link>

              {isOrderCanceled ? (
                <Button variant="notAllowed" className="bg-gray-400 text-white">
                  Order Cancelled
                  </Button>
              ) : (
                <CancellationRequestForm 
                orderId={order._id!}
                orderNumber={order.number!}
              />
              )}

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;

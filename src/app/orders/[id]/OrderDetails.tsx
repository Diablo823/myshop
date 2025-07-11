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
  <div className="min-h-[calc(100vh-80px)] p-2 md:p-8 lg:p-16 max-w-7xl mx-auto">
    {/* Main Container with Gradient Background */}
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl shadow-2xl overflow-hidden mb-8">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-4 md:p-6">
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Order Details
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-75">Order NO</span>
            <span className="text-lg font-semibold bg-white/10 px-3 py-1 rounded-full">
              #{order.number || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-2 mt-4 md:p-6">
        {/* Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Order Status</h3>
            </div>
            <p className="font-medium text-lg text-gray-900">
              {cancelSuccess ? "CANCELLED" : order.status}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Payment Status</h3>
            </div>
            <p className="font-medium text-lg text-gray-900">{order.paymentStatus || "N/A"}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Delivery Status</h3>
            </div>
            <p className="font-medium text-lg text-gray-900">
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
          <div key={item._id} className="bg-white rounded-2xl p-2 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4 flex justify-center md:justify-start">
                <div className="relative group">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={200}
                    height={200}
                    className="rounded-xl w-full max-w-[200px] object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all duration-300"></div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">{item.productName}</h3>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500 font-medium mb-1">Size</p>
                    <p className="font-semibold text-gray-900">{item.size}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500 font-medium mb-1">Color</p>
                    <p className="font-semibold text-gray-900">{item.color}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500 font-medium mb-1">Quantity</p>
                    <p className="font-semibold text-gray-900">{item.quantity}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                    <p className="font-bold text-gray-950">{item.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
              Customer Information
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-200 shadow-md">
              <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">Email</p>
              <p className="mb-4 font-semibold text-gray-900">{order.buyerInfo?.email || "N/A"}</p>
              <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">Order Date</p>
              <p className="font-semibold text-gray-900">{formattedDate}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
              Shipping Address
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-2xl border border-gray-200 shadow-md">
              {order.recipientInfo?.address ? (
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">{order.recipientInfo.address.addressLine1}</p>
                  {order.recipientInfo.address.addressLine2 && (
                    <p className="font-semibold text-gray-900">{order.recipientInfo.address.addressLine2}</p>
                  )}
                  <p className="font-semibold text-gray-900">{order.recipientInfo.address.city}</p>
                  <p className="font-semibold text-gray-900">{order.recipientInfo.address.subdivisionFullname}</p>
                  <p className="font-semibold text-gray-900">
                    {order.recipientInfo.address.countryFullname} -{" "}
                    {order.recipientInfo.address.postalCode}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No shipping address available</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-3">
            <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
            Order Summary
          </h3>
          <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6 rounded-2xl border border-gray-200 shadow-lg">
            <div className="flex justify-between mb-2 py-2">
              <span className="font-medium text-gray-700">Subtotal</span>
              <span className="font-semibold text-gray-900">
                {order.priceSummary?.subtotal?.formattedAmount || "₹0.00"}
              </span>
            </div>
            <div className="flex justify-between mb-2 py-2">
              <span className="font-medium text-gray-700">Shipping</span>
              <span className="font-semibold text-gray-900">
                {order.priceSummary?.shipping?.formattedAmount || "₹0.00"}
              </span>
            </div>
            <div className="flex justify-between mb-2 py-2">
              <span className="font-medium text-gray-700">Tax</span>
              <span className="font-semibold text-gray-900">
                {order.priceSummary?.tax?.formattedAmount || "₹0.00"}
              </span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t-2 border-gray-300">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-950 bg-white px-4 py-2 rounded-xl shadow-md">
                {order.priceSummary?.total?.formattedAmount || "₹0.00"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
            <Link href="/">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-[#453B27] to-[#342C1D] hover:from-[#342C1D] hover:to-[#2A231A] text-white px-8 py-3 font-semibold shadow-lg rounded-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
                Continue
              </Button>
            </Link>

            {isOrderCanceled ? (
              <Button variant="notAllowed" className="w-full sm:w-auto bg-gray-400 text-white px-8 py-3 font-semibold rounded-lg">
                Order Cancelled
              </Button>
            ) : order.fulfillmentStatus === 'FULFILLED' ? (
              <Button variant="notAllowed" className="w-full sm:w-auto bg-gray-400 text-xs text-white px-8 py-3 font-semibold rounded-lg">
                Order Fulfilled (Cannot Cancel)
              </Button>
            ) : (
              <CancellationRequestForm 
                orderId={order._id!}
                orderNumber={order.number!}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default OrderDetails;

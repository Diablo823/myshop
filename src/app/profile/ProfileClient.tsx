"use client";
import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { ProfileData, Order, OrderLineItem, Address } from "./ProfileData";
import { RiShutDownLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useWixClient } from "@/hooks/useWixClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfileClient = ({ profileData }: { profileData: ProfileData }) => {
  const wixClient = useWixClient();

  const { isAuthenticated, member, ordersList } = profileData;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // Remove the refresh token
      Cookies.remove("refreshToken");

      // Get the logout URL
      const { logoutUrl } = await wixClient.auth.logout(window.location.href);

      // Force a complete page refresh when logging out
      window.location.href = logoutUrl;
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
      router.refresh();
      router.push("/");
    }
  };

  if (!isAuthenticated || !member) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6 text-center max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Please Log In!</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile
          </p>
          <Link href="/authentication">
            <Button className="bg-gray-950 hover:bg-gray-900 w-full">
              Go to Login <FaArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PP");
  };

  const formatDateTime = (
    dateString: string | Date | null | undefined
  ): string => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPp");
  };

  const uniqueAddresses =
    member.contact?.addresses?.reduce<Address[]>((acc, address) => {
      if (!acc.find((a) => a._id === address._id)) {
        acc.push(address as Address);
      }
      return acc;
    }, []) || [];

  const transformWixImageUrl = (wixUrl: string): string => {
    const match = wixUrl.match(/image:\/\/v1\/(.*?)(\/|$|\?|#)/);
    if (!match) return "/placeholder.jpg";
    return `https://static.wixstatic.com/media/${match[1]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 md:top-20 md:sticky self-start">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center text-white text-2xl font-semibold">
                {member.contact?.firstName?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile Details</h2>
                <p className="text-sm text-gray-500">
                  Member since {formatDate(member._createdDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Personal Information</h3>
              <div className="space-y-2">
                <p>First Name: {member.contact?.firstName || "N/A"}</p>
                <p>Last Name: {member.contact?.lastName || "N/A"}</p>
                <p>Username: {member.profile?.nickname || "N/A"}</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {member.loginEmail}
                </p>
                {member.contact?.phones?.[0] && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {member.contact.phones[0]}
                  </p>
                )}
              </div>
              <div className="mt-6 flex gap-8">
                {/* <Button>
                  <span>Update</span>{" "}
                  <span className="text-xl">
                    <FaUserGear />
                  </span>{" "}
                </Button> */}
              </div>
            </div>

            {uniqueAddresses.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Addresses</h3>
                <div className="space-y-4">
                  {uniqueAddresses.map((address) => (
                    <div
                      key={address._id}
                      className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <MapPin className="h-4 w-4 mt-1 text-blue-600" />
                      <div>
                        <p>{address.addressLine}</p>
                        <p>
                          {address.city}, {address.subdivision}
                        </p>
                        <p>{address.postalCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
<AlertDialogTrigger asChild>

            <Button
              //onClick={handleLogout}
              className="bg-red-600 w-full text-slate-100 hover:text-white hover:bg-red-700 cursor-pointer rounded-xl"
            >
              <span>LogOut</span> <RiShutDownLine />
            </Button>
</AlertDialogTrigger>
<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>
            You can log back in at any time and continue where you left off.
          </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-slate-100 hover:text-white hover:bg-red-700 cursor-pointer">
            
              <span>LogOut</span> <RiShutDownLine />
            
          </AlertDialogAction>
        </AlertDialogFooter>
</AlertDialogContent>
            </AlertDialog>

          </div>
          <h3 className="mt-6 font-semibold text-sm text text-gray-600">
            If you want to update your profile information <br />
            message <i>support@uscartel.com</i>
          </h3>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow p-2">
          <h2 className="text-xl font-semibold mb-6 pl-6 pt-4">Order History</h2>
          <div className="space-y-6">
            {ordersList.length > 0 ? (
              ordersList.map((order: Order) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">Order #{order.number}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(order.purchasedDate)}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {order.status}
                    </span>
                  </div>
                  <Link href={`/orders/${order._id}`}>
                    <div className="space-y-4">
                      {(order.lineItems as OrderLineItem[])?.map(
                        (item: OrderLineItem) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="relative w-16 h-16">
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
                                sizes="(max-width: 64px) 100vw"
                                className="object-cover rounded-xl"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {
                                  (item.productName as { original: string })
                                    ?.original
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity} ×{" "}
                                {item.price?.formattedAmount}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </Link>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t">
                    <span className="font-medium">Total:</span>
                    <span>{order.priceSummary?.total?.formattedAmount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg font-semibold">
                  No Orders Yet!
                </p>
                <Link
                  href="/list?cat=all-products"
                  className="mt-4 inline-block"
                >
                  <Button className="mt-2 bg-[#BE5103] hover:bg-[#99431F] text-slate-100 hover:text-slate-200 font-bold text-sm">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;

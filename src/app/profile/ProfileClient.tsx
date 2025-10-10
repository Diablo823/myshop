"use client";
import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
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
import OrdersList from "./OrdersList";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-2 relative">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Profile Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl pt-2 px-2 md:top-20 md:sticky self-start border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {member.contact?.firstName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {member.profile?.nickname || "Profile Details"}
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Member since {formatDate(member._createdDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h3 className="font-bold text-lg text-gray-800">Personal Information</h3>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-2 space-y-2 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">First Name</p>
                  <p className="font-semibold text-gray-900">{member.contact?.firstName || "N/A"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Last Name</p>
                  <p className="font-semibold text-gray-900">{member.contact?.lastName || "N/A"}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Username</p>
                <p className="font-semibold text-gray-900">{member.profile?.nickname || "N/A"}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 font-semibold text-gray-900">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  {member.loginEmail}
                </div>
              </div>
              {member.contact?.phones?.[0] && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 font-semibold text-gray-900">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    {member.contact.phones[0]}
                  </div>
                </div>
              )}
            </div>
          </div>

          {uniqueAddresses.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full"></div>
                <h3 className="font-bold text-lg text-gray-800">Addresses</h3>
              </div>
              <div className="space-y-4">
                {uniqueAddresses.map((address) => (
                  <div
                    key={address._id}
                    className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-5 border border-orange-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <MapPin className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{address.addressLine}</p>
                        <p className="text-gray-700 font-medium">
                          {address.city}, {address.subdivision}
                        </p>
                        <p className="text-gray-600 font-medium">{address.postalCode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 w-full text-white py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105 flex items-center justify-center gap-3">
                <span className="text-lg font-semibold">Logout</span> 
                <span className="font-bold"><RiShutDownLine /></span> 
                
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
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 text-slate-100 hover:text-white hover:bg-red-700 cursor-pointer"
                >
                  <span>LogOut</span> <RiShutDownLine />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="mt-8 p-4 mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
          <h3 className="font-semibold text-sm text-gray-700 leading-relaxed">
            If you want to update your profile information <br />
            message <span className="text-blue-600 font-bold italic">support@uscartel.com</span>
          </h3>
        </div>
      </div>

      {/* Orders Section */}
      <OrdersList ordersList={ordersList} />
    </div>
  </div>
  );
};

export default ProfileClient;

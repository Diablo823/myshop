"use client";

import React, { useState } from "react";
import {
  Share,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Instagram,
  Share2,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Social media share URLs
const getSocialShareUrl = (platform: string, url: string, text?: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text || "Check this out!");

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case "instagram":
      // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
      return null;
    default:
      return null;
  }
};

interface ShareUrlButtonProps {
  url?: string;
  title?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
}

const ShareUrlButton2: React.FC<ShareUrlButtonProps> = ({
  url,
  title = "Share this page",
  buttonText = "Share",
  buttonVariant = "outline",
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Get current URL if not provided
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  // Check if Web Share API is supported
  const isWebShareSupported =
    typeof navigator !== "undefined" && navigator.share;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  // Native OS share function
  const handleNativeShare = async () => {
    if (isWebShareSupported) {
      try {
        await navigator.share({
          title: title,
          text: "Check this out!",
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled the share or an error occurred
        console.log("Share cancelled or failed:", err);
      }
    }
  };

  const handleSocialShare = (platform: string) => {
    if (platform === "instagram") {
      // Instagram doesn't support direct URL sharing
      copyToClipboard();
      toast({
        title: "URL Copied",
        description:
          "Instagram doesn't support direct link sharing. URL copied to clipboard - you can paste it in your Instagram post or story!",
      });
      return;
    }

    const shareUrl = getSocialShareUrl(platform, currentUrl, title);
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const socialPlatforms = [
    {
      name: "WhatsApp",
      key: "whatsapp",
      icon: FaWhatsapp,
      bgColor: "bg-green-500 hover:bg-green-600",
      textColor: "text-white",
    },
    {
      name: "Facebook",
      key: "facebook",
      icon: FaFacebookF,
      bgColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white",
    },
    {
      name: "X (Twitter)",
      key: "twitter",
      icon: FaXTwitter,
      bgColor: "bg-black hover:bg-gray-800",
      textColor: "text-white hover:text-slate-200",
    },
    {
      name: 'Telegram',
      key: 'telegram',
      icon: FaTelegram,
      bgColor: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200">
          <Share className="w-4 h-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share this product with your friends & family</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Native OS Share - Show first if supported */}
          {isWebShareSupported && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Share via your device
              </label>
              <Button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 h-12 bg-black hover:bg-gray-900 text-white"
              >
                <Share2 className="w-4 h-4" />
                Share with installed apps
              </Button>
            </div>
          )}

          {/* Copy URL Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Copy link</label>
            <div className="flex space-x-2">
              <Input value={currentUrl} readOnly className="flex-1" />
              <Button
                type="button"
                size="sm"
                className="px-3"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing - Show as fallback or additional options */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {isWebShareSupported
                ? "Or share directly"
                : "Share on social media"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.key}
                    variant="outline"
                    className={`flex items-center justify-center gap-2 h-12 ${platform.bgColor} ${platform.textColor} border-0 hover:scale-105 transition-transform`}
                    onClick={() => handleSocialShare(platform.key)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareUrlButton2;

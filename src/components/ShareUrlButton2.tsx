"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, Sparkles } from "lucide-react";
import { FaFacebookF, FaWhatsapp, FaTelegram } from "react-icons/fa";
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

const socialPlatforms = [
  {
    name: "WhatsApp",
    key: "whatsapp",
    icon: FaWhatsapp,
    gradient: "from-green-500 to-emerald-700",
    glow: "hover:shadow-green-300/60",
  },
  {
    name: "Facebook",
    key: "facebook",
    icon: FaFacebookF,
    gradient: "from-blue-500 to-blue-800",
    glow: "hover:shadow-blue-300/60",
  },
  {
    name: "X",
    key: "twitter",
    icon: FaXTwitter,
    gradient: "from-slate-500 to-slate-900",
    glow: "hover:shadow-slate-400/60",
  },
  {
    name: "Telegram",
    key: "telegram",
    icon: FaTelegram,
    gradient: "from-sky-400 to-sky-700",
    glow: "hover:shadow-sky-300/60",
  },
];

const ShareUrlButton2: React.FC<ShareUrlButtonProps> = ({
  url,
  title = "Share this product",
  buttonText = "Share",
  buttonVariant = "outline",
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const isWebShareSupported =
    typeof navigator !== "undefined" && !!navigator.share;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast({ title: "Copied!", description: "URL copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (isWebShareSupported) {
      try {
        await navigator.share({ title, text: "Check this out!", url: currentUrl });
      } catch (_) { }
    }
  };

  const handleSocialShare = (platform: string) => {
    setActiveBtn(platform);
    setTimeout(() => setActiveBtn(null), 400);
    if (platform === "instagram") {
      copyToClipboard();
      return;
    }
    const shareUrl = getSocialShareUrl(platform, currentUrl, title);
    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>

      {/* ── Trigger Button ── */}
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100 hover:text-violet-700"
        >
          <Share2 className="h-4 w-4 text-violet-500 transition-transform duration-300 group-hover:rotate-12" />
          <span>{buttonText}</span>
          {/* shimmer */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Button>
      </DialogTrigger>

      {/* ── Dialog ── */}
      <DialogContent
        className="
          w-[calc(100vw-1rem)] max-w-md p-0
          rounded-2xl border-0
          bg-white shadow-2xl shadow-slate-300/60
          overflow-hidden
        "
      >
        {/* ── Dark Gradient Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 px-6 pb-7 pt-7">
          {/* ambient blobs */}
          <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-600/25 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
          {/* subtle dot grid */}
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <DialogHeader className="relative z-10 text-left [&>*]:text-left">
            <DialogTitle asChild>
              <div className="flex items-center gap-3 text-left">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                  <Share2 className="h-4 w-4 text-violet-300" />
                </span>
                <div className="text-left">
                  <p className="text-base font-bold text-white tracking-tight">
                    Share
                  </p>
                  <p className="text-xs font-normal text-slate-400">
                    Share with your friends &amp; family
                  </p>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* ── Light Body ── */}
        <div className="space-y-5 bg-white p-4 sm:p-6">

          {/* Native Share */}
          {isWebShareSupported && (
            <button
              onClick={handleNativeShare}
              className="group relative w-full flex items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3.5 text-sm font-semibold text-violet-700 shadow-sm transition-all duration-200 hover:from-violet-100 hover:to-indigo-100 hover:shadow-md hover:shadow-violet-200/50 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4 text-violet-500" />
              Share via installed apps
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          )}

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Copy link
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition-all duration-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
              <Input
                value={currentUrl}
                readOnly
                className="flex-1 border-0 bg-transparent px-2 text-xs text-slate-500 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <button
                onClick={copyToClipboard}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 active:scale-90 ${copied
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                  : "bg-gradient-to-br from-violet-600 to-indigo-700 text-white hover:from-violet-500 hover:to-indigo-600 shadow-md shadow-violet-200"
                  }`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {isWebShareSupported ? "or share directly" : "share on"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* Social Platforms */}
          <div className="grid grid-cols-4 gap-2">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              const isActive = activeBtn === platform.key;
              return (
                <button
                  key={platform.key}
                  onClick={() => handleSocialShare(platform.key)}
                  className={`group flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive ? "scale-90" : "hover:-translate-y-1"
                    }`}
                >
                  <span
                    className={`
                      flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center
                      rounded-2xl bg-gradient-to-br ${platform.gradient}
                      shadow-md ${platform.glow}
                      ring-1 ring-black/10
                      transition-all duration-200 group-hover:shadow-xl
                    `}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors duration-200">
                    {platform.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-500">
            Links are safe and never stored
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareUrlButton2;

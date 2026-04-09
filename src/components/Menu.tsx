"use client";

import React, { useState, useEffect } from "react";
import { navLinksMenu } from "@/constants";
import { useRouter } from "next/navigation";
import {
  TextIndentIcon,
  TextOutdentIcon,
  House,
  ShoppingBagIcon,
  TagIcon,
  ShoppingCartIcon,
  UserIcon,
  InfoIcon,
  EnvelopeSimpleIcon,
  HandshakeIcon,
  ArrowCounterClockwiseIcon,
  ShieldCheckIcon,
  FileTextIcon,
  PackageIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavLinkItem = { label: string; route: string };

// ─── Icon map by route ────────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  "/": House,
  "/list?cat=all-products": ShoppingBagIcon,
  "/deals": TagIcon,
  "/cart": ShoppingCartIcon,
  "/profile": UserIcon,
  "/about": InfoIcon,
  "/contact": EnvelopeSimpleIcon,
  "/partnership": HandshakeIcon,
  "/returns": ArrowCounterClockwiseIcon,
  "/legal": ShieldCheckIcon,
  "/termsandconditions": FileTextIcon,
  "/shipping": PackageIcon,
};

// ─── Route groups ─────────────────────────────────────────────────────────────
const PRIMARY_ROUTES = new Set([
  "/",
  "/list?cat=all-products",
  "/deals",
  "/cart",
  "/profile",
  "/about",
  "/contact",
]);
const COMPANY_ROUTES = new Set(["/partnership"]);
const POLICY_ROUTES = new Set([
  "/returns",
  "/legal",
  "/termsandconditions",
  "/shipping",
]);

// ─── NavItem component ────────────────────────────────────────────────────────
interface NavItemProps {
  link: NavLinkItem;
  compact?: boolean;
  onClick: (route: string) => void;
}

const NavItem = ({ link, compact = false, onClick }: NavItemProps) => {
  const Icon = iconMap[link.route] ?? CaretRightIcon;

  return (
    <button
      onClick={() => onClick(link.route)}
      className={`group flex items-center gap-3 w-full rounded-xl px-3 transition-all duration-200
        hover:bg-gray-50 active:scale-[0.98] active:bg-gray-100
        ${compact ? "py-1.5" : "py-2.5"}`}
    >
      {/* Icon box */}
      <span
        className={`flex items-center justify-center rounded-lg shrink-0 transition-all duration-200
          ${compact
            ? "w-6 h-6 text-gray-400 group-hover:text-gray-600"
            : "w-9 h-9 bg-gray-100 text-gray-500 group-hover:bg-gray-900 group-hover:text-white shadow-sm"
          }`}
      >
        <Icon size={compact ? 13 : 16} weight={compact ? "regular" : "duotone"} />
      </span>

      {/* Label */}
      <span
        className={`flex-1 text-left font-medium transition-colors duration-200
          ${compact
            ? "text-xs text-gray-400 group-hover:text-gray-600"
            : "text-sm text-gray-700 group-hover:text-gray-900"
          }`}
      >
        {link.label}
      </span>

      {/* Arrow */}
      <CaretRightIcon
        size={11}
        weight="bold"
        className={`shrink-0 transition-all duration-200 group-hover:translate-x-0.5
          ${compact
            ? "text-gray-200 group-hover:text-gray-300"
            : "text-gray-300 group-hover:text-gray-500"
          }`}
      />
    </button>
  );
};

// ─── Menu component ───────────────────────────────────────────────────────────
const Menu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Scroll lock
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  // Click-outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (open && !target.closest(".menu-container")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLinkClick = (route: string) => {
    router.push(route);
    setOpen(false);
  };

  const primaryLinks = navLinksMenu.filter((l) => PRIMARY_ROUTES.has(l.route));
  const companyLinks = navLinksMenu.filter((l) => COMPANY_ROUTES.has(l.route));
  const policyLinks = navLinksMenu.filter((l) => POLICY_ROUTES.has(l.route));

  return (
    <>
      {/* ── Trigger icon ── */}
      <div className="menu-container relative z-30">
        <TextOutdentIcon
          size={22}
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer"
          weight="bold"
        />
      </div>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpen(false)}
      />

      {/* ── Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out z-50
          ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

          <div className="relative flex justify-between items-center px-5 py-5">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-white rounded-full" />
              <h2 className="text-white font-bold text-base tracking-tight">
                Menu
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Close menu"
            >
              <TextIndentIcon size={17} weight="bold" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Primary navigation */}
          <div className="px-3 pt-3 pb-1">
            {primaryLinks.map((link) => (
              <NavItem key={link.route} link={link} onClick={handleLinkClick} />
            ))}
          </div>

          {/* Company section */}
          {companyLinks.length > 0 && (
            <>
              <div className="mx-5 my-1 border-t border-gray-100" />
              <div className="px-3 pt-1 pb-1">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Company
                </p>
                {companyLinks.map((link) => (
                  <NavItem key={link.route} link={link} onClick={handleLinkClick} />
                ))}
              </div>
            </>
          )}

          {/* Policies section */}
          {policyLinks.length > 0 && (
            <>
              <div className="mx-5 my-1 border-t border-gray-100" />
              <div className="px-3 pt-1 pb-4">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Policies
                </p>
                {policyLinks.map((link) => (
                  <NavItem key={link.route} link={link} compact onClick={handleLinkClick} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 bg-gray-50/80 px-5 py-3.5">
          <p className="text-[11px] text-gray-400 text-center tracking-wide">
            © {new Date().getFullYear()} USC · All rights reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default Menu;
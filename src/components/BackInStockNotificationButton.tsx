"use client";

import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";
import { z } from "zod";
import { requiredString } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useState } from "react";

const formSchema = z.object({
  email: requiredString.email(),
});

type FormValues = z.infer<typeof formSchema>;

interface BackInStockNotificationButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

const BackInStockNotificationButton = ({
  product,
  selectedOptions,
  ...props
}: BackInStockNotificationButtonProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const mutation = useCreateBackInStockNotificationRequest();

  const onSubmit = async ({ email }: FormValues) => {
    mutation.mutate({
      email,
      itemUrl: window.location.origin + `/products/${product.slug}`,
      product,
      selectedOptions,
    });
  };

  const buttonClass = `
    flex items-center justify-center gap-2 font-bold text-white
    bg-gradient-to-r from-indigo-800 to-violet-600
    hover:from-indigo-700 hover:to-violet-500
    transition-all duration-300
  `;

  return (
    <>
      {/* ── DESKTOP ── */}
      <div className="hidden md:flex md:mt-6 md:pb-4">
        <Button
          {...props}
          onClick={() => setOpen(true)}
          className={`w-full h-12 text-sm rounded-2xl shadow-lg shadow-violet-300/40 ${buttonClass}`}
        >
          <MdOutlineNotificationsActive className="w-5 h-5 shrink-0" />
          Pre-order Now For Free
        </Button>
      </div>

      {/* ── MOBILE FIXED BOTTOM ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-1 py-1.5 z-20 rounded-t-2xl shadow-lg shadow-black">
        <div className="flex gap-1 max-w-screen-xl mx-auto items-center">

          {/* Left: Out of Stock badge */}
          <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 h-12 px-3 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
            <span className="text-sm font-black uppercase tracking-widest text-slate-400 leading-none">
              Out of
            </span>
            <span className="text-sm font-black uppercase tracking-[0.18rem] text-black leading-none">
              Stock
            </span>
          </div>

          {/* Right: Pre-order button */}
          <Button
            {...props}
            onClick={() => setOpen(true)}
            className={`flex-1 h-12 text-xs rounded-xl shadow-lg shadow-violet-300/40 ${buttonClass}`}
          >
            <MdOutlineNotificationsActive className="w-4 h-4 shrink-0" />
            Pre-order Now For Free
          </Button>

        </div>
      </div>


      <div className="md:hidden h-3" />

      {/* ── DIALOG ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            p-0 overflow-hidden rounded-3xl max-w-sm w-[96vw]
            bg-white border-0
            shadow-2xl shadow-violet-200/60
            [&>button]:text-indigo-300 [&>button]:hover:text-indigo-700
            [&>button]:hover:bg-indigo-50 [&>button]:rounded-xl
          "
        >
          {/* ── Gradient header (full section, same bg-white underneath = no gap) ── */}
          <div className="bg-gradient-to-br from-indigo-800 to-violet-600 px-6 pt-6 pb-8 relative overflow-hidden">

            {/* Soft light blobs for depth */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-violet-400/20 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 -left-4 w-24 h-16 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

            {/* Icon + Title */}
            <div className="relative flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <MdOutlineNotificationsActive className="text-white w-5 h-5" />
              </div>
              <DialogTitle className="text-white text-base font-bold tracking-tight">
                Pre-order Notification
              </DialogTitle>
            </div>

            {/* Description */}
            <DialogDescription className="relative text-indigo-200 text-xs leading-relaxed">
              This item isn&apos;t in stock yet. Leave your email and we&apos;ll
              notify you the moment it&apos;s ready to ship.
            </DialogDescription>
          </div>

          {/* Overlap card — pulls up over the gradient header */}
          <div className="-mt-2 mx-2 bg-white rounded-2xl shadow-md shadow-violet-100 px-3 pt-5 pb-2 space-y-4">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          className="
                            h-11 rounded-xl border-slate-200 bg-slate-50
                            text-slate-800 placeholder:text-slate-400 placeholder:text-xs text-sm
                            focus:ring-2 focus:ring-violet-400 focus:border-transparent
                            focus:bg-white transition-all
                          "
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />

                <LoadingButton
                  type="submit"
                  loading={mutation.isPending}
                  className={`w-full h-11 text-sm rounded-xl shadow-md shadow-violet-300/40 ${buttonClass}`}
                >
                  <FaClock className="shrink-0" />
                  Pre-Order Now
                </LoadingButton>
              </form>
            </Form>

            {mutation.isSuccess && (
              <div className="flex items-start gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl">
                <FaCheckCircle className="text-violet-500 mt-0.5 shrink-0 w-4 h-4" />
                <p className="text-indigo-900 text-xs font-medium leading-relaxed">
                  You&apos;re on the list! We&apos;ll notify you as soon as this
                  product arrives. Get ready to buy!
                </p>
              </div>
            )}
          </div>

          {/* Bottom padding inside the white bg */}
          <div className="h-4 bg-white" />

        </DialogContent>
      </Dialog>
    </>
  );
};

export default BackInStockNotificationButton;

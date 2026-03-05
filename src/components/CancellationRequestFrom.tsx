import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MdCancel } from "react-icons/md";


interface CancellationRequestFormProps {
  orderId: string;
  orderNumber: string;
}

export const CancellationRequestForm = ({ orderId, orderNumber }: CancellationRequestFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Predefined cancellation reasons
  const cancellationReasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Shipping takes too long",
    "Product no longer needed",
    "Wrong product ordered",
    "Financial reasons",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email to admin or create a cancellation request
      const response = await fetch("/api/cancellation-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderNumber,
          message: reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit cancellation request");
      }

      toast({
        title: "Request Submitted",
        description: "Your cancellation request has been submitted. Our team will contact you shortly.",
        action: <ToastAction altText="Close">Close</ToastAction>
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting request", error);

      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Close">Close</ToastAction>
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="
      h-10 px-5 rounded-xl font-bold text-sm text-white
      bg-gradient-to-r from-red-500 to-rose-600
      hover:from-red-600 hover:to-rose-700
      shadow-md shadow-red-200/50
      transition-all duration-300 flex items-center gap-2
    ">
          <MdCancel className="w-4 h-4" />
          Cancel Order
        </Button>
      </DialogTrigger>

      <DialogContent className="
    p-0 overflow-hidden rounded-3xl max-w-sm w-[94vw] border-0
    shadow-2xl shadow-red-200/40
    [&>button]:text-red-300 [&>button]:hover:text-red-600
    [&>button]:hover:bg-red-50 [&>button]:rounded-xl
  ">

        {/* ── Gradient Header ── */}
        <div className="bg-gradient-to-br from-red-500 to-rose-600 px-4 pt-6 pb-8 relative overflow-hidden">

          {/* Soft blobs */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-rose-400/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 -left-4 w-24 h-14 rounded-full bg-red-400/20 blur-2xl pointer-events-none" />

          {/* Icon + Title */}
          <div className="relative flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
              <MdCancel className="text-white w-5 h-5" />
            </div>
            <DialogTitle className="text-white text-base font-bold tracking-tight">
              Request Order Cancellation
            </DialogTitle>
          </div>

          <DialogDescription className="relative text-red-100 text-xs leading-relaxed space-y-1">
            <span className="block">
              Your order will be cancelled and your payment will be refunded shortly.
            </span>
            <span className="flex items-start gap-1.5 mt-2 bg-white/10 rounded-xl px-3 py-2 border border-white/15">
              <span className="text-yellow-300 mt-0.5 shrink-0">⚠</span>
              <span className="text-red-100/90">
                It may take a few business days for the refund to reflect in your account.
              </span>
            </span>
          </DialogDescription>
        </div>

        {/* ── Overlap card ── */}
        <div className="-mt-4 mx-4 bg-white rounded-2xl shadow-md shadow-red-100 px-3 pt-5 pb-3">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Reason Select */}
            <div className="space-y-1.5">
              <Label
                htmlFor="reason"
                className="text-xs font-semibold text-slate-500 uppercase tracking-widest"
              >
                Reason for Cancellation
              </Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger
                  id="reason"
                  className="
                w-full h-11 rounded-xl border-slate-200 bg-slate-50
                text-slate-700 text-sm
                focus:ring-2 focus:ring-red-400 focus:border-transparent
                focus:bg-white transition-all
              "
                >
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                  {cancellationReasons.map((cancelReason) => (
                    <SelectItem
                      key={cancelReason}
                      value={cancelReason}
                      className="text-sm rounded-xl cursor-pointer"
                    >
                      {cancelReason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
              flex-1 h-11 rounded-xl border border-slate-200
              bg-slate-50 hover:bg-slate-100
              text-slate-600 hover:text-slate-800
              font-semibold text-sm shadow-none
              transition-all duration-200
            "
              >
                Keep Order
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !reason}
                className="
              flex-1 h-11 rounded-xl font-bold text-sm text-white
              bg-gradient-to-r from-red-500 to-rose-600
              hover:from-red-600 hover:to-rose-700
              shadow-md shadow-red-200/50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 flex items-center justify-center gap-2
            "
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <MdCancel className="w-4 h-4 shrink-0" />
                    <span>Submit Request</span>
                  </>
                )}
              </Button>
            </div>

          </form>
        </div>

        {/* Bottom padding */}
        <div className="h-4 bg-white" />

      </DialogContent>
    </Dialog>


  );
};
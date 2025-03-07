import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Order Cancellation</DialogTitle>
          <DialogDescription>
            The cancellation will be done in a moment & your payment will be refunded. <br />
            NOTE: It will take some time for the cancellation to reflect to your account. 
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for cancellation
              </Label>
              <Select 
                value={reason} 
                onValueChange={setReason}
                required
              >
                <SelectTrigger id="reason" className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {cancellationReasons.map((cancelReason) => (
                    <SelectItem key={cancelReason} value={cancelReason}>
                      {cancelReason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !reason}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    
  );
};
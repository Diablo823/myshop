// back-in-stock.ts - Updated for Pages Router

import { BackInStockNotifcationRequestValues, createBackInStockNotificationRequest } from "@/wix-api/backInStockNotification";
import { useToast } from "./use-toast";
import { useMutation} from "@tanstack/react-query"
import { useWixClient } from "@/hooks/useWixClient"; // Use your existing hook

export function useCreateBackInStockNotificationRequest() {
    const { toast } = useToast();
    const wixClient = useWixClient(); // Get client from context

    return useMutation({
        mutationFn: (values: BackInStockNotifcationRequestValues) => 
            createBackInStockNotificationRequest(wixClient, values),
        onError(error) {
            console.error(error);
            
            const errorCode = (error as any)?.details?.applicationError?.code;
            
            switch (errorCode) {
                case "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS":
                    toast({
                        title: "You have already pre-ordered this product.",
                        description: "We will notify you when this product arrives. Be ready to buy!",
                        variant: "destructive",
                    });
                    break;
                    
                case "REQUEST_COLLECTION_DISABLED":
                    toast({
                        title: "Service temporarily unavailable",
                        description: "Back in stock notifications are currently disabled. Please check your Wix dashboard settings.",
                        variant: "destructive",
                    });
                    break;
                    
                default:
                    toast({
                        title: "Something went wrong",
                        description: "Your request could not be processed. Please try again later.",
                        variant: "destructive",
                    });
            }
        },
        onSuccess() {
            toast({
                title: "Pre-order successful!",
                description: "You have successfully pre-ordered this product. We will notify you when it arrives. Be ready to buy!",
                variant: "default",
            });
        }
    });
}
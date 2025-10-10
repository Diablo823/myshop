import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";
import { z } from "zod";
import { requiredString } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";
import { FaClock } from "react-icons/fa";

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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useCreateBackInStockNotificationRequest();

  const onSubmit = async ({email}: FormValues) => {
    mutation.mutate({
      email,
      itemUrl: window.location.origin + `/products/${product.slug}`,
      product,
      selectedOptions
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props} className="rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-gray-900 hover:from-gray-900  hover:to-yellow-500 duration-500 text-white transition-all shadow-lg"><span><FaClock /></span>Pre-order Now For Free</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
          You will be notified when this product arrives.
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-800 text-xs font-medium">
          Enter your email address below and we&apos;ll notify you when the product arrives.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} className="placeholder:text-xs" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={mutation.isPending} className="mt-4 h-8 bg-gradient-to-r from-blue-900 via-gray-600 to-gray-900 hover:from-gray-900 hover:via-gray-600 hover:to-blue-900  dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-100 dark:text-slate-200 text-xs font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-400">
              <span><FaClock /></span>Pre-order Now
            </LoadingButton>
          </form>
        </Form>
        {mutation.isSuccess && (
          <div className="mt-1 p-2 bg-green-100 text-sm rounded">
            Pre-order Successful, you will be notified when the product arrives, Be ready to buy!
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
};

export default BackInStockNotificationButton;

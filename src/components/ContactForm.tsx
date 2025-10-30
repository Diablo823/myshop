"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { Send, Mail, Phone, User, MessageSquare } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().nonempty({
    message: "First name is required",
  }),
  lastName: z.string().nonempty({
    message: "Last name is required",
  }),
  email: z.string().nonempty({
    message: "Email is required",
  }),
  countryCode: z.string({
    required_error: "Country code is required",
  }),
  phone: z.string().min(5, {
    message: "Phone number is required",
  }),
  messageTitle: z.string().min(5, {
    message: "Message title is required",
  }),
  message: z.string().min(10, {
    message: "Message is required",
  }),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      messageTitle: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit message");
      }

      reset();

      toast({
        title: "Message sent successfully!",
        description: "We've received your message and will get back to you soon.",
        action: <ToastAction altText="Close">Close</ToastAction>
      })
      
    } catch (error) {
      console.log(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem submitting your message.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1">
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-200/20 to-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 p-2 md:p-12">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-full border border-violet-200/50 mb-4">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-violet-700">Get in Touch</span>
            </div>
            <h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-3">
              Contact US Cartel
            </h2>
            <p className="text-slate-600 text-sm">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-violet-500" />
                  <span className="text-sm">First name</span>
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      {...field}
                      placeholder="Enter your first name" 
                      className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 placeholder:text-xs" 
                    />
                  )}
                />
                {errors.firstName && <p className="text-rose-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-2 text-sm">Last name</label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      {...field}
                      placeholder="Enter your last name" 
                      className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 placeholder:text-xs" 
                    />
                  )}
                />
                {errors.lastName && <p className="text-rose-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Email</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field}
                    type="email"
                    placeholder="Enter your email address" 
                    className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 placeholder:text-xs" 
                  />
                )}
              />
              {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone Fields */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[110px]">
                <label className="text-slate-700 font-semibold block mb-2 text-sm">Code</label>
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+91">+91</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.countryCode && <p className="text-rose-500 text-sm mt-1">{errors.countryCode.message}</p>}
              </div>

              <div className="flex-grow">
                <label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm">Phone number</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      {...field}
                      placeholder="Enter your phone number" 
                      className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 placeholder:text-xs" 
                    />
                  )}
                />
                {errors.phone && <p className="text-rose-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Message Title */}
            <div>
              <label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">Message title</span>
              </label>
              <Controller
                name="messageTitle"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field}
                    placeholder="What's this about?" 
                    className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 placeholder:text-xs" 
                  />
                )}
              />
              {errors.messageTitle && <p className="text-rose-500 text-sm mt-1">{errors.messageTitle.message}</p>}
            </div>

            {/* Message Textarea */}
            <div>
              <label className="text-slate-700 font-semibold block mb-2 text-sm">Your message</label>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Textarea 
                    {...field}
                    placeholder="Tell us more about your inquiry..." 
                    className="min-h-[140px] border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 resize-none placeholder:text-xs" 
                  />
                )}
              />
              {errors.message && <p className="text-rose-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* Submit Button */}
            <Button 
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting} 
              className="w-full h-14 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none rounded-xl group"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending message...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Message
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
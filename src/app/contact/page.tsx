import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Clock, Instagram, Facebook, Twitter, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaPinterest } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import { socialIcons } from '@/constants';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16 xl:px-32">
      {/* Hero Section */}
      <div className="relative h-64 md:h-[24rem]">
        <Image
          src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/aboutthumbnail.png?updatedAt=1737916330178"
          alt="Contact Hero"
          fill
          className="w-full h-full object-cover opacity-100 rounded-3xl"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">At US Cartel</h2>
          <p className="text-gray-600">
            We're always here to help! Whether you have a question about an order, need more details about our products, 
            or just want to say hello, feel free to reach out.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Email Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Mail className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-gray-600 mb-2">General Inquiries:</p>
                <p className="text-blue-600">hello@uscartel.com</p>
                <p className="text-sm text-gray-600 mt-2 mb-2">Support:</p>
                <p className="text-blue-600">support@uscartel.com</p>
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <MapPin className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Address</h3>
                <p className="text-gray-600">
                  Eramalloor, Alappuzha,<br />
                  Kerala, India
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support Hours Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Support Hours</h3>
                <p className="text-gray-600">
                  We provide <span className="font-semibold">24/7 customer support</span>,<br />
                  so feel free to contact us anytime!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Section */}
        <div className="text-center mb-12">
          <h2 className="text-xl md:texr-2xl font-bold mb-6">Follow Us on Social Media</h2>
          <div className="flex justify-center space-x-6">
            {socialIcons.map((social) => (
              <Link href={social.route} key={social.id}>
              <social.icon size={28} className="hover:text-blue-800 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {/* <AccordionItem value="item-1">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionContent>
                You can track your order by clicking the tracking link in your shipping confirmation email or by logging into your account on our website.
              </AccordionContent>
            </AccordionItem> */}
            <AccordionItem value="item-2">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 14-day return policy for all unused items in their original packaging. Please contact our support team support@uscartel.com to initiate a return.{" "}
                <Link href="/returns" className='text-blue-600'>click here to see return policies</Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How long does shipping take?</AccordionTrigger>
              <AccordionContent>
                Shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Do you offer international shipping?</AccordionTrigger>
              <AccordionContent>
                We are currently only shipping to India and are working on expanding our business to other countries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards, and various digital payment methods like Google Pay, Paytm, PhonePe etc. All transactions are secure and encrypted.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className='mt-8' id='con'>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
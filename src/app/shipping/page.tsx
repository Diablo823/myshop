'use client';

import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ShippingPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden">
           <Image 
          src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/aboutthumbnail.png?updatedAt=1737916330178"
          alt="Shipping Policy Header" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-4">Shipping Policy</h1>
            </div>
          </div>
          <p className="text-gray-500 text-center italic">Last Updated: November 14, 2025</p>
        </div>

        {/* Introduction */}
        <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
            <Image 
              src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/shipping.avif?updatedAt=1741498760380" 
              alt="Shipping Service" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-sm md:text-lg">
              At <strong>US Cartel</strong>, we aim to provide you with a seamless shopping experience from the 
              moment you place an order until it reaches your doorstep. Please read our Shipping Policy 
              below to understand how we handle order processing, shipping methods, and delivery timelines.
            </p>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-16">
          {/* Order Processing */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image 
                src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/orderprocessing.jpg?updatedAt=1741499002126" 
                alt="Order Processing" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-xl font-bold mb-4">1. Order Processing</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Processing Time:</strong> All orders are processed on the same day
                  after your order is placed. Please note that processing times may be slightly longer 
                  during peak periods or promotional events.
                </li>
                <li>
                  <strong>Order Confirmation:</strong> Once your order is confirmed, you will receive an email 
                  notification with your order details.
                </li>
                <li>
                  <strong>Order Tracking:</strong> Once your order is dispatched, you will receive an email 
                  notification with your order tracking number with the name of the respective courier service provider. You can use this email to track the progress of your order on their platform.
                </li>
              </ul>
            </div>
          </section>

          {/* Shipping Methods & Delivery */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image 
                src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/shipping%20methods.jpg?updatedAt=1741499100353" 
                alt="Shipping Methods" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-xl font-bold mb-4">2. Shipping Methods & Delivery</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Domestic Shipping:</strong> We currently ship within India. Delivery times vary based on your location:
                  <ul className="list-disc pl-8 mt-2 space-y-1">
                    <li><strong>Metro Cities:</strong> 3-5 business days</li>
                    <li><strong>Tier 2 Cities & Smaller Towns:</strong> 5-9 business days</li>
                  </ul>
                </li>
                <li>
                  <strong>International Shipping:</strong> At this time, international shipping is not available. 
                  We are focusing on building a strong domestic presence, but international options may be 
                  considered in the future.
                </li>
                <li>
                  <strong>Shipping Carriers:</strong> We primarily choose IndiaPost to ship your orders to ensure reliable 
                  and timely delivery. Your orders will be shipped via SpeedPost.
                </li>
                <li>
                  <strong>Other Carriers:</strong> We will also choose other carriers to ship your orders in certain cases. We choose IndiaPost over other carriers because we saw many people complaining on social medias about delayed deliveries and lost packages when shipped via other carriers. 
                </li>
              </ul>
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image 
                src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/shipping%20cost.jpg?updatedAt=1741499202207" 
                alt="Shipping Costs" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-xl font-bold mb-4">3. Shipping Costs</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Shipping Fees:</strong> Shipping fees are calculated at checkout based on your 
                  location and the weight/dimensions of your order. Any applicable shipping charges will 
                  be clearly indicated before you complete your purchase.
                </li>
                <li>
                  <strong>Free Shipping:</strong> We may offer free shipping promotions from time to time. 
                  Any such promotions will be highlighted on our website.
                </li>
              </ul>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image 
                src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/track%20order.jpg?updatedAt=1741499311694" 
                alt="Order Tracking" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-xl font-bold mb-4">4. Order Tracking</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Tracking Your Order:</strong> Once your order is shipped, you will receive a 
                  tracking number via email. You can use this tracking number on the carrier's website 
                  to monitor your shipment's progress.
                </li>
              </ul>
            </div>
          </section>

          {/* Delays & Issues */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image 
                src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/shipping%20delay.avif?updatedAt=1741499401208" 
                alt="Shipping Delays" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-xl font-bold mb-4">5. Delays & Issues</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Shipping Delays:</strong> While we strive to meet the estimated delivery times, 
                  delays may occur due to unforeseen circumstances such as weather conditions, courier issues, 
                  or public holidays. If your order is delayed, we will update you as soon as possible.
                </li>
                <li>
                  <strong>Missing or Damaged Orders:</strong> If you receive a damaged product or your order 
                  is missing items, please contact us immediately at support@uscartel.com with your order details, 
                  and we will work to resolve the issue promptly.
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image 
                src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/contactus.jpg?updatedAt=1740895262906" 
                alt="Contact Us" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-xl font-bold mb-4">6. Contact Information</h2>
              <p className="mb-2 text-sm">
                If you have any questions or concerns about our shipping policy, please get in touch with us:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Email (General Inquiries):</strong> hello@uscartel.com
                </li>
                <li>
                  <strong>Email (Support):</strong> support@uscartel.com
                </li>
                <li>
                  <strong>Address:</strong> Eramalloor, Alappuzha, Kerala, India
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Final Note */}
        <div className="my-16 text-center">
          <p className="text-sm md:text-lg">
            By placing an order with <strong>US Cartel</strong>, you agree to the terms outlined in this 
            Shipping Policy. We appreciate your trust in us and are committed to delivering your products 
            with care and efficiency.
          </p>
        </div>

        {/* Accordion FAQ Section */}
        <div className="mt-16 bg-gray-50 p-6 rounded-xl">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-8">Shipping Policy FAQ</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>1. Order Processing</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Processing Time:</strong> All orders are processed on the same day 
                    after your order is placed. <br /><strong>Rare Case: </strong> Please note that processing times may be slightly longer 
                    during peak periods or promotional events.
                  </li>
                  <li>
                    <strong>Order Confirmation:</strong> Once your order is confirmed, you will receive an email 
                    notification with your order details. You can use this email to track the progress of your order.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Shipping Methods & Delivery</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Domestic Shipping:</strong> We currently ship within India. Delivery times vary based on your location:
                    <ul className="list-disc pl-8 mt-2 space-y-1">
                      <li><strong>Metro Cities:</strong> 3-5 business days</li>
                      <li><strong>Tier 2 Cities & Smaller Towns:</strong> 5-9 business days</li>
                    </ul>
                  </li>
                  <li>
                    <strong>International Shipping:</strong> At this time, international shipping is not available. 
                    We are focusing on building a strong domestic presence, but international options may be 
                    considered in the future.
                  </li>
                  <li>
                    <strong>Shipping Carriers:</strong> We primarily choose IndiaPost to ship your orders to ensure reliable and timely delivery. Your orders will be shipped via SpeedPost.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. Shipping Costs</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Shipping Fees:</strong> Shipping fees are calculated at checkout based on your 
                    location and the weight/dimensions of your order. Any applicable shipping charges will 
                    be clearly indicated before you complete your purchase.
                  </li>
                  <li>
                    <strong>Free Shipping:</strong> We may offer free shipping promotions from time to time. 
                    Any such promotions will be highlighted on our website.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>4. Order Tracking</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Tracking Your Order:</strong> Once your order is shipped, you will receive a 
                    tracking number via email. You can use this tracking number on the carrier's website 
                    to monitor your shipment's progress.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>5. Delays & Issues</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Shipping Delays:</strong> While we strive to meet the estimated delivery times, 
                    delays may occur due to unforeseen circumstances such as weather conditions, courier issues, 
                    or public holidays. If your order is delayed, we will update you as soon as possible.
                  </li>
                  <li>
                    <strong>Missing or Damaged Orders:</strong> If you receive a damaged product or your order 
                    is missing items, please contact us immediately at support@uscartel.com with your order details, 
                    and we will work to resolve the issue promptly.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>6. Contact Information</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  If you have any questions or concerns about our shipping policy, please get in touch with us:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Email (General Inquiries):</strong> hello@uscartel.com
                  </li>
                  <li>
                    <strong>Email (Support):</strong> support@uscartel.com
                  </li>
                  <li>
                    <strong>Address:</strong> Eramalloor, Alappuzha, Kerala, India
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
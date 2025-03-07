import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-48 bg-black">
        <img
          src="/api/placeholder/1920/400"
          alt="Terms Header"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Terms & Conditions</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12">
        <Card className="max-w-4xl mx-auto mb-12">
          <CardContent className="p-6 md:p-8">
            <div className="prose max-w-none">
              {/* Last Updated */}
              <p className="text-gray-600 mb-8">Last Updated: 06/02/2025</p>

              {/* Welcome Section */}
              <div className="mb-8">
                <p className="text-gray-700">
                  Welcome to US Cartel (the "Site"). By accessing or using uscartel.com, you agree to be bound by these Terms & Conditions ("Terms"). Please read them carefully before using our website. If you do not agree with any part of these Terms, please refrain from using our Site.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing or using uscartel.com, you confirm that you are at least 18 years old or have the consent of a parent or guardian, and agree to be bound by these Terms, as well as any additional terms and conditions that may apply to specific sections of the Site or to products and services available through the Site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">2. Use of the Website</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Permitted Use:</span> You are granted a limited, non-exclusive, non-transferable right to access and use the Site for personal, non-commercial purposes.</li>
                  <li><span className="font-semibold">Prohibited Use:</span> You agree not to use the Site for any unlawful purpose, or in any way that could damage, disable, overburden, or impair the Site or interfere with any other party's use of the Site.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">3. Account & Authentication</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Guest Purchases:</span> Even guest users can place orders, as our middleware assigns a visitor token to facilitate transactions.</li>
                  <li><span className="font-semibold">Account Creation:</span> If you choose to create an account, you are responsible for maintaining the confidentiality of your login information and for all activities that occur under your account.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">4. Ordering & Payments</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Product Information:</span> We strive to provide accurate information about our products, including descriptions and pricing. However, we do not guarantee that all product details are error-free, complete, or current.</li>
                  <li><span className="font-semibold">Payment Gateway:</span> All payments on the Site are processed securely through Razorpay. By placing an order, you agree to the terms and conditions of the payment processor.</li>
                  <li><span className="font-semibold">Order Confirmation:</span> Once an order is placed, you will receive an order confirmation via email. Please ensure your contact information is accurate.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">5. Shipping & Returns</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Shipping:</span> Orders are shipped to the address provided by you at the time of purchase. Delivery times may vary.</li>
                  <li><span className="font-semibold">Returns & Refunds:</span> For any return or refund requests, please contact our support team at support@uscartel.com with your order details. Specific return policies may vary based on the product category.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Content Ownership:</span> All content on uscartel.com, including text, graphics, logos, images, and software, is the property of US Cartel or its licensors and is protected by applicable intellectual property laws.</li>
                  <li><span className="font-semibold">Limited License:</span> You are granted a limited license to access and make personal use of the Site, but you are not allowed to download or modify any portion of the content without express written consent from US Cartel.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">7. Third-Party Integrations</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Wix Headless CMS:</span> Our backend and authentication are managed via Wix Headless CMS. Your interactions with this service are subject to Wix's own terms and policies.</li>
                  <li><span className="font-semibold">Razorpay:</span> Payment processing is handled by Razorpay. Your use of their services is governed by Razorpay's terms and conditions.</li>
                  <li><span className="font-semibold">Future Integrations:</span> We may integrate additional third-party services (such as review apps) in the future. Any such services will be subject to their own terms and conditions.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">8. Data Protection & Privacy</h2>
                <p className="text-gray-700">
                  Your privacy is important to us. Our collection, use, and storage of personal data are described in our Legal & Privacy page. By using the Site, you consent to the data practices described therein.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">9. Disclaimers & Limitation of Liability</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Disclaimer:</span> The Site and all information, products, and services provided on the Site are provided "as is" without any warranties of any kind. We do not warrant that the Site will be error-free, secure, or continuously available.</li>
                  <li><span className="font-semibold">Limitation of Liability:</span> In no event shall US Cartel, its owners, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use or inability to use the Site or any products purchased through the Site.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify, defend, and hold harmless US Cartel and its affiliates, directors, officers, employees, and agents from and against any claims, liabilities, damages, losses, or expenses arising from your use of the Site or violation of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">11. Modifications to Terms</h2>
                <p className="text-gray-700">
                  US Cartel reserves the right to modify or update these Terms at any time without prior notice. Changes will be effective immediately upon posting on the Site. Your continued use of the Site following any changes constitutes acceptance of those changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which US Cartel operates. Any disputes arising from these Terms or the use of the Site will be resolved in the appropriate courts of that jurisdiction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate your access to the Site at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the operation of the Site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
                <p className="text-gray-700 mb-4">If you have any questions or concerns about these Terms, please contact us at:</p>
                <ul className="list-none space-y-2 text-gray-700">
                  <li>Email (General Inquiries): uscartelofficial@gmail.com</li>
                  <li>Email (Support): support@uscartel.com</li>
                  <li>Address: Eramalloor, Alappuzha, Kerala, India</li>
                </ul>
              </section>

              <p className="text-gray-700 mt-8">
                By using uscartel.com, you acknowledge that you have read, understood, and agree to these Terms & Conditions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Common Questions</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How are my payments processed and secured?</AccordionTrigger>
              <AccordionContent>
                All payments are processed securely through Razorpay, our trusted payment gateway. Your payment information is encrypted and protected according to industry standards. We never store your sensitive payment details on our servers. After successful payment, you'll receive an order confirmation email with transaction details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What are my rights regarding my personal data?</AccordionTrigger>
              <AccordionContent>
                We take your privacy seriously. Your personal data is protected and managed through Wix Headless CMS with industry-standard security measures. You have the right to access, modify, or request deletion of your personal data. We only collect and use data as described in our Privacy Policy, and we never share your information with unauthorized third parties.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What happens if I receive a defective product?</AccordionTrigger>
              <AccordionContent>
                If you receive a defective product, please contact our support team at support@uscartel.com immediately with your order details and a description of the issue. We handle each case individually to ensure customer satisfaction. We may request photos or additional information to process your claim efficiently. Valid claims will be processed promptly with either a replacement or refund.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I modify or cancel my order after placing it?</AccordionTrigger>
              <AccordionContent>
                Order modifications or cancellations should be requested as soon as possible by contacting our support team. While we'll try to accommodate your request, please note that once an order enters the processing stage, modifications may not be possible. In such cases, you may need to wait for the order to arrive and then initiate a return process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What are the terms for using US Cartel's content?</AccordionTrigger>
              <AccordionContent>
                All content on uscartel.com (including text, images, logos, and designs) is protected by intellectual property laws and belongs to US Cartel or its licensors. While you can browse and purchase from our site, you cannot download, modify, or use our content for any commercial purpose without explicit written permission from US Cartel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
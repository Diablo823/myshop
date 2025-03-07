import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const LegalPrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-48 bg-black">
        <img
          src="/api/placeholder/1920/400"
          alt="Legal Header"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Legal & Privacy</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="prose max-w-none">
              {/* Last Updated */}
              <p className="text-gray-600 mb-8">Last Updated: 06/02/2025</p>

              {/* Welcome Section */}
              <div className="mb-8">
                <p className="text-gray-700">
                  Welcome to US Cartel. This page explains how we collect, use, and protect your information when you visit and use uscartel.com. By using our website, you agree to the practices described here. If you have any questions, please contact us via our Contact Page.
                </p>
              </div>

              {/* Sections */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-gray-700">
                  US Cartel is a startup brand dedicated to offering quality fashion and beauty products. Although we are in the early stages of our journey, we are committed to protecting your personal data and ensuring a safe, trustworthy experience on our site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">2. Data Collection & Use</h2>
                <p className="text-gray-700 mb-4">
                  When you interact with uscartel.com, we may collect the following personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <span className="font-semibold">Personal Information:</span> Name, email address, phone number, and shipping addresses provided when placing orders.
                  </li>
                  <li>
                    <span className="font-semibold">Visitor Information:</span> We also collect tokens using our cookies.set() function for refresh tokens and visitor tokens, allowing even guest users to place orders.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">3. Cookies & Tokens</h2>
                <p className="text-gray-700 mb-4">Our website uses cookies to enhance your experience and manage authentication. Specifically:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <span className="font-semibold">Refresh Token & Visitor Token Cookies:</span> We use cookies to store a refresh token and a visitor token. These cookies are essential for maintaining your session and ensuring a smooth shopping experience.
                  </li>
                  <li>
                    <span className="font-semibold">Cookie Usage:</span> Although we use basic cookie functions (e.g., cookies.set()), our primary purpose is to improve functionality and security, not for analytics or advertising.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">4. Third-Party Integrations</h2>
                <p className="text-gray-700 mb-4">Currently, our key third-party integrations include:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Wix Headless CMS: Handles backend operations and authentication.</li>
                  <li>Razorpay: Processes payments securely.</li>
                  <li>Upcoming Review App Integration: We plan to integrate a review application via its API.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">5. Data Protection</h2>
                <p className="text-gray-700">
                  While we are not yet a formally registered company, we take data protection seriously. Your personal information is safeguarded on our website and managed by Wix, which implements security measures to protect your data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">6. Terms & Conditions</h2>
                <div className="space-y-4 text-gray-700">
                  <p className="font-semibold">By accessing or using uscartel.com, you agree to the following terms:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><span className="font-semibold">Use of Website:</span> You agree to use our website for lawful purposes only.</li>
                    <li><span className="font-semibold">Ordering & Payments:</span> All orders are processed through Razorpay.</li>
                    <li><span className="font-semibold">Content & Reviews:</span> Any submitted content becomes part of the website's content.</li>
                    <li><span className="font-semibold">Disclaimers & Liability:</span> We strive for accuracy but cannot guarantee it.</li>
                    <li><span className="font-semibold">Modifications:</span> We reserve the right to update this policy at any time.</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
                <p className="text-gray-700 mb-4">If you have any questions or concerns about this policy or our practices, please feel free to reach out:</p>
                <ul className="list-none space-y-2 text-gray-700">
                  <li>Email (General Inquiries): uscartelofficial@gmail.com</li>
                  <li>Email (Support): support@uscartel.com</li>
                  <li>Physical Address: Eramalloor, Alappuzha, Kerala, India</li>
                </ul>
              </section>

              {/* Footer Note */}
              <p className="text-gray-700 mt-8">
                By using uscartel.com, you acknowledge that you have read and understood this Legal & Privacy page, and you agree to the collection and use of your information as described herein.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalPrivacyPage;
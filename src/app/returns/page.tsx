"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export default function ReturnAndRefundPolicy() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setModalOpen(true);

    //prevent scrolling when moodal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage("");

    //enable scrolling when modal is closed
    document.body.style.overflow = "auto";
  };

  const imageSections = [
    {
      id: "intro",
      url: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/handshake.jpg?updatedAt=1740893966414",
      alt: "Customer Satisfaction",
    },
    {
      id: "eligibility",
      url: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/return.webp?updatedAt=1740894302621",
      alt: "Eligibility for Returns",
    },
    {
      id: "timeframe",
      url: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/hourglass.jpg?updatedAt=1740894460892",
      alt: "Return Request Timeframe",
    },
    {
      id: "return-process",
      url: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/refundprocess.jpeg?updatedAt=1740895104804",
      alt: "Return Process",
    },
    {
      id: "refund-process",
      url: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/returnprocess.webp?updatedAt=1740894817777",
      alt: "Refund Process",
    },
    {
      id: "policy-info",
      url: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/returnpolicy.webp?updatedAt=1740894964972",
      alt: "Policy Information",
    },
    {
      id: "contact-us",
      url: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/contactus.jpg?updatedAt=1740895262906",
      alt: "Contact Us",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Image modal */}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl max-h-screen w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <FaTimes size={24} />
            </button>
            {/* Modal image container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={modalImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden">
            <Image
              src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/aboutthumbnail.png?updatedAt=1737916330178"
              alt="Return Policy Header"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
                Return and Refund Policy
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-center italic">
            Last Updated: {currentDate}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
            <Image
              src={imageSections[0].url}
              alt={imageSections[0].alt}
              fill
              className="object-cover cursor-pointer"
              onClick={() => openModal(imageSections[0].url)}
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-sm md:text-lg">
              Thank you for shopping with <strong>US Cartel</strong>. We are
              committed to ensuring your complete satisfaction with our
              products. If you are not entirely happy with your purchase, please
              review our return and refund guidelines below.
            </p>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-16">
          {/* Eligibility for Returns */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={imageSections[1].url}
                alt={imageSections[1].alt}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openModal(imageSections[1].url)}
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-2xl font-bold mb-4">
                1. Eligibility for Returns
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Defective or Damaged Products:</strong> If you receive
                  a product that is defective or damaged, you may request a
                  return or refund.
                </li>
                <li>
                  <strong>Not as Described:</strong> If the product does not
                  match the description on our website, you are eligible for a
                  return or refund.
                </li>
                <li>
                  <strong>General Returns:</strong> For reasons other than
                  defects or inaccuracies, returns will be accepted only if the
                  product is in its original, unused condition with all original
                  tags and packaging intact.
                </li>
              </ul>
            </div>
          </section>

          {/* Return Request Timeframe */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={imageSections[2].url}
                alt={imageSections[1].alt}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openModal(imageSections[2].url)}
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-2xl font-bold mb-4">
                2. Return Request Timeframe
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>14-Day Window:</strong> You can request a return
                  within 14 days from the date of delivery.
                </li>
                <li>
                  <strong>Late Returns:</strong> Requests received after 30 days
                  may not be eligible for a refund or exchange.
                </li>
              </ul>
            </div>
          </section>

          {/* Return Process */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={imageSections[3].url}
                alt={imageSections[3].alt}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openModal(imageSections[3].url)}
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-2xl font-bold mb-4">
                3. Return Process
              </h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>
                  <strong>Initiate a Return:</strong> Contact our support team
                  at support@uscartel.com with your order number and a brief
                  explanation of your reason for return.
                </li>
                <li>
                  <strong>Return Authorization:</strong> Once your request is
                  reviewed, we will provide you with instructions and a return
                  authorization, if applicable.
                </li>
                <li>
                  <strong>Shipping the Product:</strong> Please securely package
                  the item and ship it to the address provided in our return
                  instructions. Customers are generally responsible for return
                  shipping costs unless the return is due to our error (e.g.,
                  defective or misdescribed product).
                </li>
              </ol>
            </div>
          </section>

          {/* Refund Process */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={imageSections[4].url}
                alt={imageSections[4].alt}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openModal(imageSections[4].url)}
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-2xl font-bold mb-4">
                4. Refund Process
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Inspection:</strong> Upon receiving your return, we
                  will inspect the item to ensure it meets the return criteria.
                </li>
                <li>
                  <strong>Approval and Refund:</strong> Once approved, a refund
                  will be processed to the original payment method. Please allow
                  up to 10 business days for the refund to be reflected in your
                  account.
                </li>
                <li>
                  <strong>Partial Refunds:</strong> In cases where the product
                  is returned in a condition that is not as originally received,
                  or if the return is initiated outside the eligible timeframe,
                  a partial refund may be granted at our discretion.
                </li>
              </ul>
            </div>
          </section>

          {/* Other Policies */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={imageSections[5].url}
                alt={imageSections[5].alt}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openModal(imageSections[5].url)}
              />
            </div>
            <div className="md:w-2/3 space-y-6">
              <div>
                <h2 className="text-lg md:text-2xl font-bold mb-2">
                  5. Exchanges
                </h2>
                <p className="text-sm">
                  At this time, we do not offer direct exchanges. If you wish to
                  exchange a product, please initiate a return for a refund and
                  then place a new order for the desired item.
                </p>
              </div>

              <div>
                <h2 className="text-lg md:text-2xl font-bold mb-2">
                  6. Non-Returnable Items
                </h2>
                <p className="text-sm">
                  Certain items, such as perishable goods, intimate or sanitary
                  products, or items marked as non-returnable at the time of
                  purchase, are not eligible for return. Please review product
                  descriptions carefully before making your purchase.
                </p>
              </div>

              <div>
                <h2 className="text-lg md:text-2xl font-bold mb-2">
                  7. Modifications to This Policy
                </h2>
                <p className="text-sm">
                  <strong>US Cartel</strong> reserves the right to update or
                  modify this Return and Refund Policy at any time without prior
                  notice. Any changes will be posted on this page, and the
                  revised policy will be effective immediately upon posting.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Us */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={imageSections[6].url}
                alt={imageSections[6].alt}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openModal(imageSections[6].url)}
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg md:text-2xl font-bold mb-4">
                8. Contact Us
              </h2>
              <p className="mb-2 text-sm">
                If you have any questions about our Return and Refund Policy or
                need further assistance, please reach out to us:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Email (General Inquiries):</strong>{" "}
                  uscartelofficial@gmail.com
                </li>
                <li>
                  <strong>Email (Support):</strong> support@uscartel.com
                </li>
                <li>
                  <strong>Address:</strong> Eramalloor, Alappuzha, Kerala, India
                </li>
                <li className="text-blue-600">
                  <Link href="/contact">
                  <strong>Send Direct Message:</strong> US Cartel Contact Page
                  </Link>
                </li>
                
              </ul>
            </div>
          </section>
        </div>

        {/* Final Note */}
        <div className="my-16 text-center">
          <p className="text-sm md:text-lg">
            By shopping with <strong>US Cartel</strong>, you agree to the terms
            outlined in this Return and Refund Policy. We appreciate your
            business and are here to ensure your experience is a positive one.
          </p>
        </div>

        {/* Accordion FAQ Section */}
        <div className="mt-16 bg-gray-50 p-6 rounded-xl">
          <h2 className="text-lg md:text-2xl font-bold text-center mb-8">
            Return & Refund Policy FAQ
          </h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>1. Eligibility for Returns</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Defective or Damaged Products:</strong> If you
                    receive a product that is defective or damaged, you may
                    request a return or refund.
                  </li>
                  <li>
                    <strong>Not as Described:</strong> If the product does not
                    match the description on our website, you are eligible for a
                    return or refund.
                  </li>
                  <li>
                    <strong>General Returns:</strong> For reasons other than
                    defects or inaccuracies, returns will be accepted only if
                    the product is in its original, unused condition with all
                    original tags and packaging intact.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Return Request Timeframe</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>14-Day Window:</strong> You can request a return
                    within 14 days from the date of delivery.
                  </li>
                  <li>
                    <strong>Late Returns:</strong> Requests received after 30
                    days may not be eligible for a refund or exchange.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. Return Process</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Initiate a Return:</strong> Contact our support team
                    at support@uscartel.com with your order number and a brief
                    explanation of your reason for return.
                  </li>
                  <li>
                    <strong>Return Authorization:</strong> Once your request is
                    reviewed, we will provide you with instructions and a return
                    authorization, if applicable.
                  </li>
                  <li>
                    <strong>Shipping the Product:</strong> Please securely
                    package the item and ship it to the address provided in our
                    return instructions. Customers are generally responsible for
                    return shipping costs unless the return is due to our error
                    (e.g., defective or misdescribed product).
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>4. Refund Process</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Inspection:</strong> Upon receiving your return, we
                    will inspect the item to ensure it meets the return
                    criteria.
                  </li>
                  <li>
                    <strong>Approval and Refund:</strong> Once approved, a
                    refund will be processed to the original payment method.
                    Please allow up to 10 business days for the refund to be
                    reflected in your account.
                  </li>
                  <li>
                    <strong>Partial Refunds:</strong> In cases where the product
                    is returned in a condition that is not as originally
                    received, or if the return is initiated outside the eligible
                    timeframe, a partial refund may be granted at our
                    discretion.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>5. Exchanges</AccordionTrigger>
              <AccordionContent>
                <p>
                  At this time, we do not offer direct exchanges. If you wish to
                  exchange a product, please initiate a return for a refund and
                  then place a new order for the desired item.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>6. Non-Returnable Items</AccordionTrigger>
              <AccordionContent>
                <p>
                  Certain items, such as perishable goods, intimate or sanitary
                  products, or items marked as non-returnable at the time of
                  purchase, are not eligible for return. Please review product
                  descriptions carefully before making your purchase.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>
                7. Modifications to This Policy
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  <strong>US Cartel</strong> reserves the right to update or
                  modify this Return and Refund Policy at any time without prior
                  notice. Any changes will be posted on this page, and the
                  revised policy will be effective immediately upon posting.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>8. Contact Us</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  If you have any questions about our Return and Refund Policy
                  or need further assistance, please reach out to us:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Email (General Inquiries):</strong>{" "}
                    uscartelofficial@gmail.com
                  </li>
                  <li>
                    <strong>Email (Support):</strong> support@uscartel.com
                  </li>
                  <li>
                    <strong>Address:</strong> Eramalloor, Alappuzha, Kerala,
                    India
                  </li>
                  <li className="text-blue-600">
                    <Link href="/contact">
                      <strong>Send Direct Message:</strong> US Cartel Contact
                      Page
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold mb-5 text-center w-64 ">
            Type your problems with the product here along with the order
            number. We'll get back to you within 3 hours.
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

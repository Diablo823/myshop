import Image from "next/image";
import {
  Home,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 xl:px-32 bg-white text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-64 md:h-[24rem] w-full">
        <Image
          src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/aboutthumbnail.png?updatedAt=1737916330178"
          alt="US Cartel Brand Background"
          fill
          className="object-cover rounded-2xl"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-black">
            About US Cartel
            </h1> 
        </div> */}
      </div>

      {/* Content Sections */}
      <div className="container mx-auto py-12 max-w-4xl space-y-12">
        {/* Story Behind the Name */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            The Story Behind the Name
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <Image
              src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/sloganlogo2.png?updatedAt=1737915018666"
              alt="US Cartel Inspiration"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
            <div>
              <p className="text-sm md:text-lg leading-relaxed mb-4">
                US Cartel wasn't just another random brand name, it came from an
                unexpected moment of inspiration. While searching for the
                perfect name, everything either lacked impact or didn't have an
                available ".com" domain.
              </p>
              <p className="text-sm md:text-lg leading-relaxed mb-4">
                Then, while watching <em>Call of Duty: Modern Warfare 2</em>, a
                scene caught my attention where Captain Price and sergeant Gaz goes for a mission to find and kill the terrorists who supplies missiles to Hassan Zyani's Al Qatala. After killing some people of that group Captian Price a tattoo on one of the dead bodies and realised that they're not terrorist group but a cartel. Captian Price immediately recognized the tattoo and said{" "}
                <em><strong>"Gaz look, Las Almas Mexican Cartel"</strong></em>. That moment sparked an idea:{" "}
                <strong>"US Cartel"</strong>.
              </p>
              <p className="text-sm md:text-lg leading-relaxed">
                I immediately checked if <em>uscartel.com</em> was available, and
                it was! The name felt bold, memorable, and had multiple
                meanings. It could stand for <strong>"US" as in "we"</strong> and <strong>"Cart(like shopping cart)" in Cartel</strong>, or even a fun
                inside joke. Imagine someone asking,{" "}
                <em>"Where did you get that?"</em> and replying,{" "}
                <em>"From US Cartel."</em> Sounds cool, right?
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            Our Mission & Vision
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <BookOpen className="mx-auto mb-4 text-blue-600" size={48} />
              <h3 className="font-semibold text-xl mb-2">Build Trust</h3>
              <p>
                Creating a brand that sticks beyond stereotypical expectations
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <TrendingUp className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="font-semibold text-xl mb-2">Expand Horizons</h3>
              <p>From beauty products to fashion and fitness accessories</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <ShieldCheck className="mx-auto mb-4 text-purple-600" size={48} />
              <h3 className="font-semibold text-xl mb-2">Quality Promise</h3>
              <p>Delivering affordable, premium products customers love</p>
            </div>
          </div>
          <div className="mt-6 text-sm md:text-lg leading-relaxed">
            <p className="mb-4">
              At <strong>US Cartel</strong>, we're here to build more than just
              a business, we're creating a brand that sticks. When people hear{" "}
              <em>US Cartel</em>, we don't want them to think only of the
              stereotypical meaning but also of a trusted{" "}
              <strong>Ecommerce brand</strong> that delivers quality
              products at affordable prices.
            </p>
            <p>
              For now, we're focusing on <strong>beauty and fashion</strong>,
              {" "}
              <strong>Home appliances, Home furnishing products, Kitchenwares, Kitchen appliances, Gadgets and other accessories</strong>,
              and more. In the future, we aim to expand into{" "}
              <strong>
                fashion wear, gym apparel, and fitness accessories,
              </strong>
              building an empire that people remember and trust.
            </p>
          </div>
        </section>

        {/* Why We Started */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            Why We Started
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <Image
              src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/smalllogo.png?updatedAt=1737917127601"
              alt="US Cartel Origin"
              width={600}
              height={400}
              className="rounded-lg shadow-md w-[400px] h-[350px]"
            />

            <div>
              <p className="text-sm md:text-lg leading-relaxed mb-4">
                It all began with my mother's business. She sells beauty and
                healthcare products through personal connections, but that
                limited her reach. I saw an opportunity to create an{" "}
                <strong>e-commerce platform</strong> where her products could
                reach a wider audience.
              </p>
              <p className="text-sm md:text-lg leading-relaxed">
                Instead of relying on word-of-mouth alone, now she can simply
                share <em>uscartel.com</em>, allowing more people to shop
                conveniently. From this small start, I realized the potential to
                grow US Cartel into something much bigger, a brand known for{" "}
                <strong>quality, affordability, and uniqueness</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section>
          <h2 className="text-xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            What Makes Us Different
          </h2>
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start space-x-4">
              <Home className="text-red-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg md:text-xl">
                  Affordable & High-Quality Products
                </h3>
                <p className="text-sm">
                  We believe in offering <strong>great results</strong> without
                  breaking the bank.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Target className="text-blue-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg md:text-xl">
                  Memorable Brand Identity
                </h3>
                <p className="text-sm">
                  US Cartel is a name that stands out, making it easier for
                  people to find and share.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Clock className="text-green-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg md:text-xl">Future-Ready Vision</h3>
                <p className="text-sm">
                  We aim to evolve into a <strong>luxury brand</strong>, but for
                  now, we focus on being{" "}
                  <strong>friendly, accessible, and customer-first</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Gift className="text-purple-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg md:text-xl">Customer Satisfaction</h3>
                <p className="text-sm">
                  Your happiness is our priority. We want you to love our
                  products and the experience of shopping with us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Looking Ahead */}
        <section>
          <h2 className="text-xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            Looking Ahead
          </h2>
          <div className="text-sm md:text-lg leading-relaxed bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">
              Our goal is to make{" "}
              <strong>US Cartel a well known name in the Ecommerce world</strong>
              . In the coming years, we envision ourselves as a{" "}
              <strong>Ecommerce brand</strong>, delivering <strong>premium</strong>{" "}
              products while staying true to our core values:{" "}
              <strong>quality, affordability, and innovation</strong>.
            </p>
            <p>
              Right now, we're just getting started but the journey ahead is
              exciting.{" "}
              <strong>Join us and be a part of the US Cartel story.</strong>
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gray-100 p-12 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Join the US Cartel Journey
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Be part of our growing community and exciting story
          </p>
          <Link href="/list?cat=all-products">
            <Button className="bg-black hover:bg-gray-950 text-white px-8 py-3 rounded-full">
              Explore Our Products
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}

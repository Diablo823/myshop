import Image from "next/image";
import { Handshake, Package, Globe, BarChart, Wallet, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export default function PartnershipPage() {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 xl:px-32 bg-white text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-64 md:h-[24rem] w-full">
        <Image
          src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/aboutthumbnail.png?updatedAt=1737916330178"
          alt="Partnership Opportunities"
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      {/* Partnership Proposition */}
      <div className="container mx-auto py-12 max-w-4xl space-y-12">
        {/* Partnership Invite Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 pb-2">
            Growth Happens Only If We Work Together!
          </h2>
          <h3 className="text-lg md:text-xl font-bold text-center mb-6 border-b-2 border-gray-200 pb-2">
            Let's Grow Together.
          </h3>
          <h3 className="text-lg md:text-xl font-bold text-center mb-6 border-b-2 border-gray-200 pb-2">
           We &#40;US Cartel aka USC&#41; are inviting brands, companies and
            investors to partner with us in our journey to build a marketplace.
          </h3>
          <h3 className="text-lg md:text-xl font-bold text-center mb-6 border-b-2 border-gray-200 pb-2">
             We are not wasting your time. So let us be straight to the point.
            
          </h3>
          <div className="flex gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-center">
                YOU WILL MAKE YOUR MILLIONS WITHIN 365 DAYS
              </h3>
              <p className="text-gray-500 text-center italic mb-2">
                From The Founder of &#40;US Cartel aka USC&#41;
              </p>
              <div className="text-sm md:text-lg leading-relaxed mb-4 flex flex-wrap gap-4">
                <p>

                Growth happens only if we work together. <br />
                I am inviting all
                Entrepreneurs who want to get into the Ecommerce world and
                entrepreneurs who are already there in the Ecommerce world. 
                </p>
                <p>
                My name is Muruka Bhupathy.
                </p>
                <p>
                I am the founder of US Cartel aka USC
                the newly launched Ecommerce company.
                </p>
                <p>
                I am inviting all
                entrepreneurs, brands, companies, business personels to partner
                with us.
                </p>
                 Those who are already in the ecommerce world and those
                who want to get into the ecommerce world. <br />
                Those who are planning
                to get into the ecommerce world but have no ecommerce partner
                due the cut-throat fees they require inorder to partner with you
                and sell your products. 
                <p>

                We &#40;US Cartel aka USC&#41; will be
                your ecommerce partner.
                </p>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 mt-4">
                  Here's The Deal
                </h3>
                <ul className="list-disc pl-5 space-y-2 mb-4 text-sm md:text-lg">
                  <li>
                    Your products will be listed on USC's ecommerce store{" "}
                    <strong>FOR FREE</strong>
                  </li>
                  <li>No upfront costs</li>
                  <li>
                    No monthly or yearly fees like shopify and other website
                    builders
                  </li>
                  <li>
                    No cut-throat fees like Amazon and other ecommerce partners
                  </li>
                </ul>
                <h3 className="text-lg md:text-xl font-bold text-center mb-2">
                  No risks for you, All works on us
                </h3>
                <p className="text-lg md:text-xl font-bold text-center">
                  You keep the profits
                </p>
                
                <h3 className="text-lg md:text-xl text-center font-bold mb-2 mt-4">
                  Why Choose USC?
                </h3>
                <h3 className="text-sm md:text-lg font-bold mb-2">
                  US Cartel &#40;USC&#41; is your best shot at reaching your Million Dollar&#40;s&#41; Goal.
                </h3>
                <ul className="list-disc pl-5 space-y-2 mb-4 text-sm">
                  <li>
                    Your products will be listed on an SEO optimized ecommerce
                    platform.
                  </li>
                  <li>
                    We offer a marketplace to you for free. With no upfront
                    costs and no monthly or yearly fees.
                  </li>
                  <li>
                    We will only make 10% of the sales you make through
                    our ecommerce store.
                  </li>
                  <li>
                    You will get 90% of the sales you make through your ecommerce. <strong>You will reach your million dollar&#40;s&#41; goals faster</strong>
                  </li>
                </ul>
                <h3 className="text-lg md:text-xl font-bold">Let's Connect</h3>
              
            </div>
          </div>
        </section>
        {/* Why Partner Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            Why Partner With US Cartel?
          </h2>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Handshake className="text-blue-600 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">
                For Brands/Manufacturers
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-lg">
                <li>No competition advantage.</li>
                <li>Zero upfront listing fees</li>
                <li>
                  Your products will be listed on a SEO optimized Ecommerce
                  platform
                </li>
                <li>We handle marketing along with you</li>
                <li>90% profit share on your sales</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <Wallet className="text-green-600 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">For Investors</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-lg">
                <li>First-mover advantage in this non-competitive ecommerce.</li>
                <li>Inventory-backed ROI model</li>
                <li>50% profit share until ROI</li>
                <li>Then 70% for you 30% for us profit share after ROI</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Value Proposition */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            What We Bring to the Table
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Globe className="mx-auto mb-4 text-purple-600" size={48} />
              <h3 className="font-semibold text-xl mb-2">Market Reach</h3>
              <p className="text-sm md:text-lg">Premium domain + social media infrastructure to scale sales</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <BarChart className="mx-auto mb-4 text-red-600" size={48} />
              <h3 className="font-semibold text-xl mb-2">Growth Opportunity</h3>
              <p className="text-sm md:text-lg">This is your chance to scale your growth with a brand new ecommerce marketplace</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <CircleDollarSign className="mx-auto mb-4 text-amber-400" size={48} />
              <h3 className="font-semibold text-xl mb-2">Million Dollar&#40;s&#41; Goal</h3>
              <p className="text-sm md:text-lg">You get a free ecommerce marketplace where you can scale your business and reach your million dollar&#40;s&#41; goal</p>
            </div>
          </div>
        </section>

        {/* Partnership Model */}
        {/* <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Product Submission</h3>
                <p className="text-gray-600">
                  Share your product specs and MOQ
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Quality Check</h3>
                <p className="text-gray-600">
                  We verify product quality and market fit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Go to Market</h3>
                <p className="text-gray-600">
                  Launch with Social Media campaigns
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="text-center bg-gray-100 p-12 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Scale Together?
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Join US Cartel and make your millions
          </p>
          <Link href="/contact#con">
            <Button className="bg-black hover:bg-gray-950 text-white px-8 py-3 rounded-full">
              Start Partnership Discussion
            </Button>
          </Link>
        </section>

        <section>
          <div className="mt-2">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}

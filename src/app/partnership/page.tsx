import Image from "next/image";
import { TrendingUp, Target, Rocket, DollarSign, Users, ShoppingBag, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export default function InvestorPage() {
  return (
    <div className="min-h-screen px-2 md:px-8 lg:px-16 xl:px-32 bg-white text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-64 md:h-[24rem] w-full">
        <Image
          src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/aboutthumbnail.png?updatedAt=1737916330178"
          alt="Investment Opportunity"
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 max-w-4xl space-y-12">
        
        {/* The Pitch */}
        <section>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Building the Next Gen E-Commerce Brand
          </h1>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              US Cartel: From Bootstrap to Market Leader
            </h2>
            <p className="text-lg md:text-xl text-center mb-6 text-gray-700">
              We're not just another e-commerce store. We're building a brand.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-6">The Straight Truth</h3>
            
            <div className="space-y-4 text-base md:text-lg">
              <p>
                I'm Muruka Bhupathy, founder of US Cartel. I built this entire e-commerce platform from scratch (I know web development). 
              </p>
              <p>
                I built US Cartel with a vision to build a unique ecommerce brand that stands out from the crowd. The idea was to start something that could grow into a memorable brand known for quality and affordability.
              </p>
              <p>
                The infrastructure is ready, the domain is premium, and the technical foundation is solid.
              </p>
              
              
              <p className="font-semibold text-lg md:text-xl mt-6 mb-3">
                Here's where we stand:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>✅ Fully functional e-commerce platform built and deployed</li>
                <li>✅ SEO-optimized infrastructure ready for traffic</li>
                <li>✅ Premium brand name with market potential</li>
                <li>✅ Technical expertise to scale rapidly</li>
                <li>⚠️ Limited capital to source premium inventory</li>
              </ul>

              <p className="mt-6 text-lg font-semibold">
                That's why I'm seeking smart investors who see the opportunity.
              </p>
            </div>
          </div>
        </section>

        {/* The Opportunity */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            The Investment Opportunity
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <DollarSign className="text-green-600 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3">Low Entry, High Potential</h3>
              <p className="text-gray-700 mb-4">
                Get in at ground level with a fully-built platform. No development costs, no technical debt. Just product sourcing and marketing.
              </p>
              <p className="font-semibold text-green-700">
                Your investment goes directly into inventory and customer acquisition.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <Rocket className="text-blue-600 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3">Fast to Market</h3>
              <p className="text-gray-700 mb-4">
                Unlike traditional startups spending months on development, we're ready to launch. Fund today, products listed tomorrow.
              </p>
              <p className="font-semibold text-blue-700">
                Speed to revenue is our competitive advantage.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="text-amber-600" size={28} />
              What Makes This Different?
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>1. Product Flexibility:</strong> We're not locked into any niche. Whether it's premium streetwear, tech accessories, fitness gear, or home products - we can pivot based on market demand and your expertise.
              </p>
              <p>
                <strong>2. Your Voice Matters:</strong> As an investor, you're not just funding - you're a strategic partner. Bring product ideas, supplier connections, or marketing insights. We build this together.
              </p>
              <p>
                <strong>3. Premium Brand Positioning:</strong> "US Cartel" isn't just a name - it's a brand that can command premium pricing and customer loyalty across multiple product categories.
              </p>
            </div>
          </div>
        </section>

        {/* Business Models We Can Pursue */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            Revenue Models on the Table
          </h2>
          
          <div className="grid gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-purple-500">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <ShoppingBag className="text-purple-600" size={24} />
                Model 1: Premium Brand Merchandise
              </h3>
              <p className="text-gray-700 mb-3">
                Launch US Cartel as a lifestyle brand with custom streetwear, accessories, and collectibles. Think Supreme meets modern e-commerce.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-semibold mb-2">Investment needed: ₹50,000 - ₹2,00,000</p>
                <p className="text-sm text-gray-600">Custom manufacturing, premium materials, limited drops strategy</p>
                <p className="font-semibold text-green-600 mt-2">Margins: 60-80%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Target className="text-blue-600" size={24} />
                Model 2: Curated Niche Store
              </h3>
              <p className="text-gray-700 mb-3">
                Focus on a high-demand niche (tech gadgets, fitness equipment, beauty products) and become the go-to destination.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-semibold mb-2">Investment needed: ₹30,000 - ₹1,50,000</p>
                <p className="text-sm text-gray-600">Sourcing from reliable suppliers, initial inventory, targeted ads</p>
                <p className="font-semibold text-green-600 mt-2">Margins: 40-60%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Zap className="text-green-600" size={24} />
                Model 3: Trending Products + Fast Iteration
              </h3>
              <p className="text-gray-700 mb-3">
                Test multiple products quickly, double down on winners. Data-driven approach to find profitable SKUs.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-semibold mb-2">Investment needed: ₹25,000 - ₹1,00,000</p>
                <p className="text-sm text-gray-600">Small batch orders, rapid testing, social media marketing</p>
                <p className="font-semibold text-green-600 mt-2">Margins: 35-55%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
            <p className="text-center text-lg font-semibold mb-2">
              💡 Have a Different Product Idea?
            </p>
            <p className="text-center text-gray-700">
              I'm open to your vision. If you see an opportunity in the market, let's discuss it.<br /> Your market knowledge + my execution = success.
            </p>
          </div>
        </section>

        {/* What's In It For Investors */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            What's In It For You?
          </h2>
          
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-3 rounded-2xl mb-6">
            <h3 className="text-2xl font-bold mb-6 text-center">Investor Return Structure</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-3">Phase 1: ROI Recovery</h4>
                <ul className="space-y-2">
                  <li>✓ <strong>60%</strong> of net profits to you</li>
                  <li>✓ <strong>40%</strong> reinvested into business</li>
                  <li>✓ Priority: Get your capital back fast</li>
                  <li>✓ Transparent monthly reporting</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-3">Phase 2: Long-term Partnership</h4>
                <ul className="space-y-2">
                  <li>✓ <strong>50-50</strong> profit split</li>
                  {/* <li>✓ Or <strong>equity stake</strong> based on investment size</li> */}
                  <li>✓ Strategic decision-making rights</li>
                  <li>✓ Scale together as we grow</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <Users className="mx-auto mb-3 text-indigo-600" size={40} />
              <h4 className="font-bold mb-2">Active Partnership</h4>
              <p className="text-sm text-gray-600">Regular updates, open communication, shared decision-making</p>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <TrendingUp className="mx-auto mb-3 text-green-600" size={40} />
              <h4 className="font-bold mb-2">Scalable Model</h4>
              <p className="text-sm text-gray-600">Reinvest profits to compound growth and increase returns</p>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <Award className="mx-auto mb-3 text-amber-600" size={40} />
              <h4 className="font-bold mb-2">Exit Options</h4>
              <p className="text-sm text-gray-600">Buyout terms after ROI or scale to acquisition target</p>
            </div>
          </div>
        </section>

        {/* Why Me? */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            Why Invest in US Cartel?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-gray-50 p-3 rounded-lg">
              <div className="bg-blue-100 text-blue-600 font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Technical Foundation is Done</h3>
                <p className="text-gray-700">
                  I've already built the entire platform. That's thousands of dollars in dev costs you're NOT paying. Your money goes straight to revenue generation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gray-50 p-3 rounded-lg">
              <div className="bg-green-100 text-green-600 font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Founder Commitment</h3>
                <p className="text-gray-700">
                  I built this with my last ₹5,000. I'm all in. When you invest, you're backing someone who's already proven they can execute with minimal resources.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gray-50 p-3 rounded-lg">
              <div className="bg-purple-100 text-purple-600 font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Flexibility & Speed</h3>
                <p className="text-gray-700">
                  No corporate bureaucracy. We can test products, pivot strategies, and move fast. In e-commerce, speed beats perfection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gray-50 p-3 rounded-lg">
              <div className="bg-amber-100 text-amber-600 font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Your Input Shapes the Business</h3>
                <p className="text-gray-700">
                  Have experience in supply chain? Marketing? A specific product niche? Bring it. This is a true partnership where your expertise adds immediate value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Realistic Projections */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            Realistic Growth Timeline
          </h2>
          
          <div className="bg-gray-50 p-2 rounded-xl">
            <p className="text-sm text-gray-500 mb-4 italic">
              *These are projections based on conservative e-commerce benchmarks. Actual results depend on product selection, marketing execution, and market conditions.
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-lg mb-1">Months 1-3: Foundation</h4>
                <p className="text-gray-700">Product sourcing, initial launches, testing ads. Goal: First ₹50,000-₹1,00,000 in revenue</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-bold text-lg mb-1">Months 4-6: Optimization</h4>
                <p className="text-gray-700">Double down on winners, improve margins, scale ads. Goal: ₹2,00,000-₹3,50,000 monthly revenue</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-lg mb-1">Months 7-12: Scale</h4>
                <p className="text-gray-700">Expand product line, build brand, hire support. Goal: ₹5,00,000+ monthly revenue, investor ROI achieved</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Build Something Real
          </h2>
          <p className="text-lg md:text-xl mb-2">
            No fluff. No empty promises. Just honest work and shared success.
          </p>
          <p className="text-base mb-8 text-gray-300">
            If you're looking for a high-potential investment with an execution-focused founder, let's talk.
          </p>
          <Link href="/contact#con">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
              Schedule Investor Discussion
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
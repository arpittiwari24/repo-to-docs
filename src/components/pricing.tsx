"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { signIn } from "next-auth/react"

type PricingTier = {
  name: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean,
  type?: string,
  link?: string
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "For personal projects",
    features: ["1 README generation per month", "Direct Commit to Github"],
    buttonText: "Get Started",
    type: "/month",
  },
  {
    name: "Lifetime",
    price: "$10",
    description: "One-time payment, yours forever",
    features: ["Unlimited README generations", "Direct Commit to Github", "Multiple Language Translation", "Priority support", "All future features included", "No monthly limits", "Lifetime updates"],
    buttonText: "Get Started",
    type: "one-time",
    popular: true,
    link: "https://www.creem.io/payment/prod_hHSqQWhCkH7v8p73hbT1K"
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-8 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white mb-4">Simple pricing</h2>
          <p className="text-white/60 text-lg mb-6">Pay once, use forever</p>
          <div className="w-16 h-px bg-white/20 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`bg-transparent border ${tier.popular ? "border-white/20 relative" : "border-white/10"} p-8 h-full`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-black px-3 py-1 text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">{tier.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-light text-white">{tier.price}</span>
                    <span className="text-white/60 text-sm ml-1">{tier.type}</span>
                    {tier.popular && (
                      <div className="mt-1">
                        <span className="text-green-400 text-xs font-medium">Save 90% vs monthly subscriptions</span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-4 w-4 text-white/60 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.link ? (
                  <Link href={tier.link} target="_blank">
                    <Button
                      variant={tier.popular ? "default" : "outline"}
                      className={`w-full rounded-md ${tier.popular ? "bg-white text-black hover:bg-white/90" : "border-white/20 text-white hover:bg-white/5"}`}
                    >
                      {tier.buttonText}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => signIn()}
                    variant={tier.popular ? "default" : "outline"}
                    className={`w-full rounded-md ${tier.popular ? "bg-white text-black hover:bg-white/90" : "border-white/20 text-white hover:bg-white/5"}`}
                  >
                    {tier.buttonText}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Value proposition section */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-medium text-white mb-2">Why Lifetime?</h3>
            <p className="text-white/70 text-sm">
              We believe in simple, transparent pricing. Pay once and get unlimited access to all features, 
              forever. No recurring fees, no hidden costs, no surprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
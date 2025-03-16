"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type PricingTier = {
  name: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean,
  type?: string
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "For personal projects",
    features: ["1 README generations per month"],
    buttonText: "Get Started",
    type: "/month",
  },
  {
    name: "Pro",
    price: "$5",
    description: "For professional developers",
    features: ["6 README generations per month", "Direct Commit to Github", "Priority support"],
    buttonText: "Upgrade to Pro",
    type: "/month",
  },
  {
    name: "Lifetime",
    price: "$20",
    description: "For development teams",
    features: ["100 README generations", "Direct Commit to Github", "Priority support", "No monthly limits"],
    buttonText: "Upgrade to Lifetime",
    type: "/one-time",
    popular: true,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-8 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white mb-4">Simple pricing</h2>
          <div className="w-16 h-px bg-white/20 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`bg-transparent border ${tier.popular ? "border-white/20" : "border-white/10"} p-8 h-full`}
            >
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">{tier.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-light text-white">{tier.price}</span>
                    <span className="text-white/60 text-sm ml-1">{tier.type}</span>
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

                <Button
                  variant={tier.popular ? "default" : "outline"}
                  className={`w-full rounded-md ${tier.popular ? "bg-white text-black hover:bg-white/90" : "border-white/20 text-white hover:bg-white/5"}`}
                >
                  {tier.buttonText}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


"use client"

import { Card } from "@/components/ui/card"
import { Tweet } from "react-tweet"
import { Suspense } from "react"

// Tweet IDs - Replace these with actual tweet IDs of testimonials about your product
const tweetIds = [
  "1855841219751874755", // Replace with actual tweet ID
  "1855699123904684039", // Replace with actual tweet ID
  "1899356177638527272", // Replace with actual tweet ID
];

// Fallback testimonials for when tweets are loading or unavailable
type Testimonial = {
  id: number
  name: string
  role: string
  content: string
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    content:
      "Readme Generator has completely transformed how I create documentation. My GitHub repos now look professional with minimal effort.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Open Source Contributor",
    content:
      "As someone who maintains multiple open source projects, Readme Generator has saved me countless hours on documentation.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    content:
      "The AI understands exactly what my projects need. The READMEs it generates are clear, comprehensive, and beautifully formatted.",
  },
]

// Loading skeleton for tweets
function TweetSkeleton() {
  return (
    <Card className="bg-transparent border border-white/10 p-6 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full"></div>
          <div className="space-y-1">
            <div className="w-24 h-3 bg-white/10 rounded"></div>
            <div className="w-16 h-2 bg-white/10 rounded"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/10 rounded"></div>
          <div className="w-4/5 h-2 bg-white/10 rounded"></div>
          <div className="w-3/4 h-2 bg-white/10 rounded"></div>
        </div>
      </div>
    </Card>
  );
}

// Individual tweet component with error boundary
function TweetCard({ tweetId }: { tweetId: string }) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-transparent border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all duration-300 p-4">
          <Suspense fallback={<TweetSkeleton />}>
            <Tweet 
              id={tweetId}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Fallback testimonial card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="bg-transparent border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
      <p className="text-white/70 text-sm mb-6">"{testimonial.content}"</p>
      <div>
        <p className="text-white text-sm font-medium">{testimonial.name}</p>
        <p className="text-white/50 text-xs">{testimonial.role}</p>
      </div>
    </Card>
  );
}

export default function Testimonials() {
  // You can add logic here to determine whether to show tweets or fallback testimonials
  const showTweets = true; // Set to false to show fallback testimonials instead

  return (
    <section id="testimonials" className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white mb-4">What people are saying</h2>
          <div className="w-16 h-px bg-white/20 mx-auto"></div>
        </div>

        {showTweets ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tweetIds.map((tweetId, index) => (
              <TweetCard key={tweetId} tweetId={tweetId} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fallbackTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
"use client"

import { Card } from "@/components/ui/card"

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    content:
      "PenAI has completely transformed how I create documentation. My GitHub repos now look professional with minimal effort.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Open Source Contributor",
    content:
      "As someone who maintains multiple open source projects, PenAI has saved me countless hours on documentation.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    content:
      "The AI understands exactly what my projects need. The READMEs it generates are clear, comprehensive, and beautifully formatted.",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white mb-4">What people are saying</h2>
          <div className="w-16 h-px bg-white/20 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-transparent border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
            >
              <p className="text-white/70 text-sm mb-6">"{testimonial.content}"</p>
              <div>
                <p className="text-white text-sm font-medium">{testimonial.name}</p>
                <p className="text-white/50 text-xs">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


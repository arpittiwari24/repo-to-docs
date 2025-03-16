"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function Hero() {
  return (
    <section id="home" className="pt-40 pb-32 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-wider text-white/60 mb-6">AI-Powered Documentation</span>

          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6 leading-tight">
            <span className="font-medium">AI</span> GitHub Readme Generator
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mb-10">
            Generate beautiful, professional README files for your GitHub repositories in seconds using AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md lg:items-center lg:justify-center">
            <Button onClick={() => signIn("github")} className="bg-white text-black hover:bg-white/90 rounded-md h-12 px-6 text-sm font-medium">
              Get Started
            </Button>
            <a href="#demo">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/5 text-white rounded-md h-12 px-6 text-sm font-medium"
              >
                Watch Demo
              </Button>
            </a>
          </div>

          <div className="mt-16 w-full max-w-4xl relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-white/10 rounded-lg blur opacity-50"></div>
            <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden">
              <img src="/dashboard.png" alt="PenAI Interface" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"

interface UserStats {
  userCount: number;
  readmeCount: number;
}

interface HeroProps {
  userStats?: UserStats;
}

// Counter animation component
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Hero({ userStats }: HeroProps) {
  return (
    <section id="home" className="pt-40 pb-32 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-wider text-white/60 mb-6">AI-Powered Documentation</span>

          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6 leading-tight">
            <span className="font-medium">AI</span> GitHub Readme Generator
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mb-8">
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

                    {userStats && (
            <div className="flex flex-col sm:flex-row gap-8 mt-10 p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter end={userStats.userCount + 45} />+
                </div>
                <div className="text-sm text-white/60">Happy Users</div>
              </div>
              <div className="hidden sm:block w-px bg-white/20"></div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter end={userStats.readmeCount + 50} />+
                </div>
                <div className="text-sm text-white/60">READMEs Generated</div>
              </div>
            </div>
          )}

          <div className="mt-16 w-full max-w-4xl relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-white/10 rounded-lg blur opacity-50"></div>
            <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden">
              <img src="/dashboard.png" alt="Readme Generator Interface" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
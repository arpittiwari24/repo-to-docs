"use client"

import { useState } from "react"
import { Pen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Demo", href: "#demo" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-8 bg-black/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
            <img src="/logos.webp" alt="" className="size-12 rounded-full"/>
          <h1 className="text-xl font-medium text-white">Readme Generator</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
          <Button
          onClick={() => signIn("github")} 
            variant="outline"
            className="border-white/20 hover:bg-white/5 text-white text-sm rounded-md px-4 py-2 h-auto"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black py-4 px-8 flex flex-col gap-4 border-t border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/5 text-white text-sm rounded-md px-4 py-2 h-auto w-full mt-2"
          >
            Get Started
          </Button>
        </div>
      )}
    </nav>
  )
}


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free AI GitHub README Generator - Make Your Repo Stand Out",
  description:
    "Create stunning and professional README.md files for your GitHub repos using AI. Fast, easy, and beautiful. Try it in seconds!",
  keywords:
    "Readme Generator, AI, GitHub, Readme, Generator, AI GitHub Readme Generator, GitHub Readme Generator, readme file generator, AI Readme Generator , PenAI Readme Generator , git readme generator , readme ai",
  twitter: {
    card: "summary_large_image",
    site: "@arrpitttwts",
    creator: "@arrpitttwts",
    title: "AI GitHub Readme Generator",
    description:
      "Create stunning and professional README.md files for your GitHub repos using AI. Fast, easy, and beautiful. Try it in seconds!",
    images: "https://readme-generator.xyz/og.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://readme-generator.xyz",
    siteName: "AI GitHub Readme Generator",
    title: "Free AI GitHub README Generator - Make Your Repo Stand Out",
    description:
      "Create stunning and professional README.md files for your GitHub repos using AI. Fast, easy, and beautiful. Try it in seconds!",
    images: [
      {
        url: "https://readme-generator.xyz/og.png",
        width: 1200,
        height: 630,
        alt: "AI GitHub Readme Generator",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="19d2ee6f-c216-4382-be58-bdeeb27f797b"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AI GitHub Readme Generator",
              url: "https://readme-generator.xyz",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "All",
              description:
                "Readme Generator is an AI-powered tool that helps you generate beautiful and professional README.md files for your GitHub projects.",
              keywords: [
                "AI Readme Generator",
                "GitHub Readme Generator",
                "Readme Generator",
                "Git Readme Generator",
                "Free Readme Generator",
              ],
              creator: {
                "@type": "Person",
                name: "Arrpit Tiwari",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                reviewCount: "25",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.lemonSqueezyAffiliateConfig = { store: "readme-gen" };',
          }}
        ></script>
        <script src="https://lmsqueezy.com/affiliate.js" defer></script>
      </head>
      <Providers>
        <body className={inter.className}>
          <Toaster />
          {children}
        </body>
      </Providers>
    </html>
  );
}

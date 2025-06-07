import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI GitHub Readme Generator | Generate beautifull and professional Readme for your Repo ",
  description: "Readme Generator is an AI GitHub Readme Generator that helps you create a beautiful README.md file for your GitHub repository.",
  keywords : "Readme Generator, AI, GitHub, Readme, Generator, AI GitHub Readme Generator, GitHub Readme Generator, Readme Generator, AI Readme Generator , PenAI Readme Generator", 
  twitter: {
    card: "summary_large_image",
    site: "@arrpitttwts",
    creator: "@arrpitttwts",
    title: "AI GitHub Readme Generator",
    description: "Readme Generator is an AI GitHub Readme Generator that helps you create a beautiful README.md file for your GitHub repository.",
    images: "https://readme-generator.xyz/og.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://readme-generator.xyz",
    siteName: "AI GitHub Readme Generator",
    title: "AI GitHub Readme Generator",
    description: "Readme Generator is an AI GitHub Readme Generator that helps you create a beautiful README.md file for your GitHub repository.",
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
      <script defer src="https://cloud.umami.is/script.js" data-website-id="19d2ee6f-c216-4382-be58-bdeeb27f797b"></script>
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

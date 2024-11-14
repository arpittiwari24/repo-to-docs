import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PenAI | AI GitHub Readme Generator",
  description: "PenAI is an AI GitHub Readme Generator that helps you create a beautiful README.md file for your GitHub repository.",
  twitter: {
    card: "summary_large_image",
    site: "@arrpitttwts",
    creator: "@arrpitttwts",
    title: "PenAI | AI GitHub Readme Generator",
    description: "PenAI is an AI GitHub Readme Generator that helps you create a beautiful README.md file for your GitHub repository.",
    images: "https://penai.arrpit.work/og-image.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://penai.arrpit.work",
    siteName: "PenAI | AI GitHub Readme Generator",
    title: "PenAI | AI GitHub Readme Generator",
    description: "PenAI is an AI GitHub Readme Generator that helps you create a beautiful README.md file for your GitHub repository.",
    images: [
      {
        url: "https://penai.arrpit.work/og-image.png",
        width: 1200,
        height: 630,
        alt: "PenAI | AI GitHub Readme Generators",
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
      <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}

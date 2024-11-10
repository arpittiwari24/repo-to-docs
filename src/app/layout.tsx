import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PenAI | AI GitHub Readme Generator",
  description: "PenAI is an AI GitHub Readme Generator that helps you create a beautiful README.md file for your GitHub repository.",
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

import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";
import { cookies } from "next/headers";
import LoginButton from "@/components/LoginButton";
import Testimonials from "@/components/Testimonials";
import { PenIcon } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Dashboard from "@/components/dashboard";
import { fetchRecentReadmes } from "@/lib/common";
import Navbar from "@/components/navbar";
import Demo from "@/components/demo";
import Hero from "@/components/hero";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Fetch data only if session exists
  const data = session ? await fetchRecentReadmes() : [];
  
  // Add some debug logging
  console.log("Session:", session);
  console.log("Fetched data structure:", Array.isArray(data) ? "Array" : typeof data);
  console.log("Fetched data length:", Array.isArray(data) ? data.length : "N/A");

  // If no session exists, show login page
  if (!session) {
    return (
         <div className="bg-gradient-to-tr from-black to-gray-900 min-h-screen">
      <Navbar />
      <Hero />
      <Demo />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
    );
  }

  // Ensure data is always an array before passing it to AppLayout
  const historyArray = Array.isArray(data) ? data : [];

  return (
    <AppLayout session={session} history={historyArray}>
      <Dashboard session={session} history={historyArray} />
    </AppLayout>
  )
}

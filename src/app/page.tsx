import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";
import { cookies } from "next/headers";
import LoginButton from "@/components/LoginButton";
import Testimonials from "@/components/Testimonials";
import { PenIcon } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Dashboard from "@/components/dashboard";
import { fetchRecentReadmes, fetchUserPremiumStatus } from "@/lib/common";
import Navbar from "@/components/navbar";
import Demo from "@/components/demo";
import Hero from "@/components/hero";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
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
  
  // Fetch user data and readmes if session exists
  const [readmeData, userPremiumStatus] = await Promise.all([
    fetchRecentReadmes(),
    fetchUserPremiumStatus(session.user.id!)
  ]);
  
  // Merge premium status into session
  const enhancedSession = {
    ...session,
    user: {
      ...session.user,
      premium: userPremiumStatus?.premium || false
    }
  };
  
  // Add some debug logging
  console.log("Session:", enhancedSession);
  console.log("Premium status:", userPremiumStatus);
  console.log("Fetched data structure:", Array.isArray(readmeData) ? "Array" : typeof readmeData);
  console.log("Fetched data length:", Array.isArray(readmeData) ? readmeData.length : "N/A");

  // Ensure data is always an array before passing it to AppLayout
  const historyArray = Array.isArray(readmeData) ? readmeData : [];

  return (
    <AppLayout session={enhancedSession} history={historyArray}>
      <Dashboard session={enhancedSession} history={historyArray} />
    </AppLayout>
  )
}
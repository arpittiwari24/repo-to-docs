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
import { prisma } from "@/lib/prisma"; // Assuming you have prisma instance exported

// Add this function to fetch user statistics
async function fetchUserStats() {
  try {
    const [userCount, readmeCount] = await Promise.all([
      prisma.user.count(),
      prisma.readme.count() // Assuming you have a readme model
    ]);
    
    return { userCount, readmeCount };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { userCount: 0, readmeCount: 0 };
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // If no session exists, show login page with stats
  if (!session) {
    const userStats = await fetchUserStats();
    
    return (
      <div className="bg-gradient-to-tr from-black to-gray-900 min-h-screen">
        <Navbar />
        <Hero userStats={userStats} />
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
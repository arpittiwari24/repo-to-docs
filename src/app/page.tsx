import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";
import Testimonials from "@/components/Testimonials";
import AppLayout from "@/components/app-layout";
import Dashboard from "@/components/dashboard";
import { fetchRecentReadmes } from "@/lib/common";
import Navbar from "@/components/navbar";
import Demo from "@/components/demo";
import Hero from "@/components/hero";
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
        <Footer />
      </div>
    );
  }
  
  // Fetch readmes if session exists
  const readmeData = await fetchRecentReadmes();

  // Ensure data is always an array before passing it to AppLayout
  const historyArray = Array.isArray(readmeData) ? readmeData : [];

  return (
    <AppLayout session={session} history={historyArray}>
      <Dashboard session={session} history={historyArray} />
    </AppLayout>
  )
}
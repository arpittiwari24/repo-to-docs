import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import DocsGenerator from "@/components/DocsGenerator";
import Testimonials from "@/components/Testimonials";
import { PenIcon } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If no session exists, show login page
  if (!session) {
    return (
      <div className="bg-gradient-to-tr from-black to-gray-800 min-h-screen flex flex-col justify-between">
        <nav className="flex flex-row items-center justify-between gap-4 p-2">
          <div className="flex items-center gap-3">
            <PenIcon className="w-8 h-8 max-sm:size-6 text-white" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">PenAI</h1>
          </div>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center max-sm:px-2">
          <h1 className="text-6xl max-sm:text-5xl font-bold mb-4 text-white text-center"><span className="">AI</span> GitHub Readme Generator</h1>
          <p className="mt-4 mb-10 text-gray-200 text-lg text-center">Generate a beautiful README.md file for your GitHub repository using AI.</p>
          <LoginButton />
        </div>
        <Testimonials />
        <div className='flex items-center justify-center text-white pb-4'>Made with ❤️ by <a href="https://arrpit.work" target="_blank" className='underline px-2'>Arrpit</a></div>
      </div>
    );
  }

  return <DocsGenerator session={session} />;
}
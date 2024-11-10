import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import DocsGenerator from "@/components/DocsGenerator";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If no session exists, show login page
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-white max-sm:text-center">AI GitHub Readme Generator</h1>
        <LoginButton />
      </div>
    );
  }

  return <DocsGenerator session={session} />;
}
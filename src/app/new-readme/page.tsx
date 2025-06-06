import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/app-layout";
import authOptions from "@/lib/auth-options";
import NewReadme from "@/components/new-readme";
import { fetchRecentReadmes, fetchUserPremiumStatus } from "@/lib/common";

export default async function NewReadmePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Fetch both readme data and premium status
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

  const historyArray = Array.isArray(readmeData) ? readmeData : [];

  return (
    <AppLayout session={enhancedSession} history={historyArray}>
      <NewReadme session={enhancedSession} />
    </AppLayout>
  );
}
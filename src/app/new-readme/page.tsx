import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/app-layout";
import authOptions from "@/lib/auth-options";
import NewReadme from "@/components/new-readme";
import { fetchRecentReadmes } from "@/lib/common";

export default async function NewReadmePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const [readmeData] = await Promise.all([
    fetchRecentReadmes(),
  ]);

  const historyArray = Array.isArray(readmeData) ? readmeData : [];

  return (
    <AppLayout session={session} history={historyArray}>
      <NewReadme session={session} />
    </AppLayout>
  );
}
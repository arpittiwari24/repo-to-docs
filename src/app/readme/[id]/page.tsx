import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/app-layout";
import ReadmeView from "@/components/readme-view";
import authOptions from "@/lib/auth-options";
import { fetchRecentReadmes } from "@/lib/common";

export default async function ReadmeViewPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }


  const data = session ? await fetchRecentReadmes() : [];

  const historyArray = Array.isArray(data) ? data : [];

  return (
     <AppLayout session={session} history={historyArray}>
      <ReadmeView session={session} readmeId={params.id} />
    </AppLayout>
  );
}
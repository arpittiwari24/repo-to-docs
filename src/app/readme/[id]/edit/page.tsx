// app/readme/[id]/edit/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/app-layout";
import ReadmeEdit from "@/components/readme-edit";
import authOptions from "@/lib/auth-options";
import { fetchRecentReadmes } from "@/lib/common";

export default async function ReadmeEditPage({ params }: { params: { id: string } }) {
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
      <ReadmeEdit session={session} readmeId={params.id} />
    </AppLayout>
  );
}
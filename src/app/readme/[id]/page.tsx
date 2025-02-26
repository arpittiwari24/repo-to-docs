import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/app-layout";
import ReadmeView from "@/components/readme-view";
import authOptions from "@/lib/auth-options";

export default async function ReadmeViewPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <AppLayout session={session}>
      <ReadmeView session={session} readmeId={params.id} />
    </AppLayout>
  );
}
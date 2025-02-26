// app/readme/[id]/edit/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/app-layout";
import ReadmeEdit from "@/components/readme-edit";
import authOptions from "@/lib/auth-options";

export default async function ReadmeEditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <AppLayout session={session}>
      <ReadmeEdit session={session} readmeId={params.id} />
    </AppLayout>
  );
}
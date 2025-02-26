import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppLayout from "@/components/app-layout";
import authOptions from "@/lib/auth-options";
import NewReadme from "@/components/new-readme";

export default async function NewReadmePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <AppLayout session={session}>
      <NewReadme session={session} />
    </AppLayout>
  );
}
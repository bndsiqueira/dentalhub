import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getRequiredSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function getCurrentClinicId(): Promise<string> {
  const session = await getRequiredSession();
  return (session.user as any).clinicId;
}

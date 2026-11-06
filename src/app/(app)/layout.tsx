import { Sidebar } from "@/components/sidebar";
import { getRequiredSession } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequiredSession();
  const clinicId = (session.user as any).clinicId;

  const clinic = await db.clinic.findUniqueOrThrow({
    where: { id: clinicId },
  });

  return (
    <div className="flex h-screen">
      <Sidebar
        clinicName={clinic.name}
        userName={session.user?.name ?? ""}
        isSuperAdmin={(session.user as any).isSuperAdmin ?? false}
      />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        {children}
      </main>
    </div>
  );
}

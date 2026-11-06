"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user || !(session.user as any).isSuperAdmin) {
    redirect("/dashboard");
  }
  return session;
}

export async function getAllClinics() {
  await requireSuperAdmin();

  return db.clinic.findMany({
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          patients: true,
          services: true,
          appointments: true,
          leads: true,
          treatments: true,
          transactions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

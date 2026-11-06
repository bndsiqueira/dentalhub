"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentClinicId } from "@/lib/auth-utils";

export async function getServices() {
  const clinicId = await getCurrentClinicId();
  return db.service.findMany({
    where: { clinicId },
    orderBy: { name: "asc" },
  });
}

interface CreateServiceInput {
  name: string;
  description?: string;
  category: string;
  price: number;
  durationMinutes: number;
  defaultSessions: number;
  color: string;
}

export async function createService(input: CreateServiceInput) {
  const clinicId = await getCurrentClinicId();

  if (!input.name || !input.category) {
    return { error: "Nome e categoria são obrigatórios" };
  }

  if (input.price <= 0) {
    return { error: "Preço deve ser maior que zero" };
  }

  await db.service.create({
    data: {
      clinicId,
      name: input.name,
      category: input.category,
      price: input.price,
      durationMinutes: input.durationMinutes,
      defaultSessions: input.defaultSessions,
      color: input.color,
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
    },
  });

  revalidatePath("/services");
  return { success: true };
}

export async function updateService(id: string, data: Partial<CreateServiceInput>) {
  const clinicId = await getCurrentClinicId();

  await db.service.update({
    where: { id, clinicId },
    data,
  });

  revalidatePath("/services");
  return { success: true };
}

export async function deleteService(id: string) {
  const clinicId = await getCurrentClinicId();

  await db.service.delete({
    where: { id, clinicId },
  });

  revalidatePath("/services");
  return { success: true };
}

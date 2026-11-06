"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentClinicId } from "@/lib/auth-utils";

export async function getPatients(search?: string) {
  const clinicId = await getCurrentClinicId();

  const where: any = { clinicId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  return db.patient.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function getPatientById(id: string) {
  const clinicId = await getCurrentClinicId();

  return db.patient.findUnique({
    where: { id, clinicId },
    include: {
      appointments: { include: { service: true, user: true }, orderBy: { startTime: "desc" } },
      transactions: { include: { service: true }, orderBy: { createdAt: "desc" } },
      treatments: { include: { service: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

interface CreatePatientInput {
  name: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  email?: string;
  address?: string;
  insurance?: string;
  notes?: string;
}

export async function createPatient(input: CreatePatientInput) {
  const clinicId = await getCurrentClinicId();

  if (!input.name || !input.phone) {
    return { error: "Nome e telefone são obrigatórios" };
  }

  const data: any = {
    clinicId,
    name: input.name,
    phone: input.phone,
  };

  if (input.cpf) data.cpf = input.cpf;
  if (input.birthDate) data.birthDate = new Date(input.birthDate);
  if (input.email) data.email = input.email;
  if (input.address) data.address = input.address;
  if (input.insurance) data.insurance = input.insurance;
  if (input.notes) data.notes = input.notes;

  await db.patient.create({ data });

  revalidatePath("/patients");
  return { success: true };
}

export async function updatePatient(id: string, input: Partial<CreatePatientInput>) {
  const clinicId = await getCurrentClinicId();

  const data: any = { ...input };
  if (input.birthDate) data.birthDate = new Date(input.birthDate);

  await db.patient.update({
    where: { id, clinicId },
    data,
  });

  revalidatePath("/patients");
  revalidatePath(`/patients/${id}`);
  return { success: true };
}

export async function deletePatient(id: string) {
  const clinicId = await getCurrentClinicId();

  await db.patient.delete({
    where: { id, clinicId },
  });

  revalidatePath("/patients");
  return { success: true };
}

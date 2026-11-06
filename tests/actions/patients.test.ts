import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    patient: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-utils", () => ({
  getCurrentClinicId: vi.fn().mockResolvedValue("clinic-1"),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { db } from "@/lib/db";

describe("patients actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPatients returns patients for the current clinic", async () => {
    const mockPatients = [
      { id: "p1", clinicId: "clinic-1", name: "Maria Santos", phone: "(11) 99999-1234" },
    ];
    vi.mocked(db.patient.findMany).mockResolvedValueOnce(mockPatients as any);

    const { getPatients } = await import("@/actions/patients");
    const result = await getPatients();

    expect(db.patient.findMany).toHaveBeenCalledWith({
      where: { clinicId: "clinic-1" },
      orderBy: { name: "asc" },
    });
    expect(result).toEqual(mockPatients);
  });

  it("getPatients supports search by name", async () => {
    vi.mocked(db.patient.findMany).mockResolvedValueOnce([]);

    const { getPatients } = await import("@/actions/patients");
    await getPatients("Maria");

    expect(db.patient.findMany).toHaveBeenCalledWith({
      where: {
        clinicId: "clinic-1",
        OR: [
          { name: { contains: "Maria", mode: "insensitive" } },
          { phone: { contains: "Maria" } },
        ],
      },
      orderBy: { name: "asc" },
    });
  });

  it("createPatient rejects missing name", async () => {
    const { createPatient } = await import("@/actions/patients");
    const result = await createPatient({ name: "", phone: "(11) 99999" });
    expect(result.error).toBe("Nome e telefone são obrigatórios");
  });

  it("createPatient creates patient with correct data", async () => {
    vi.mocked(db.patient.create).mockResolvedValueOnce({ id: "p1" } as any);

    const { createPatient } = await import("@/actions/patients");
    const result = await createPatient({
      name: "Maria Santos",
      phone: "(11) 99999-1234",
      email: "maria@test.com",
      notes: "Alérgica a dipirona",
    });

    expect(db.patient.create).toHaveBeenCalledWith({
      data: {
        clinicId: "clinic-1",
        name: "Maria Santos",
        phone: "(11) 99999-1234",
        email: "maria@test.com",
        notes: "Alérgica a dipirona",
      },
    });
    expect(result.success).toBe(true);
  });

  it("getPatientById returns patient with related data", async () => {
    const mockPatient = {
      id: "p1",
      clinicId: "clinic-1",
      name: "Maria Santos",
      appointments: [],
      transactions: [],
      treatments: [],
    };
    vi.mocked(db.patient.findUnique).mockResolvedValueOnce(mockPatient as any);

    const { getPatientById } = await import("@/actions/patients");
    const result = await getPatientById("p1");

    expect(db.patient.findUnique).toHaveBeenCalledWith({
      where: { id: "p1", clinicId: "clinic-1" },
      include: {
        appointments: { include: { service: true, user: true }, orderBy: { startTime: "desc" } },
        transactions: { include: { service: true }, orderBy: { createdAt: "desc" } },
        treatments: { include: { service: true }, orderBy: { createdAt: "desc" } },
      },
    });
    expect(result).toEqual(mockPatient);
  });
});

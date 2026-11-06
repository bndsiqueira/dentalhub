import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    service: {
      findMany: vi.fn(),
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

describe("services actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getServices returns services for the current clinic", async () => {
    const mockServices = [
      { id: "1", clinicId: "clinic-1", name: "Limpeza", category: "Prevenção", price: 200, durationMinutes: 45, defaultSessions: 1, color: "#3b82f6", isActive: true },
    ];
    vi.mocked(db.service.findMany).mockResolvedValueOnce(mockServices as any);

    const { getServices } = await import("@/actions/services");
    const result = await getServices();

    expect(db.service.findMany).toHaveBeenCalledWith({
      where: { clinicId: "clinic-1" },
      orderBy: { name: "asc" },
    });
    expect(result).toEqual(mockServices);
  });

  it("createService rejects missing name", async () => {
    const { createService } = await import("@/actions/services");
    const result = await createService({
      name: "",
      category: "Prevenção",
      price: 200,
      durationMinutes: 45,
      defaultSessions: 1,
      color: "#3b82f6",
    });
    expect(result.error).toBe("Nome e categoria são obrigatórios");
  });

  it("createService rejects invalid price", async () => {
    const { createService } = await import("@/actions/services");
    const result = await createService({
      name: "Limpeza",
      category: "Prevenção",
      price: -10,
      durationMinutes: 45,
      defaultSessions: 1,
      color: "#3b82f6",
    });
    expect(result.error).toBe("Preço deve ser maior que zero");
  });

  it("createService creates service with correct data", async () => {
    vi.mocked(db.service.create).mockResolvedValueOnce({ id: "svc-1" } as any);

    const { createService } = await import("@/actions/services");
    const result = await createService({
      name: "Limpeza",
      category: "Prevenção",
      price: 200,
      durationMinutes: 45,
      defaultSessions: 1,
      color: "#3b82f6",
    });

    expect(db.service.create).toHaveBeenCalledWith({
      data: {
        clinicId: "clinic-1",
        name: "Limpeza",
        category: "Prevenção",
        price: 200,
        durationMinutes: 45,
        defaultSessions: 1,
        color: "#3b82f6",
      },
    });
    expect(result.success).toBe(true);
  });

  it("updateService updates the service", async () => {
    vi.mocked(db.service.update).mockResolvedValueOnce({ id: "svc-1" } as any);

    const { updateService } = await import("@/actions/services");
    const result = await updateService("svc-1", { name: "Limpeza Completa", price: 250 });

    expect(db.service.update).toHaveBeenCalledWith({
      where: { id: "svc-1", clinicId: "clinic-1" },
      data: { name: "Limpeza Completa", price: 250 },
    });
    expect(result.success).toBe(true);
  });

  it("deleteService deletes the service", async () => {
    vi.mocked(db.service.delete).mockResolvedValueOnce({ id: "svc-1" } as any);

    const { deleteService } = await import("@/actions/services");
    const result = await deleteService("svc-1");

    expect(db.service.delete).toHaveBeenCalledWith({
      where: { id: "svc-1", clinicId: "clinic-1" },
    });
    expect(result.success).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("@/lib/db", () => ({
  db: {
    clinic: { create: vi.fn() },
    user: { findUnique: vi.fn(), create: vi.fn() },
  },
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

// Mock next-auth (signIn used by loginUser)
vi.mock("@/lib/auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  auth: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
}));

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

describe("register action logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject registration with missing fields", async () => {
    const { registerUser } = await import("@/actions/auth");
    const result = await registerUser({
      clinicName: "",
      name: "Dr. João",
      email: "joao@test.com",
      password: "password123",
    });
    expect(result.error).toBe("Todos os campos são obrigatórios");
  });

  it("should reject registration with short password", async () => {
    const { registerUser } = await import("@/actions/auth");
    const result = await registerUser({
      clinicName: "Consultório Dr. João",
      name: "Dr. João",
      email: "joao@test.com",
      password: "123",
    });
    expect(result.error).toBe("A senha deve ter pelo menos 6 caracteres");
  });

  it("should reject registration if email already exists", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce({
      id: "existing",
      email: "joao@test.com",
    } as any);

    const { registerUser } = await import("@/actions/auth");
    const result = await registerUser({
      clinicName: "Consultório Dr. João",
      name: "Dr. João",
      email: "joao@test.com",
      password: "password123",
    });
    expect(result.error).toBe("Este email já está cadastrado");
  });

  it("should create clinic and user on valid registration", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(db.clinic.create).mockResolvedValueOnce({
      id: "clinic-1",
      name: "Consultório Dr. João",
    } as any);

    const { registerUser } = await import("@/actions/auth");
    const result = await registerUser({
      clinicName: "Consultório Dr. João",
      name: "Dr. João",
      email: "joao@test.com",
      password: "password123",
    });

    expect(db.clinic.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Consultório Dr. João",
        users: {
          create: expect.objectContaining({
            name: "Dr. João",
            email: "joao@test.com",
            passwordHash: "hashed_password",
            role: "owner",
          }),
        },
      }),
    });
    expect(result.success).toBe(true);
  });
});

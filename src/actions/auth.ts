"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";

interface RegisterInput {
  clinicName: string;
  name: string;
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const { clinicName, name, email, password } = input;

  if (!clinicName || !name || !email || !password) {
    return { error: "Todos os campos são obrigatórios" };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres" };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Este email já está cadastrado" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.clinic.create({
    data: {
      name: clinicName,
      users: {
        create: {
          name,
          email,
          passwordHash,
          role: "owner",
        },
      },
    },
  });

  return { success: true };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "Email ou senha inválidos" };
  }
}

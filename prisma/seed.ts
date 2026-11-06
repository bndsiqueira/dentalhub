import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !seedPassword) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before seeding.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Super admin already exists, skipping.");
    return;
  }

  const passwordHash = await bcrypt.hash(seedPassword, 10);

  const clinic = await prisma.clinic.create({
    data: {
      name: "DentalHub Admin",
      users: {
        create: {
          name: "Admin",
          email,
          passwordHash,
          role: "owner",
          isSuperAdmin: true,
        },
      },
    },
    include: { users: true },
  });

  console.log(`Super admin created:`);
  console.log(`  Email: ${email}`);
  console.log(`  Clinic: ${clinic.name} (${clinic.id})`);
  console.log(`  User: ${clinic.users[0].name} (${clinic.users[0].id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

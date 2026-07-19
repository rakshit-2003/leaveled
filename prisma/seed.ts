import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Leave types
  const leaveTypes = [
    { name: "Annual Leave", description: "Paid vacation days", defaultDays: 20, color: "#6366f1" },
    { name: "Sick Leave", description: "Medical / illness days", defaultDays: 10, color: "#f59e0b" },
    { name: "Personal Leave", description: "Personal errands", defaultDays: 3, color: "#10b981" },
    { name: "Maternity / Paternity", description: "Parental leave", defaultDays: 90, color: "#ec4899" },
  ];

  const createdTypes: { id: string; defaultDays: number }[] = [];
  for (const lt of leaveTypes) {
    const t = await db.leaveType.upsert({
      where: { name: lt.name },
      update: {},
      create: lt,
    });
    createdTypes.push({ id: t.id, defaultDays: t.defaultDays });
  }

  // Admin user
  const adminPw = await bcrypt.hash("Admin1234", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@demo.com",
      password: adminPw,
      role: "ADMIN",
      department: "HR",
    },
  });

  // Demo employee
  const demoPw = await bcrypt.hash("Demo1234", 12);
  const demo = await db.user.upsert({
    where: { email: "demo@demo.com" },
    update: {},
    create: {
      name: "Demo Employee",
      email: "demo@demo.com",
      password: demoPw,
      role: "EMPLOYEE",
      department: "Engineering",
    },
  });

  const year = new Date().getFullYear();
  const users = [admin, demo];

  for (const user of users) {
    for (const lt of createdTypes) {
      await db.leaveBalance.upsert({
        where: {
          userId_leaveTypeId_year: {
            userId: user.id,
            leaveTypeId: lt.id,
            year,
          },
        },
        update: {},
        create: {
          userId: user.id,
          leaveTypeId: lt.id,
          year,
          allocated: lt.defaultDays,
          used: 0,
          pending: 0,
        },
      });
    }
  }

  console.log("✅ Seed complete!");
  console.log("   Admin:    admin@demo.com / Admin1234");
  console.log("   Employee: demo@demo.com  / Demo1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());

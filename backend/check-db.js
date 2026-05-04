const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const user = await prisma.usuario.findFirst();
    console.log("DB Success, found user:", !!user);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();

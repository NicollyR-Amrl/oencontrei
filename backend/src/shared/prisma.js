// Instância compartilhada do Prisma Client
// Usar uma única instância evita múltiplas conexões ao banco

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;

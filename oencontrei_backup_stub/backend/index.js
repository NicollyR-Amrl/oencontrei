const Fastify = require('fastify');
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');
const fastifyStatic = require('@fastify/static');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream/promises');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const fastify = Fastify({ logger: true });

const UPLOAD_FOLDER = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER);
}

fastify.register(cors, { origin: '*' });

fastify.register(multipart);

fastify.register(fastifyStatic, {
  root: UPLOAD_FOLDER,
  prefix: '/uploads/',
});

fastify.get('/', async (request, reply) => {
  return { mensagem: 'API funcionando (Node/Fastify)' };
});

fastify.get('/objetos', async (request, reply) => {
  const objetos = await prisma.objeto.findMany({
    orderBy: {
      data_encontrado: 'desc'
    }
  });
  
  // Mapeamento para garantir mesma estrutura que o front-end legacy espera,
  // embora o Prisma já retorne as chaves corretas.
  return objetos.map(obj => ({
    id: obj.id,
    nome: obj.nome,
    descricao: obj.descricao,
    foto: obj.foto,
    local: obj.local_encontrado
  }));
});

fastify.post('/objetos', async (request, reply) => {
  const parts = request.parts();
  let nome = '';
  let descricao = '';
  let local_encontrado = '';
  let filename = '';

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'foto' && part.filename) {
      filename = `${Date.now()}-${part.filename}`;
      const savePath = path.join(UPLOAD_FOLDER, filename);
      await pipeline(part.file, fs.createWriteStream(savePath));
    } else {
      if (part.fieldname === 'nome') nome = part.value;
      if (part.fieldname === 'descricao') descricao = part.value;
      if (part.fieldname === 'local') local_encontrado = part.value;
    }
  }

  await prisma.objeto.create({
    data: {
      nome: nome,
      descricao: descricao,
      local_encontrado: local_encontrado,
      foto: filename || null
    }
  });

  return { mensagem: 'cadastrado' };
});

const start = async () => {
  try {
    await prisma.$connect();
    await fastify.listen({ port: 5000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

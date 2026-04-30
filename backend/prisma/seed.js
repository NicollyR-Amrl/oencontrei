const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpar banco
  await prisma.notificacao.deleteMany();
  await prisma.mensagem.deleteMany();
  await prisma.match.deleteMany();
  await prisma.item.deleteMany();
  await prisma.usuario.deleteMany();

  const senhaHash = await bcrypt.hash('123456', 10);

  // Criar usuários
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@escola.com',
      senha: senhaHash,
      cargo: 'ADMIN',
      reputacao: 100,
      turma: 'Diretoria'
    }
  });

  const nicolly = await prisma.usuario.create({
    data: {
      nome: 'Nicolly Rocha',
      email: 'nicolly@estudante.com',
      senha: senhaHash,
      cargo: 'ALUNO',
      reputacao: 25,
      turma: '3º Ano A'
    }
  });

  const joao = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao@estudante.com',
      senha: senhaHash,
      cargo: 'ALUNO',
      reputacao: 10,
      turma: '1º Ano B'
    }
  });

  // Criar itens
  const item1 = await prisma.item.create({
    data: {
      titulo: 'Casaco Azul Adidas',
      descricao: 'Esqueci no pátio perto da cantina. Tem um rasgo pequeno na manga direita.',
      categoria: 'ROUPA',
      tipo: 'PERDIDO',
      local: 'Pátio / Cantina',
      usuarioId: nicolly.id,
      status: 'ATIVO'
    }
  });

  const item2 = await prisma.item.create({
    data: {
      titulo: 'Chave de fenda amarela',
      descricao: 'Encontrei no laboratório de robótica.',
      categoria: 'OUTRO',
      tipo: 'ENCONTRADO',
      local: 'Laboratório de Robótica',
      usuarioId: joao.id,
      status: 'ATIVO'
    }
  });

  const item3 = await prisma.item.create({
    data: {
      titulo: 'Garrafa térmica preta',
      descricao: 'Encontrada na quadra de esportes.',
      categoria: 'GARRAFA',
      tipo: 'ENCONTRADO',
      local: 'Quadra',
      usuarioId: admin.id,
      status: 'ATIVO'
    }
  });

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

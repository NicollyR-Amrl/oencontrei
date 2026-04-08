// Serviço de Matching com IA
// Compara itens perdidos com encontrados e retorna score de compatibilidade

const stringSimilarity = require('string-similarity');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Calcula o score de compatibilidade entre dois itens
 * Pesos: texto (40%), categoria (30%), local (30%)
 */
function calcularScore(itemPerdido, itemEncontrado) {
  let scoreTotal = 0;

  // 1. Similaridade de texto (título + descrição) — peso 40%
  const textoPerdido = `${itemPerdido.titulo} ${itemPerdido.descricao}`.toLowerCase();
  const textoEncontrado = `${itemEncontrado.titulo} ${itemEncontrado.descricao}`.toLowerCase();
  const similaridadeTexto = stringSimilarity.compareTwoStrings(textoPerdido, textoEncontrado);
  scoreTotal += similaridadeTexto * 0.4;

  // 2. Mesma categoria — peso 30%
  if (itemPerdido.categoria === itemEncontrado.categoria) {
    scoreTotal += 0.3;
  }

  // 3. Similaridade de local — peso 30%
  const localPerdido = itemPerdido.local.toLowerCase();
  const localEncontrado = itemEncontrado.local.toLowerCase();
  const similaridadeLocal = stringSimilarity.compareTwoStrings(localPerdido, localEncontrado);
  scoreTotal += similaridadeLocal * 0.3;

  // Bônus: proximidade de data (até 7 dias → bônus de 10%)
  const diffDias = Math.abs(
    (new Date(itemPerdido.data) - new Date(itemEncontrado.data)) / (1000 * 60 * 60 * 24)
  );
  if (diffDias <= 1) {
    scoreTotal += 0.1;
  } else if (diffDias <= 3) {
    scoreTotal += 0.05;
  } else if (diffDias <= 7) {
    scoreTotal += 0.02;
  }

  // Limitar a 100%
  return Math.min(Math.round(scoreTotal * 100), 100);
}

/**
 * Buscar matches para um item perdido
 * Compara com todos os itens encontrados ativos
 */
async function buscarMatches(itemPerdidoId) {
  const itemPerdido = await prisma.item.findUnique({
    where: { id: itemPerdidoId }
  });

  if (!itemPerdido || itemPerdido.tipo !== 'PERDIDO') {
    throw new Error('Item perdido não encontrado');
  }

  // Buscar todos os itens encontrados ativos
  const itensEncontrados = await prisma.item.findMany({
    where: {
      tipo: 'ENCONTRADO',
      status: 'ATIVO'
    },
    include: {
      usuario: { select: { id: true, nome: true, avatar: true } }
    }
  });

  // Calcular score para cada item encontrado
  const resultados = itensEncontrados
    .map(itemEncontrado => ({
      itemEncontrado,
      score: calcularScore(itemPerdido, itemEncontrado)
    }))
    .filter(r => r.score >= 15) // Mínimo de 15% de compatibilidade
    .sort((a, b) => b.score - a.score);

  // Salvar/atualizar matches no banco
  for (const resultado of resultados) {
    const matchExistente = await prisma.match.findFirst({
      where: {
        itemPerdidoId: itemPerdidoId,
        itemEncontradoId: resultado.itemEncontrado.id
      }
    });

    if (matchExistente) {
      await prisma.match.update({
        where: { id: matchExistente.id },
        data: { score: resultado.score }
      });
    } else {
      await prisma.match.create({
        data: {
          itemPerdidoId: itemPerdidoId,
          itemEncontradoId: resultado.itemEncontrado.id,
          score: resultado.score
        }
      });
    }
  }

  return resultados;
}

/**
 * Buscar matches para um item encontrado
 * Compara com todos os itens perdidos ativos
 */
async function buscarMatchesParaEncontrado(itemEncontradoId) {
  const itemEncontrado = await prisma.item.findUnique({
    where: { id: itemEncontradoId }
  });

  if (!itemEncontrado || itemEncontrado.tipo !== 'ENCONTRADO') {
    throw new Error('Item encontrado não encontrado');
  }

  const itensPerdidos = await prisma.item.findMany({
    where: {
      tipo: 'PERDIDO',
      status: 'ATIVO'
    },
    include: {
      usuario: { select: { id: true, nome: true, avatar: true } }
    }
  });

  const resultados = itensPerdidos
    .map(itemPerdido => ({
      itemPerdido,
      score: calcularScore(itemPerdido, itemEncontrado)
    }))
    .filter(r => r.score >= 15)
    .sort((a, b) => b.score - a.score);

  return resultados;
}

module.exports = { calcularScore, buscarMatches, buscarMatchesParaEncontrado };

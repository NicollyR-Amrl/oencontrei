// Serviço de IA Integrado (Qwen 2.5 via OpenRouter)
// Suporta: Matching Semântico, Auto-categorização, Assistente de Chat e Relatórios Admin

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Função utilitária para chamar a API OpenRouter (Qwen)
 */
async function chamarQwen(prompt, systemPrompt = 'Você é um assistente IA útil e amigável da plataforma de achados e perdidos da escola O Encontrei!.', maxTokens = 1200, temperature = 0.3) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const modelo = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning';

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://oencontrei.app',
        'X-Title': 'O Encontrei'
      },
      body: JSON.stringify({
        model: modelo,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: Math.max(maxTokens, 1000),
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ Erro OpenRouter API (${response.status}):`, errText);
      return null;
    }

    const data = await response.json();
    const msg = data.choices?.[0]?.message;
    const content = msg?.content?.trim() || null;
    return content;
  } catch (err) {
    console.error('❌ Erro de conexão com IA:', err.message);
    return null;
  }
}

/**
 * 1. Calcula score de compatibilidade entre item perdido e encontrado (0 a 100)
 */
async function calcularScoreIA(itemPerdido, itemEncontrado) {
  const prompt = `Compare o item PERDIDO com o item ENCONTRADO e dê um score de compatibilidade de 0 a 100.

ITEM PERDIDO:
- Título: ${itemPerdido.titulo}
- Descrição: ${itemPerdido.descricao}
- Categoria: ${itemPerdido.categoria}
- Local: ${itemPerdido.local}
- Data: ${new Date(itemPerdido.data).toLocaleDateString('pt-BR')}

ITEM ENCONTRADO:
- Título: ${itemEncontrado.titulo}
- Descrição: ${itemEncontrado.descricao}
- Categoria: ${itemEncontrado.categoria}
- Local: ${itemEncontrado.local}
- Data: ${new Date(itemEncontrado.data).toLocaleDateString('pt-BR')}

Considere se parecem o mesmo objeto, proximidade de local e data.
Responda APENAS com um número inteiro de 0 a 100. Nada mais.`;

  const resposta = await chamarQwen(
    prompt,
    'Você é um assistente escolar especialista em identificar objetos perdidos. Responda apenas números.',
    10,
    0.1
  );

  if (!resposta) return null;

  const score = parseInt(resposta, 10);
  if (isNaN(score) || score < 0 || score > 100) return null;

  console.log(`🤖 IA Score Qwen: ${score} | "${itemPerdido.titulo}" ↔ "${itemEncontrado.titulo}"`);
  return score;
}

/**
 * 2. Sugere a melhor Categoria e Aprimora a Descrição de um Item
 */
async function sugerirCategoriaEMelhorarDescricao(titulo, descricaoAtual = '') {
  const categoriasValidas = ['ELETRONICO', 'ROUPA', 'MATERIAL_ESCOLAR', 'ACESSORIO', 'DOCUMENTO', 'CHAVE', 'GARRAFA', 'OUTRO'];

  const prompt = `Analise este item de achados e perdidos da escola:
Título: "${titulo}"
Descrição: "${descricaoAtual}"

Selecione a categoria mais adequada entre: [ELETRONICO, ROUPA, MATERIAL_ESCOLAR, ACESSORIO, DOCUMENTO, CHAVE, GARRAFA, OUTRO].

Format de resposta:
CATEGORIA: <CATEGORIA_ESCOLHIDA>
DESCRICAO: <Escreva aqui uma descrição melhorada e detalhada em português para ajudar no matching>`;

  const resposta = await chamarQwen(
    prompt,
    'Você é um assistente escolar especializado em categorizar e detalhar objetos perdidos.',
    400,
    0.1
  );

  if (!resposta) {
    return { categoria: 'OUTRO', descricaoAprimorada: descricaoAtual || titulo, tags: [] };
  }

  let categoriaEncontrada = 'OUTRO';
  for (const cat of categoriasValidas) {
    if (resposta.toUpperCase().includes(`CATEGORIA: ${cat}`) || resposta.toUpperCase().includes(cat)) {
      categoriaEncontrada = cat;
      break;
    }
  }

  let descricaoMelhorada = descricaoAtual || titulo;
  const matchDesc = resposta.match(/DESCRICAO:\s*([\s\S]+)/i);
  if (matchDesc && matchDesc[1].trim()) {
    descricaoMelhorada = matchDesc[1].trim();
  }

  return {
    categoria: categoriaEncontrada,
    descricaoAprimorada: descricaoMelhorada,
    tags: [categoriaEncontrada.toLowerCase()]
  };
}

/**
 * 3. Assistente de Conversa Virtual (Chatbot O Encontrei!)
 */
async function conversarAssistente(mensagemUsuario, historico = []) {
  // Buscar itens ativos mais recentes do banco para alimentar a IA com contexto real
  let itensRecentes = [];
  try {
    itensRecentes = await prisma.item.findMany({
      where: { status: 'ATIVO' },
      take: 10,
      orderBy: { criadoEm: 'desc' },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        categoria: true,
        tipo: true,
        local: true,
        criadoEm: true
      }
    });
  } catch (err) {
    console.error('Erro ao carregar itens para o assistente IA:', err.message);
  }

  const contextoItens = itensRecentes.map(item => 
    `- [${item.tipo}] ${item.titulo} (${item.categoria}) no local "${item.local}". Descrição: ${item.descricao}`
  ).join('\n');

  const systemPrompt = `Você é o EncontreiBot 🤖, o assistente virtual inteligente da plataforma de Achados e Perdidos da escola "O Encontrei!".
Você ajuda alunos, professores e funcionários a tirar dúvidas, dar dicas para recuperar objetos e informar sobre achados recentes.

Aqui estão os itens cadastrados recentemente na plataforma:
${contextoItens || 'Nenhum item recente cadastrado no momento.'}

Diretrizes:
- Seja sempre amigável, educado e empático (usando emojis).
- Se o usuário perguntar se um item foi encontrado, verifique a lista de itens acima e responda de forma clara.
- Dê instruções sobre como cadastrar itens ou ir até o pátio/secretaria para retirar seu objeto.
- Mantenha respostas relativamente curtas e diretas.`;

  const promptFinal = `Mensagem do aluno: "${mensagemUsuario}"`;

  const resposta = await chamarQwen(promptFinal, systemPrompt, 400, 0.5);
  return resposta || 'Olá! Sou o EncontreiBot 🤖. No momento estou enfrentando instabilidades, mas você pode navegar pelas abas de Itens e Matches para buscar seus objetos!';
}

/**
 * 4. Relatório e Diagnóstico Executivo para o Administrador
 */
async function gerarRelatorioAdmin() {
  try {
    const totalItens = await prisma.item.count();
    const perdidos = await prisma.item.count({ where: { tipo: 'PERDIDO' } });
    const encontrados = await prisma.item.count({ where: { tipo: 'ENCONTRADO' } });
    const devolvidos = await prisma.item.count({ where: { status: 'DEVOLVIDO' } });
    const totalMatches = await prisma.match.count();

    const dados = `
- Total de Itens Registrados: ${totalItens}
- Itens Perdidos: ${perdidos}
- Itens Encontrados: ${encontrados}
- Itens Devolvidos com Sucesso: ${devolvidos}
- Taxa de Devolução: ${totalItens > 0 ? Math.round((devolvidos / totalItens) * 100) : 0}%
- Total de Correspondências (Matches) Geradas: ${totalMatches}
    `;

    const prompt = `Analise os dados da plataforma de achados e perdidos da escola e gere um relatório executivo curto (em markdown) com 3 tópicos:
1. 📊 Diagnóstico Geral da Escola
2. 💡 Destaques & Eficiência
3. 🚀 Recomendações da IA para a gestão escolar

Dados:
${dados}`;

    const resposta = await chamarQwen(
      prompt,
      'Você é um consultor analista de dados especialista em gestão escolar. Responda em markdown elegante e bem estruturado.',
      500,
      0.3
    );

    return resposta || 'Serviço de relatórios indisponível no momento.';
  } catch (err) {
    console.error('Erro ao gerar relatório admin:', err.message);
    return 'Erro ao compilar dados estatísticos para o relatório.';
  }
}

/**
 * Verifica se a IA está ativa
 */
function iaDisponivel() {
  return !!process.env.OPENROUTER_API_KEY;
}

module.exports = {
  calcularScoreIA,
  sugerirCategoriaEMelhorarDescricao,
  conversarAssistente,
  gerarRelatorioAdmin,
  iaDisponivel
};

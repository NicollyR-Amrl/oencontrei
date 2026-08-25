// Serviço de IA Integrado (Qwen 2.5 via OpenRouter)
// Suporta: Matching Semântico, Auto-categorização, Assistente de Chat e Relatórios Admin

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const CATEGORIAS_VALIDAS = ['ELETRONICO', 'ROUPA', 'MATERIAL_ESCOLAR', 'ACESSORIO', 'DOCUMENTO', 'CHAVE', 'GARRAFA', 'OUTRO'];

const CATEGORIAS_KEYWORDS = {
  GARRAFA: [
    'garrafa', 'garrafinha', 'copo', 'squeeze', 'stanley', 'caneca', 'cantil', 
    'termica', 'térmica', 'tupperware', 'shaker', 'coqueteleira', 'mamadeira', 'garrafao', 'garrafão', 'hidratação'
  ],
  ELETRONICO: [
    'celular', 'fone', 'headphone', 'earphone', 'airpod', 'airpods', 'buds',
    'carregador', 'cabo', 'notebook', 'laptop', 'tablet', 'ipad', 'kindle',
    'smartwatch', 'smart watch', 'pendrive', 'pen drive', 'mouse', 'teclado',
    'calculadora', 'power bank', 'powerbank', 'bateria', 'adaptador', 'usb',
    'iphone', 'samsung', 'motorola', 'xiaomi', 'computador', 'headset', 'caixa de som', 'jbl'
  ],
  ROUPA: [
    'casaco', 'jaqueta', 'moletom', 'blusa', 'camiseta', 'camisa', 'calça', 'calca',
    'bermuda', 'short', 'shorts', 'uniforme', 'agasalho', 'touca', 'luva', 'tenis', 'tênis',
    'sapato', 'chinelo', 'sandalia', 'sandália', 'meia', 'cachecol', 'sobretudo',
    'regata', 'saia', 'vestido', 'bone', 'boné'
  ],
  MATERIAL_ESCOLAR: [
    'estojo', 'caderno', 'livro', 'apostila', 'caneta', 'lapis', 'lápis', 'borracha',
    'regua', 'régua', 'mochila', 'pasta', 'fichario', 'fichário', 'marca texto', 'marcatexto',
    'marca-texto', 'corretivo', 'apontador', 'tesoura', 'compasso', 'transferidor',
    'agenda', 'bloco de notas', 'papel', 'folha', 'porta lapis'
  ],
  ACESSORIO: [
    'oculos', 'óculos', 'brinco', 'colar', 'corrente', 'anel', 'pulseira',
    'relogio', 'relógio', 'laco', 'laço', 'tiara', 'presilha', 'cinto',
    'carteira', 'bolsa', 'pochete', 'cordao', 'cordão', 'bandana', 'guarda chuva',
    'guarda-chuva', 'sombrinha'
  ],
  DOCUMENTO: [
    'rg', 'cpf', 'cnh', 'carteirinha', 'cracha', 'crachá', 'passe', 'bilhete',
    'cartao', 'cartão', 'identidade', 'titulo', 'título', 'passaporte', 'comprovante'
  ],
  CHAVE: [
    'chave', 'chaves', 'chaveiro', 'tag', 'controle de portao', 'controle remoto',
    'chave do carro', 'chave de moto', 'chave de casa'
  ]
};

/**
 * Classificação heurística local por palavras-chave
 */
function classificarPorHeuristica(texto) {
  const t = (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [cat, keywords] of Object.entries(CATEGORIAS_KEYWORDS)) {
    for (const kw of keywords) {
      const kwNorm = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const regex = new RegExp(`\\b${kwNorm}\\b`, 'i');
      if (regex.test(t)) {
        return cat;
      }
    }
  }
  return 'OUTRO';
}

/**
 * Gerador de descrição detalhada local
 */
function gerarDescricaoLocal(titulo, descricaoAtual, categoria) {
  const tit = (titulo || '').trim();
  const desc = (descricaoAtual || '').trim();
  
  if (desc.length >= 40 && desc.toLowerCase() !== tit.toLowerCase()) {
    return desc;
  }

  const templates = {
    GARRAFA: `Garrafa ou copo tipo squeeze/térmico (${tit}). Item em bom estado de conservação, de uso pessoal para bebidas. Recomenda-se verificar detalhes específicos como cor exata, marca, adesivos ou capacidade para confirmação de propriedade.`,
    ELETRONICO: `Dispositivo eletrônico (${tit}). Aparelho em bom estado de conservação, recolhido nas dependências da instituição. Favor verificar marca, modelo, número de série ou acessórios para retirada segura.`,
    ROUPA: `Peça de vestuário (${tit}). Encontra-se limpa e bem conservada, sem danos aparentes. O proprietário deve conferir tamanho, marca e etiquetas para identificação.`,
    MATERIAL_ESCOLAR: `Item de material escolar (${tit}). Indispensável para rotina de estudos, em ótimo estado de uso. Favor verificar se há etiquetas com nome, turma ou características marcantes.`,
    ACESSORIO: `Acessório de uso pessoal (${tit}). Item bem conservado e com detalhes característicos. Verifique marcas de uso, fechos ou gravações para identificação.`,
    DOCUMENTO: `Documento ou identificação pessoal (${tit}). Guardado com segurança para proteção dos dados do titular. A retirada deve ser feita mediante apresentação de comprovante ou dados cadastrais.`,
    CHAVE: `Chave(s) com ou sem chaveiro (${tit}). Objeto essencial recolhido no ambiente escolar. Favor descrever o chaveiro, quantidade de chaves ou detalhes do segredo para conferência.`,
    OUTRO: `Item identificado como "${tit}". Encontra-se guardado e disponível para identificação e retirada pelo proprietário mediante descrição de características específicas.`
  };

  const baseDesc = templates[categoria] || templates.OUTRO;
  if (desc && desc.toLowerCase() !== tit.toLowerCase()) {
    return `${baseDesc} Observação adicional: ${desc}.`;
  }
  return baseDesc;
}

/**
 * Função utilitária para chamar a API OpenRouter (Qwen / Nemotron)
 */
async function chamarQwen(prompt, systemPrompt = 'Você é um assistente IA útil e amigável da plataforma de achados e perdidos da escola O Encontrei!.', maxTokens = 1200, temperature = 0.3) {
  const apiKey = process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.trim() : null;
  if (!apiKey) return null;

  const modelo = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
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
        max_tokens: Math.max(maxTokens, 600),
        temperature: temperature
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ Erro OpenRouter API (${response.status}):`, errText);
      return null;
    }

    const data = await response.json();
    const msg = data.choices?.[0]?.message;
    let content = msg?.content?.trim() || null;
    if (content) {
      // Remove tags <think>...</think> se existirem no retorno do modelo
      content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }
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

  const match = resposta.match(/\b\d{1,3}\b/);
  if (!match) return null;

  const score = parseInt(match[0], 10);
  if (isNaN(score) || score < 0 || score > 100) return null;

  console.log(`🤖 IA Score: ${score} | "${itemPerdido.titulo}" ↔ "${itemEncontrado.titulo}"`);
  return score;
}

/**
 * 2. Sugere a melhor Categoria e Aprimora a Descrição de um Item
 */
async function sugerirCategoriaEMelhorarDescricao(titulo, descricaoAtual = '') {
  const categoriaHeuristica = classificarPorHeuristica(`${titulo} ${descricaoAtual}`);
  
  const prompt = `Você é um assistente da plataforma de Achados e Perdidos da escola "O Encontrei!".
Analise as informações do item e realize duas tarefas:
1. Escolha a categoria mais apropriada dentre as opções:
   - ELETRONICO (celulares, fones de ouvido, carregadores, notebooks, smartwatches, etc)
   - ROUPA (casacos, moletom, camisetas, calças, uniformes, sapatos, tênis, etc)
   - MATERIAL_ESCOLAR (estojos, cadernos, livros, canetas, lápis, mochilas, réguas, etc)
   - ACESSORIO (óculos, relógios, anéis, colares, bonés, etc)
   - DOCUMENTO (carteirinhas, RGs, crachás, passes, carteiras, etc)
   - CHAVE (chaves, chaveiros, controles)
   - GARRAFA (garrafas de água, squeezes, copos térmicos, canecas, cantis)
   - OUTRO (apenas se realmente não se encaixar em nenhuma das categorias acima)

2. Crie uma descrição aprimorada, detalhada e bem redigida em português (2 a 4 frases), destacando características prováveis (como cor, material, formato, detalhes de conservação ou recomendações de identificação) para facilitar que o dono ou quem encontrou consiga identificar o item.

Item a analisar:
- Título: "${titulo}"
- Descrição informada: "${descricaoAtual || 'Não informada'}"

Responda ESTRITAMENTE em formato JSON com as chaves "categoria" e "descricaoAprimorada":
{
  "categoria": "GARRAFA",
  "descricaoAprimorada": "Garrafa de água modelo squeeze na cor azul, com tampa de rosca e capacidade aproximada de 500ml a 750ml. Objeto em ótimo estado de conservação, de uso escolar diário. Recomenda-se conferir eventuais marcas, adesivos ou nome do titular gravado para confirmação."
}`;

  const resposta = await chamarQwen(
    prompt,
    'Você é um assistente escolar especializado em categorizar e detalhar objetos perdidos. Responda exclusivamente em formato JSON.',
    500,
    0.2
  );

  let categoriaFinal = categoriaHeuristica !== 'OUTRO' ? categoriaHeuristica : 'OUTRO';
  let descricaoFinal = '';

  if (resposta) {
    try {
      // Tentar extrair bloco JSON se o modelo respondeu com markdown
      const jsonMatch = resposta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.categoria && CATEGORIAS_VALIDAS.includes(parsed.categoria.toUpperCase())) {
          categoriaFinal = parsed.categoria.toUpperCase();
        }
        if (parsed.descricaoAprimorada && typeof parsed.descricaoAprimorada === 'string') {
          descricaoFinal = parsed.descricaoAprimorada.trim();
        }
      }
    } catch (e) {
      console.warn('Não foi possível fazer parse JSON direto da IA, tentando regex:', e.message);
      for (const cat of CATEGORIAS_VALIDAS) {
        if (resposta.toUpperCase().includes(`"CATEGORIA": "${cat}"`) || resposta.toUpperCase().includes(`CATEGORIA: ${cat}`)) {
          categoriaFinal = cat;
          break;
        }
      }
      const matchDesc = resposta.match(/DESCRICAO(?:APRIMORADA)?:\s*([\s\S]+)/i);
      if (matchDesc && matchDesc[1].trim()) {
        descricaoFinal = matchDesc[1].trim().replace(/^["'`]|["'`]$/g, '');
      }
    }
  }

  // Se a IA escolheu 'OUTRO', mas as palavras-chave indicam uma categoria óbvia (ex: garrafa, casaco, fone)
  if (categoriaFinal === 'OUTRO' && categoriaHeuristica !== 'OUTRO') {
    categoriaFinal = categoriaHeuristica;
  }

  // Se a descrição melhorada ficou vazia, curta ou apenas repetiu o título
  if (!descricaoFinal || descricaoFinal.length < 20 || descricaoFinal.trim().toLowerCase() === titulo.trim().toLowerCase()) {
    descricaoFinal = gerarDescricaoLocal(titulo, descricaoAtual, categoriaFinal);
  }

  return {
    categoria: categoriaFinal,
    descricaoAprimorada: descricaoFinal,
    tags: [categoriaFinal.toLowerCase()]
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

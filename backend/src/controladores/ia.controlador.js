// Controlador da API de IA (Qwen)
const {
  sugerirCategoriaEMelhorarDescricao,
  conversarAssistente,
  gerarRelatorioAdmin,
  iaDisponivel
} = require('../features/matching/ia.servico');

/**
 * Auto-categorização e aprimoramento de descrição
 * POST /api/ia/sugerir-categoria
 */
const sugerirCategoria = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    if (!titulo) {
      return res.status(400).json({ erro: true, mensagem: 'Título é obrigatório' });
    }

    const resultado = await sugerirCategoriaEMelhorarDescricao(titulo, descricao);
    res.json({ sucesso: true, ...resultado });
  } catch (erro) {
    console.error('Erro ao sugerir categoria com IA:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao consultar IA' });
  }
};

/**
 * Conversar com o assistente EncontreiBot
 * POST /api/ia/chat
 */
const chatAssistente = async (req, res) => {
  try {
    const { mensagem, historico } = req.body;
    if (!mensagem) {
      return res.status(400).json({ erro: true, mensagem: 'Mensagem é obrigatória' });
    }

    const resposta = await conversarAssistente(mensagem, historico);
    res.json({ sucesso: true, resposta });
  } catch (erro) {
    console.error('Erro no assistente de IA:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao conversar com a IA' });
  }
};

/**
 * Relatório executivo de IA para o Administrador
 * GET /api/ia/resumo-admin
 */
const resumoAdmin = async (req, res) => {
  try {
    const relatorio = await gerarRelatorioAdmin();
    res.json({ sucesso: true, relatorio });
  } catch (erro) {
    console.error('Erro ao gerar resumo admin:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao gerar relatório' });
  }
};

/**
 * Status da IA
 * GET /api/ia/status
 */
const statusIA = (req, res) => {
  res.json({
    sucesso: true,
    disponivel: iaDisponivel(),
    modelo: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning'
  });
};

module.exports = {
  sugerirCategoria,
  chatAssistente,
  resumoAdmin,
  statusIA
};

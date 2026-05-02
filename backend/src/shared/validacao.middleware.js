// Middleware de validação de dados de entrada

/**
 * Valida os campos de cadastro de usuário
 */
const validarCadastro = (req, res, next) => {
  const { nome, email, senha } = req.body;
  const erros = [];

  if (!nome || nome.trim().length < 2) {
    erros.push('Nome deve ter pelo menos 2 caracteres');
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    erros.push('Email inválido');
  }

  if (!senha || senha.length < 6) {
    erros.push('Senha deve ter pelo menos 6 caracteres');
  }

  if (erros.length > 0) {
    return res.status(400).json({ erro: true, mensagem: 'Dados inválidos', detalhes: erros });
  }

  next();
};

/**
 * Valida os campos de criação de item
 */
const validarItem = (req, res, next) => {
  const { titulo, descricao, categoria, tipo, local } = req.body;
  const erros = [];

  if (!titulo || titulo.trim().length < 3) {
    erros.push('Título deve ter pelo menos 3 caracteres');
  }

  if (!descricao || descricao.trim().length < 10) {
    erros.push('Descrição deve ter pelo menos 10 caracteres');
  }

  const categoriasValidas = [
    'ELETRONICO', 'ROUPA', 'MATERIAL_ESCOLAR', 'ACESSORIO',
    'DOCUMENTO', 'CHAVE', 'GARRAFA', 'OUTRO'
  ];
  if (!categoria || !categoriasValidas.includes(categoria)) {
    erros.push(`Categoria deve ser uma das: ${categoriasValidas.join(', ')}`);
  }

  const tiposValidos = ['PERDIDO', 'ENCONTRADO'];
  if (!tipo || !tiposValidos.includes(tipo)) {
    erros.push('Tipo deve ser PERDIDO ou ENCONTRADO');
  }

  if (!local || local.trim().length < 3) {
    erros.push('Local deve ter pelo menos 3 caracteres');
  }

  if (erros.length > 0) {
    return res.status(400).json({ erro: true, mensagem: 'Dados inválidos', detalhes: erros });
  }

  next();
};

/**
 * Valida login
 */
const validarLogin = (req, res, next) => {
  const { email, senha } = req.body;
  const erros = [];

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    erros.push('Email inválido');
  }

  if (!senha) {
    erros.push('Senha é obrigatória');
  }

  if (erros.length > 0) {
    return res.status(400).json({ erro: true, mensagem: 'Dados inválidos', detalhes: erros });
  }

  next();
};

module.exports = { validarCadastro, validarItem, validarLogin };

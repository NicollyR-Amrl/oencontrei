// Middleware de upload de imagens usando Multer

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garantir que o diretório de uploads existe
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extensao = path.extname(file.originalname);
    cb(null, `${nomeUnico}${extensao}`);
  }
});

// Filtro de tipos de arquivo
const filtroArquivo = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extensaoValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimetypeValido = tiposPermitidos.test(file.mimetype);

  if (extensaoValida && mimetypeValido) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter: filtroArquivo,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = { upload };

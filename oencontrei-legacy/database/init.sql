DROP TABLE IF EXISTS objetos;

CREATE TABLE objetos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100),
 descricao TEXT,
 categoria VARCHAR(50),
 foto VARCHAR(255),
 local_encontrado VARCHAR(100),
 data_encontrado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
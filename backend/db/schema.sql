-- =====================================================
-- Adopta — Schema do banco de dados
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------
-- Tabela: usuarios
-- ----------------------------------------------------
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  senha_hash    VARCHAR(255) NOT NULL,
  telefone      VARCHAR(20),
  cidade        VARCHAR(80),
  estado        CHAR(2),
  role          ENUM('adotante','admin') NOT NULL DEFAULT 'adotante',
  criado_em     DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Tabela: pets
-- ----------------------------------------------------
DROP TABLE IF EXISTS pets;
CREATE TABLE pets (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  nome                VARCHAR(60),
  especie             ENUM('cachorro','gato','outro') NOT NULL,
  raca                VARCHAR(80) DEFAULT 'SRD',
  sexo                ENUM('macho','femea') NOT NULL,
  idade_aprox_meses   INT,
  porte               ENUM('pequeno','medio','grande') NOT NULL,
  peso_kg             DECIMAL(5,2),
  cor_pelagem         VARCHAR(80),
  castrado            BOOLEAN DEFAULT FALSE,
  vermifugado         BOOLEAN DEFAULT FALSE,
  descricao           TEXT,
  historia            TEXT,
  status              ENUM('disponivel','em_processo','adotado') DEFAULT 'disponivel',
  cidade              VARCHAR(80),
  estado              CHAR(2),
  abrigo              VARCHAR(120),
  data_resgate        DATE,
  microchip           VARCHAR(40),
  bom_com_criancas    BOOLEAN,
  bom_com_outros_pets BOOLEAN,
  bom_em_apartamento  BOOLEAN,
  criado_em           DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_especie (especie),
  INDEX idx_cidade (cidade),
  INDEX idx_porte (porte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Tabela: pet_fotos (base64 inline)
-- ----------------------------------------------------
DROP TABLE IF EXISTS pet_fotos;
CREATE TABLE pet_fotos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  pet_id        INT NOT NULL,
  foto_base64   LONGTEXT NOT NULL,
  mime_type     VARCHAR(40) NOT NULL DEFAULT 'image/jpeg',
  ordem         INT DEFAULT 0,
  eh_principal  BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  INDEX idx_pet (pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Tabela: pet_vacinas
-- ----------------------------------------------------
DROP TABLE IF EXISTS pet_vacinas;
CREATE TABLE pet_vacinas (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  pet_id            INT NOT NULL,
  nome_vacina       VARCHAR(80) NOT NULL,
  data_aplicacao    DATE NOT NULL,
  proxima_dose      DATE,
  observacoes       VARCHAR(255),
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  INDEX idx_pet (pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Tabela: pet_tags (temperamento/personalidade)
-- ----------------------------------------------------
DROP TABLE IF EXISTS pet_tags;
CREATE TABLE pet_tags (
  pet_id  INT NOT NULL,
  tag     VARCHAR(40) NOT NULL,
  PRIMARY KEY (pet_id, tag),
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Tabela: solicitacoes_adocao
-- ----------------------------------------------------
DROP TABLE IF EXISTS solicitacoes_adocao;
CREATE TABLE solicitacoes_adocao (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pet_id          INT NOT NULL,
  usuario_id      INT NOT NULL,
  mensagem        TEXT NOT NULL,
  status          ENUM('pendente','aprovada','rejeitada','concluida') DEFAULT 'pendente',
  resposta_admin  TEXT,
  criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id)     REFERENCES pets(id)     ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_pet (pet_id),
  INDEX idx_usuario (usuario_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

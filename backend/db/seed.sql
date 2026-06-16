-- =====================================================
-- Adopta — Seed inicial (pets, fotos placeholder, vacinas, tags)
-- Os usuários (admin + adotantes) são criados pelo bootstrap do backend
-- com senhas hasheadas via bcrypt.
-- =====================================================

SET NAMES utf8mb4;

-- ----------------------------------------------------
-- Variável: SVG placeholder usado como foto inicial
-- ----------------------------------------------------
SET @placeholder_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FBEF76"/><stop offset="50%" stop-color="#FEC288"/><stop offset="100%" stop-color="#FD8A6B"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><g fill="#2B1810" opacity="0.85" transform="translate(200,220)"><ellipse cx="0" cy="20" rx="55" ry="48"/><circle cx="-58" cy="-38" r="24"/><circle cx="-24" cy="-66" r="20"/><circle cx="24" cy="-66" r="20"/><circle cx="58" cy="-38" r="24"/></g><text x="200" y="350" font-family="Georgia,serif" font-size="22" fill="#2B1810" text-anchor="middle" opacity="0.7">Adopta</text></svg>';

-- ----------------------------------------------------
-- 15 Pets
-- ----------------------------------------------------
INSERT INTO pets (id, nome, especie, raca, sexo, idade_aprox_meses, porte, peso_kg, cor_pelagem, castrado, vermifugado, descricao, historia, status, cidade, estado, abrigo, data_resgate, bom_com_criancas, bom_com_outros_pets, bom_em_apartamento) VALUES
(1, 'Bidu',      'cachorro', 'SRD',             'macho', 24, 'medio',    14.5, 'caramelo',         TRUE,  TRUE,  'Dócil, adora um colo e uma janela aberta pro mundo passar.',                'Resgatado de uma rodovia em Campinas. Tem cicatriz na pata mas isso não atrapalha a felicidade dele.', 'disponivel', 'São Paulo',      'SP', 'Lar Esperança',     '2025-02-10', TRUE,  TRUE,  TRUE),
(2, 'Maju',      'gato',     'SRD',             'femea', 12, 'pequeno',   3.2, 'tricolor',         TRUE,  TRUE,  'Tímida no começo, mas quando confia vira sombra.',                          'Chegou no abrigo dentro de uma caixa de papelão. Hoje gosta de assistir filme com a gente.',           'disponivel', 'Belo Horizonte', 'MG', 'Anjos de 4 Patas',  '2025-04-20', TRUE,  FALSE, TRUE),
(3, 'Thor',      'cachorro', 'Labrador',        'macho', 36, 'grande',   28.0, 'amarelo',          TRUE,  TRUE,  'Brincalhão, energia infinita, ama água e bolinha.',                         'Era de uma família que mudou de cidade. Precisa de espaço pra correr.',                                'disponivel', 'Porto Alegre',   'RS', 'Patinhas Felizes',  '2025-05-05', TRUE,  TRUE,  FALSE),
(4, 'Mel',       'cachorro', 'SRD',             'femea',  6, 'pequeno',   4.8, 'branca com manchas',FALSE, TRUE, 'Filhote, ainda aprendendo as regras da casa.',                              'Nasceu no abrigo. Mãe foi resgatada grávida.',                                                          'disponivel', 'Curitiba',       'PR', 'ONG Resgate',       '2025-12-01', TRUE,  TRUE,  TRUE),
(5, 'Frajola',   'gato',     'SRD',             'macho', 48, 'medio',     5.5, 'preto',            TRUE,  TRUE,  'Independente, gosta de observar de longe. Companheiro silencioso.',         'Vivia na rua há anos. Hoje prefere o sofá.',                                                            'disponivel', 'Rio de Janeiro', 'RJ', 'Casa dos Bichos',   '2024-11-15', FALSE, FALSE, TRUE),
(6, 'Pituca',    'cachorro', 'Poodle',          'femea', 84, 'pequeno',   6.2, 'preta',            TRUE,  TRUE,  'Idosa, calminha, busca um cantinho quentinho pra envelhecer com carinho.',  'Foi devolvida pela família anterior quando ficou idosa. Merece um lar pra sempre.',                    'disponivel', 'São Paulo',      'SP', 'Lar Esperança',     '2025-01-08', TRUE,  TRUE,  TRUE),
(7, 'Simba',     'gato',     'SRD',             'macho', 18, 'medio',     4.7, 'laranja',          TRUE,  TRUE,  'Sociável até demais. Vai te receber na porta todo dia.',                     'Chegou junto com a irmã. A irmã já foi adotada.',                                                       'em_processo','Florianópolis',  'SC', 'Patinhas Felizes',  '2025-03-12', TRUE,  TRUE,  TRUE),
(8, 'Bolinha',   'cachorro', 'SRD',             'macho', 30, 'pequeno',   7.0, 'caramelo',         TRUE,  TRUE,  'Assustadiço. Precisa de paciência e um ambiente tranquilo.',                'Veio de uma situação de maus-tratos. Está se recuperando.',                                            'disponivel', 'Belo Horizonte', 'MG', 'Anjos de 4 Patas',  '2025-06-22', FALSE, TRUE,  TRUE),
(9, 'Lua',       'gato',     'Siamês',          'femea', 24, 'pequeno',   3.8, 'creme com pontos', TRUE,  TRUE,  'Elegante, conversadeira, vai te contar do dia dela toda hora.',             'Foi entregue pelos tutores que se mudaram pro exterior.',                                              'disponivel', 'São Paulo',      'SP', 'Casa dos Bichos',   '2025-08-30', TRUE,  TRUE,  TRUE),
(10,'Rex',       'cachorro', 'Pastor Alemão',   'macho', 60, 'grande',   32.5, 'preto com fogo',   TRUE,  TRUE,  'Protetor, leal, precisa de um tutor experiente.',                            'Trabalhou como cão de guarda. Hoje busca uma família.',                                                'disponivel', 'Porto Alegre',   'RS', 'ONG Resgate',       '2024-12-18', FALSE, FALSE, FALSE),
(11,'Pingo',     'gato',     'SRD',             'macho',  3, 'pequeno',   1.4, 'cinza',            FALSE, TRUE,  'Filhote, pura travessura. Vai te roubar o coração e os fones de ouvido.',   'Achado dentro do motor de um carro. Hoje só conhece colinho.',                                          'disponivel', 'Curitiba',       'PR', 'Patinhas Felizes',  '2026-03-10', TRUE,  TRUE,  TRUE),
(12,'Princesa',  'cachorro', 'Yorkshire',       'femea', 96, 'pequeno',   3.5, 'cinza e castanho', TRUE,  TRUE,  'Idosa, mas com a alma de filhote. Adora colo e cobertor.',                  'Foi resgatada de um criadouro irregular.',                                                              'disponivel', 'Rio de Janeiro', 'RJ', 'Lar Esperança',     '2025-07-04', TRUE,  TRUE,  TRUE),
(13,'Toby',      'cachorro', 'Beagle',          'macho', 18, 'medio',    12.0, 'tricolor',         TRUE,  TRUE,  'Energético, curioso, vai farejar até a sua sombra.',                         'Era de uma família que não tinha mais tempo pra ele.',                                                  'em_processo','Florianópolis',  'SC', 'Casa dos Bichos',   '2025-09-15', TRUE,  TRUE,  FALSE),
(14,'Mia',       'gato',     'Persa',           'femea', 36, 'pequeno',   4.2, 'branca',           TRUE,  TRUE,  'Mimada nível mestrado. Quer ser servida, não convivida.',                   'Devolvida pela família por reclamação de pelos.',                                                       'disponivel', 'São Paulo',      'SP', 'Anjos de 4 Patas',  '2025-10-22', FALSE, FALSE, TRUE),
(15,'Caju',      'cachorro', 'SRD',             'macho', 12, 'medio',    11.5, 'caramelo',         FALSE, TRUE,  'Recém-resgatado, ainda aprendendo a confiar. Mas balança o rabo todo.',     'Encontrado vagando em uma feira. Ninguém procurou por ele.',                                            'disponivel', 'Belo Horizonte', 'MG', 'ONG Resgate',       '2026-04-05', TRUE,  TRUE,  TRUE);

-- ----------------------------------------------------
-- Foto placeholder para cada pet
-- ----------------------------------------------------
INSERT INTO pet_fotos (pet_id, foto_base64, mime_type, ordem, eh_principal)
SELECT id, TO_BASE64(@placeholder_svg), 'image/svg+xml', 0, TRUE FROM pets;

-- ----------------------------------------------------
-- Tags / temperamento
-- ----------------------------------------------------
INSERT INTO pet_tags (pet_id, tag) VALUES
(1, 'dócil'),(1, 'companheiro'),(1, 'caseiro'),
(2, 'tímida'),(2, 'observadora'),
(3, 'brincalhão'),(3, 'enérgico'),(3, 'sociável'),
(4, 'filhote'),(4, 'curiosa'),
(5, 'independente'),(5, 'silencioso'),
(6, 'idosa'),(6, 'calma'),(6, 'colo'),
(7, 'sociável'),(7, 'carinhoso'),
(8, 'tímido'),(8, 'sensível'),
(9, 'conversadeira'),(9, 'elegante'),(9, 'carinhosa'),
(10, 'protetor'),(10, 'leal'),
(11, 'filhote'),(11, 'travesso'),(11, 'apegado'),
(12, 'idosa'),(12, 'colo'),(12, 'doce'),
(13, 'enérgico'),(13, 'curioso'),(13, 'farejador'),
(14, 'elegante'),(14, 'reservada'),
(15, 'tímido'),(15, 'em adaptação');

-- ----------------------------------------------------
-- Vacinas
-- ----------------------------------------------------
INSERT INTO pet_vacinas (pet_id, nome_vacina, data_aplicacao, proxima_dose, observacoes) VALUES
(1, 'V10 (polivalente)',        '2025-03-01', '2026-03-01', 'Reforço anual'),
(1, 'Antirrábica',              '2025-03-15', '2026-03-15', NULL),
(1, 'Gripe canina',             '2025-04-10', '2026-04-10', NULL),

(2, 'V4 (felina)',              '2025-05-05', '2026-05-05', NULL),
(2, 'Antirrábica',              '2025-05-20', '2026-05-20', NULL),

(3, 'V10 (polivalente)',        '2025-05-15', '2026-05-15', NULL),
(3, 'Antirrábica',              '2025-05-30', '2026-05-30', NULL),
(3, 'Giárdia',                  '2025-06-10', '2026-06-10', NULL),

(4, 'V8 (filhote — 1ª dose)',   '2025-12-20', '2026-01-20', 'Primeira dose'),
(4, 'V8 (filhote — 2ª dose)',   '2026-01-20', '2026-02-20', 'Segunda dose'),

(5, 'V4 (felina)',              '2024-12-01', '2025-12-01', NULL),
(5, 'Antirrábica',              '2024-12-15', '2025-12-15', NULL),
(5, 'FeLV',                     '2025-01-10', '2026-01-10', 'FIV negativo'),

(6, 'V10 (polivalente)',        '2025-02-01', '2026-02-01', 'Histórico anterior confirmado'),
(6, 'Antirrábica',              '2025-02-15', '2026-02-15', NULL),

(7, 'V4 (felina)',              '2025-04-01', '2026-04-01', NULL),
(7, 'Antirrábica',              '2025-04-15', '2026-04-15', NULL),
(7, 'FeLV',                     '2025-05-01', '2026-05-01', NULL),

(8, 'V10 (polivalente)',        '2025-07-10', '2026-07-10', NULL),
(8, 'Antirrábica',              '2025-07-25', '2026-07-25', NULL),

(9, 'V4 (felina)',              '2025-09-20', '2026-09-20', NULL),
(9, 'Antirrábica',              '2025-10-05', '2026-10-05', NULL),

(10,'V10 (polivalente)',        '2025-01-10', '2026-01-10', NULL),
(10,'Antirrábica',              '2025-01-25', '2026-01-25', NULL),
(10,'Gripe canina',             '2025-02-10', '2026-02-10', NULL),

(11,'V8 (filhote — 1ª dose)',   '2026-04-01', '2026-05-01', 'Filhote — esquema em andamento'),

(12,'V10 (polivalente)',        '2025-08-01', '2026-08-01', NULL),
(12,'Antirrábica',              '2025-08-15', '2026-08-15', NULL),

(13,'V10 (polivalente)',        '2025-10-15', '2026-10-15', NULL),
(13,'Antirrábica',              '2025-10-30', '2026-10-30', NULL),
(13,'Leishmaniose',             '2025-11-15', '2026-11-15', NULL),

(14,'V4 (felina)',              '2025-11-10', '2026-11-10', NULL),
(14,'Antirrábica',              '2025-11-25', '2026-11-25', NULL),

(15,'V8 (filhote — 1ª dose)',   '2026-04-15', '2026-05-15', 'Recém-chegado, esquema iniciado');

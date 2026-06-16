import { pool } from '../config/db.js';

const SELECT_BASE = `
  SELECT s.id, s.pet_id, s.usuario_id, s.mensagem, s.status, s.resposta_admin,
         s.criado_em, s.atualizado_em,
         p.nome AS pet_nome, p.especie AS pet_especie, p.raca AS pet_raca,
         u.nome AS usuario_nome, u.email AS usuario_email, u.telefone AS usuario_telefone
  FROM solicitacoes_adocao s
  JOIN pets p ON p.id = s.pet_id
  JOIN usuarios u ON u.id = s.usuario_id
`;

export async function listarTodas() {
  const [linhas] = await pool.query(`${SELECT_BASE} ORDER BY s.criado_em DESC`);
  return linhas;
}

export async function listarPorUsuario(usuarioId) {
  const [linhas] = await pool.query(
    `${SELECT_BASE} WHERE s.usuario_id = ? ORDER BY s.criado_em DESC`,
    [usuarioId]
  );
  return linhas;
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query(`${SELECT_BASE} WHERE s.id = ? LIMIT 1`, [id]);
  return linhas[0] || null;
}

export async function criar({ pet_id, usuario_id, mensagem }) {
  const [r] = await pool.query(
    'INSERT INTO solicitacoes_adocao (pet_id, usuario_id, mensagem) VALUES (?, ?, ?)',
    [pet_id, usuario_id, mensagem]
  );
  return buscarPorId(r.insertId);
}

export async function atualizarStatus(id, { status, resposta_admin }) {
  await pool.query(
    'UPDATE solicitacoes_adocao SET status = ?, resposta_admin = ? WHERE id = ?',
    [status, resposta_admin || null, id]
  );
  return buscarPorId(id);
}

export async function contarPorStatus() {
  const [linhas] = await pool.query(
    'SELECT status, COUNT(*) AS total FROM solicitacoes_adocao GROUP BY status'
  );
  const mapa = { pendente: 0, aprovada: 0, rejeitada: 0, concluida: 0 };
  for (const l of linhas) mapa[l.status] = l.total;
  return mapa;
}

export async function existeSolicitacaoAtiva(petId, usuarioId) {
  const [linhas] = await pool.query(
    `SELECT id FROM solicitacoes_adocao
     WHERE pet_id = ? AND usuario_id = ? AND status IN ('pendente', 'aprovada')
     LIMIT 1`,
    [petId, usuarioId]
  );
  return linhas.length > 0;
}

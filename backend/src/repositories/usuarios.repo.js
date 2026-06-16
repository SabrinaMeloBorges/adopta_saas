import { pool } from '../config/db.js';

export async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT id, nome, email, senha_hash, telefone, cidade, estado, role, criado_em FROM usuarios WHERE email = ? LIMIT 1',
    [email]
  );
  return linhas[0] || null;
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query(
    'SELECT id, nome, email, telefone, cidade, estado, role, criado_em FROM usuarios WHERE id = ? LIMIT 1',
    [id]
  );
  return linhas[0] || null;
}

export async function criar({ nome, email, senha_hash, telefone, cidade, estado, role = 'adotante' }) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, telefone, cidade, estado, role)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nome, email, senha_hash, telefone || null, cidade || null, estado || null, role]
  );
  return buscarPorId(result.insertId);
}

export async function contarAdmins() {
  const [linhas] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE role = 'admin'");
  return linhas[0].total;
}

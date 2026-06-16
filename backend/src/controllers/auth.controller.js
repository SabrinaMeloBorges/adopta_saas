import bcrypt from 'bcryptjs';
import * as Usuarios from '../repositories/usuarios.repo.js';
import { gerarToken } from '../utils/jwt.js';
import { ErroHttp } from '../middlewares/erro.js';

function camposObrigatorios(obj, campos) {
  for (const c of campos) {
    if (!obj[c] || (typeof obj[c] === 'string' && obj[c].trim() === '')) {
      throw new ErroHttp(400, `Campo obrigatório: ${c}`);
    }
  }
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registrar(req, res) {
  const { nome, email, senha, telefone, cidade, estado } = req.body || {};
  camposObrigatorios(req.body || {}, ['nome', 'email', 'senha']);

  if (!emailValido(email)) throw new ErroHttp(400, 'E-mail inválido');
  if (senha.length < 6) throw new ErroHttp(400, 'A senha deve ter pelo menos 6 caracteres');

  const existente = await Usuarios.buscarPorEmail(email);
  if (existente) throw new ErroHttp(409, 'E-mail já cadastrado');

  const senha_hash = await bcrypt.hash(senha, 10);
  const novo = await Usuarios.criar({
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha_hash,
    telefone,
    cidade,
    estado,
    role: 'adotante',
  });

  const token = gerarToken({ id: novo.id, email: novo.email, role: novo.role, nome: novo.nome });
  res.status(201).json({ usuario: novo, token });
}

export async function login(req, res) {
  const { email, senha } = req.body || {};
  camposObrigatorios(req.body || {}, ['email', 'senha']);

  const usuario = await Usuarios.buscarPorEmail(email.trim().toLowerCase());
  if (!usuario) throw new ErroHttp(401, 'E-mail ou senha incorretos');

  const ok = await bcrypt.compare(senha, usuario.senha_hash);
  if (!ok) throw new ErroHttp(401, 'E-mail ou senha incorretos');

  const { senha_hash, ...semSenha } = usuario;
  const token = gerarToken({ id: usuario.id, email: usuario.email, role: usuario.role, nome: usuario.nome });
  res.json({ usuario: semSenha, token });
}

export async function eu(req, res) {
  const usuario = await Usuarios.buscarPorId(req.usuario.id);
  if (!usuario) throw new ErroHttp(404, 'Usuário não encontrado');
  res.json({ usuario });
}

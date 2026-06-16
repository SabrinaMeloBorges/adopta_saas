import { verificarToken } from '../utils/jwt.js';

export function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }
  const token = header.slice('Bearer '.length);
  try {
    const dados = verificarToken(token);
    req.usuario = dados;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

export function autenticarOpcional(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.usuario = verificarToken(header.slice('Bearer '.length));
    } catch {
      // ignora — segue sem usuário
    }
  }
  next();
}

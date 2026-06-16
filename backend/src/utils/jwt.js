import jwt from 'jsonwebtoken';

const SEGREDO = process.env.JWT_SECRET || 'segredo_dev_inseguro';
const EXPIRACAO = process.env.JWT_EXPIRACAO || '7d';

export function gerarToken(payload) {
  return jwt.sign(payload, SEGREDO, { expiresIn: EXPIRACAO });
}

export function verificarToken(token) {
  return jwt.verify(token, SEGREDO);
}

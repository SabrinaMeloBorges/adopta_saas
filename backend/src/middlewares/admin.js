export function exigirAdmin(req, res, next) {
  if (!req.usuario || req.usuario.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores' });
  }
  next();
}

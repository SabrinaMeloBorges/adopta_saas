export function handlerErro(err, req, res, next) {
  console.error('[erro]', err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({
    erro: err.mensagemPublica || (status === 500 ? 'Erro interno do servidor' : err.message),
  });
}

export function naoEncontrado(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' });
}

export class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
    this.mensagemPublica = mensagem;
  }
}

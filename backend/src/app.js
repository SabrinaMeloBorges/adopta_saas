import express from 'express';
import cors from 'cors';
import authRouter from './rotas/auth.js';
import petsRouter from './rotas/pets.js';
import solicitacoesRouter from './rotas/solicitacoes.js';
import { handlerErro, naoEncontrado } from './middlewares/erro.js';

export function criarApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // limite alto pra base64 de fotos
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // health check
  app.get('/api/saude', (req, res) => {
    res.json({ status: 'ok', servico: 'adopta-api', horario: new Date().toISOString() });
  });

  // rotas
  app.use('/api/auth', authRouter);
  app.use('/api/pets', petsRouter);
  app.use('/api/solicitacoes', solicitacoesRouter);

  // 404 + handler de erro
  app.use(naoEncontrado);
  app.use(handlerErro);

  return app;
}

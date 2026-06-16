import 'dotenv/config';
import { criarApp } from './app.js';
import { aguardarConexao } from './config/db.js';
import { semearUsuariosIniciais } from './utils/bootstrap.js';

const PORT = Number(process.env.PORT) || 3000;

async function iniciar() {
  await aguardarConexao();
  await semearUsuariosIniciais();
  const app = criarApp();
  app.listen(PORT, () => {
    console.log(`[server] Backend rodando em http://localhost:${PORT}`);
    console.log(`[server] API base: http://localhost:${PORT}/api`);
  });
}

iniciar().catch((err) => {
  console.error('[server] falha ao iniciar:', err);
  process.exit(1);
});

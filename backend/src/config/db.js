import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'adopta',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'adopta',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

export async function aguardarConexao(tentativasMax = 30, intervaloMs = 2000) {
  for (let i = 1; i <= tentativasMax; i++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log('[db] conexão MySQL estabelecida');
      return;
    } catch (err) {
      console.log(`[db] aguardando MySQL... tentativa ${i}/${tentativasMax}`);
      await new Promise((r) => setTimeout(r, intervaloMs));
    }
  }
  throw new Error('Não foi possível conectar ao MySQL após várias tentativas');
}

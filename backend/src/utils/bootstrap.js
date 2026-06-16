import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import * as Usuarios from '../repositories/usuarios.repo.js';

/**
 * Cria usuários iniciais se ainda não houver nenhum admin no banco.
 * Roda uma única vez na inicialização do servidor.
 */
export async function semearUsuariosIniciais() {
  const totalAdmins = await Usuarios.contarAdmins();
  if (totalAdmins > 0) {
    console.log('[bootstrap] usuários já existem, pulando seed');
    return;
  }

  const usuarios = [
    {
      nome: 'Administração Adopta',
      email: 'admin@adopta.com',
      senha: 'admin123',
      role: 'admin',
      telefone: '(11) 99999-0000',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    {
      nome: 'Mariana Silva',
      email: 'mariana@example.com',
      senha: 'mariana123',
      role: 'adotante',
      telefone: '(11) 98888-1111',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    {
      nome: 'João Pereira',
      email: 'joao@example.com',
      senha: 'joao12345',
      role: 'adotante',
      telefone: '(31) 97777-2222',
      cidade: 'Belo Horizonte',
      estado: 'MG',
    },
  ];

  for (const u of usuarios) {
    const senha_hash = await bcrypt.hash(u.senha, 10);
    await Usuarios.criar({ ...u, senha_hash });
    console.log(`[bootstrap] usuário criado: ${u.email} (${u.role})`);
  }

  // Cria algumas solicitações de exemplo
  const [petsDisp] = await pool.query("SELECT id FROM pets WHERE status = 'disponivel' LIMIT 3");
  const [marianaR] = await pool.query("SELECT id FROM usuarios WHERE email = 'mariana@example.com'");
  const [joaoR] = await pool.query("SELECT id FROM usuarios WHERE email = 'joao@example.com'");
  const marianaId = marianaR[0]?.id;
  const joaoId = joaoR[0]?.id;

  if (petsDisp.length >= 2 && marianaId && joaoId) {
    await pool.query(
      `INSERT INTO solicitacoes_adocao (pet_id, usuario_id, mensagem, status) VALUES
       (?, ?, ?, 'pendente'),
       (?, ?, ?, 'aprovada')`,
      [
        petsDisp[0].id, marianaId, 'Moro em apartamento e tenho experiência com pets. Adoraria conhecer melhor!',
        petsDisp[1].id, joaoId, 'Tenho quintal grande e outros dois cachorros que adorariam um novo amigo.',
      ]
    );
    console.log('[bootstrap] solicitações de exemplo criadas');
  }
}

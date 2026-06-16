import * as Solicitacoes from '../repositories/solicitacoes.repo.js';
import * as Pets from '../repositories/pets.repo.js';
import { ErroHttp } from '../middlewares/erro.js';

const STATUS_VALIDOS = ['pendente', 'aprovada', 'rejeitada', 'concluida'];

export async function criar(req, res) {
  const { pet_id, mensagem } = req.body || {};
  if (!pet_id) throw new ErroHttp(400, 'pet_id é obrigatório');
  if (!mensagem || mensagem.trim().length < 10) {
    throw new ErroHttp(400, 'Conta um pouquinho mais sobre você na mensagem (mínimo 10 caracteres)');
  }

  const pet = await Pets.buscarPorId(pet_id);
  if (!pet) throw new ErroHttp(404, 'Pet não encontrado');
  if (pet.status === 'adotado') throw new ErroHttp(400, 'Este pet já foi adotado');

  const jaTem = await Solicitacoes.existeSolicitacaoAtiva(pet_id, req.usuario.id);
  if (jaTem) throw new ErroHttp(409, 'Você já tem uma solicitação ativa pra esse pet');

  const nova = await Solicitacoes.criar({
    pet_id,
    usuario_id: req.usuario.id,
    mensagem: mensagem.trim(),
  });
  res.status(201).json(nova);
}

export async function listar(req, res) {
  const lista = req.usuario.role === 'admin'
    ? await Solicitacoes.listarTodas()
    : await Solicitacoes.listarPorUsuario(req.usuario.id);
  res.json(lista);
}

export async function atualizarStatus(req, res) {
  const { status, resposta_admin } = req.body || {};
  if (!STATUS_VALIDOS.includes(status)) throw new ErroHttp(400, 'Status inválido');

  const atual = await Solicitacoes.buscarPorId(req.params.id);
  if (!atual) throw new ErroHttp(404, 'Solicitação não encontrada');

  const atualizada = await Solicitacoes.atualizarStatus(req.params.id, { status, resposta_admin });

  // se aprovada, marca pet como em_processo; se concluida, como adotado
  if (status === 'aprovada') {
    await Pets.atualizar(atual.pet_id, { status: 'em_processo' });
  } else if (status === 'concluida') {
    await Pets.atualizar(atual.pet_id, { status: 'adotado' });
  } else if (status === 'rejeitada') {
    // se o pet estava em_processo só por essa solicitação, devolve pra disponivel
    const todas = await Solicitacoes.listarTodas();
    const outrasAtivas = todas.filter(
      (s) => s.pet_id === atual.pet_id && s.id !== Number(req.params.id) && (s.status === 'pendente' || s.status === 'aprovada')
    );
    if (!outrasAtivas.length) {
      const pet = await Pets.buscarPorId(atual.pet_id);
      if (pet && pet.status === 'em_processo') {
        await Pets.atualizar(atual.pet_id, { status: 'disponivel' });
      }
    }
  }

  res.json(atualizada);
}

export async function indicadoresAdmin(req, res) {
  const porStatus = await Solicitacoes.contarPorStatus();
  res.json({ solicitacoes: porStatus });
}

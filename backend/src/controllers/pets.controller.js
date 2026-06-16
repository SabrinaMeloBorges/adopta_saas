import * as Pets from '../repositories/pets.repo.js';
import { ErroHttp } from '../middlewares/erro.js';

const ESPECIES = ['cachorro', 'gato', 'outro'];
const PORTES = ['pequeno', 'medio', 'grande'];
const SEXOS = ['macho', 'femea'];
const STATUS = ['disponivel', 'em_processo', 'adotado'];

function validarCriacao(dados) {
  if (!dados) throw new ErroHttp(400, 'Corpo da requisição vazio');
  if (!ESPECIES.includes(dados.especie)) throw new ErroHttp(400, 'Espécie inválida');
  if (!SEXOS.includes(dados.sexo)) throw new ErroHttp(400, 'Sexo inválido');
  if (!PORTES.includes(dados.porte)) throw new ErroHttp(400, 'Porte inválido');
  if (dados.status && !STATUS.includes(dados.status)) throw new ErroHttp(400, 'Status inválido');
}

export async function listar(req, res) {
  const resultado = await Pets.listar({
    especie: req.query.especie,
    porte: req.query.porte,
    sexo: req.query.sexo,
    cidade: req.query.cidade,
    estado: req.query.estado,
    status: req.query.status,
    busca: req.query.busca,
    page: req.query.page || 1,
    limit: Math.min(Number(req.query.limit) || 12, 50),
  });
  res.json(resultado);
}

export async function detalhar(req, res) {
  const pet = await Pets.buscarPorId(req.params.id);
  if (!pet) throw new ErroHttp(404, 'Pet não encontrado');
  res.json(pet);
}

export async function criar(req, res) {
  validarCriacao(req.body);
  const { tags, fotos, vacinas, ...dadosPet } = req.body;
  const pet = await Pets.criar(dadosPet);

  if (Array.isArray(tags) && tags.length) {
    await Pets.substituirTags(pet.id, tags);
  }
  if (Array.isArray(fotos)) {
    for (let i = 0; i < fotos.length; i++) {
      const f = fotos[i];
      await Pets.adicionarFoto(pet.id, { ...f, eh_principal: i === 0 });
    }
  }
  if (Array.isArray(vacinas)) {
    for (const v of vacinas) {
      await Pets.adicionarVacina(pet.id, v);
    }
  }

  const completo = await Pets.buscarPorId(pet.id);
  res.status(201).json(completo);
}

export async function atualizar(req, res) {
  const existente = await Pets.buscarPorId(req.params.id);
  if (!existente) throw new ErroHttp(404, 'Pet não encontrado');

  const { tags, fotos, vacinas, ...dadosPet } = req.body || {};
  if (dadosPet.especie && !ESPECIES.includes(dadosPet.especie)) throw new ErroHttp(400, 'Espécie inválida');
  if (dadosPet.sexo && !SEXOS.includes(dadosPet.sexo)) throw new ErroHttp(400, 'Sexo inválido');
  if (dadosPet.porte && !PORTES.includes(dadosPet.porte)) throw new ErroHttp(400, 'Porte inválido');
  if (dadosPet.status && !STATUS.includes(dadosPet.status)) throw new ErroHttp(400, 'Status inválido');

  await Pets.atualizar(req.params.id, dadosPet);
  if (Array.isArray(tags)) {
    await Pets.substituirTags(req.params.id, tags);
  }

  const atualizado = await Pets.buscarPorId(req.params.id);
  res.json(atualizado);
}

export async function deletar(req, res) {
  const ok = await Pets.deletar(req.params.id);
  if (!ok) throw new ErroHttp(404, 'Pet não encontrado');
  res.status(204).end();
}

// --- Fotos ---
export async function adicionarFoto(req, res) {
  const { foto_base64, mime_type, eh_principal } = req.body || {};
  if (!foto_base64) throw new ErroHttp(400, 'Campo foto_base64 é obrigatório');
  const id = await Pets.adicionarFoto(req.params.id, { foto_base64, mime_type, eh_principal });
  res.status(201).json({ id });
}

export async function deletarFoto(req, res) {
  const ok = await Pets.deletarFoto(req.params.id, req.params.fotoId);
  if (!ok) throw new ErroHttp(404, 'Foto não encontrada');
  res.status(204).end();
}

// --- Vacinas ---
export async function adicionarVacina(req, res) {
  const { nome_vacina, data_aplicacao, proxima_dose, observacoes } = req.body || {};
  if (!nome_vacina) throw new ErroHttp(400, 'nome_vacina é obrigatório');
  if (!data_aplicacao) throw new ErroHttp(400, 'data_aplicacao é obrigatória');
  const id = await Pets.adicionarVacina(req.params.id, {
    nome_vacina, data_aplicacao, proxima_dose, observacoes,
  });
  res.status(201).json({ id });
}

export async function deletarVacina(req, res) {
  const ok = await Pets.deletarVacina(req.params.id, req.params.vacinaId);
  if (!ok) throw new ErroHttp(404, 'Vacina não encontrada');
  res.status(204).end();
}

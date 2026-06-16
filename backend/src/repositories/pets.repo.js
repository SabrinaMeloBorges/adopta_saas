import { pool } from '../config/db.js';

const CAMPOS_PET = `
  id, nome, especie, raca, sexo, idade_aprox_meses, porte, peso_kg, cor_pelagem,
  castrado, vermifugado, descricao, historia, status, cidade, estado, abrigo,
  data_resgate, microchip, bom_com_criancas, bom_com_outros_pets, bom_em_apartamento,
  criado_em, atualizado_em
`;

export async function listar({
  especie, porte, sexo, cidade, estado, status, busca, page = 1, limit = 12,
}) {
  const where = [];
  const params = [];

  if (especie)         { where.push('especie = ?');        params.push(especie); }
  if (porte)           { where.push('porte = ?');          params.push(porte); }
  if (sexo)            { where.push('sexo = ?');           params.push(sexo); }
  if (cidade)          { where.push('cidade = ?');         params.push(cidade); }
  if (estado)          { where.push('estado = ?');         params.push(estado); }
  if (status)          { where.push('status = ?');         params.push(status); }
  if (busca)           {
    where.push('(LOWER(nome) LIKE ? OR LOWER(raca) LIKE ?)');
    const b = `%${busca.toLowerCase()}%`;
    params.push(b, b);
  }

  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const offset = (Number(page) - 1) * Number(limit);

  const [linhas] = await pool.query(
    `SELECT ${CAMPOS_PET} FROM pets ${whereSql} ORDER BY criado_em DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );
  const [contagem] = await pool.query(
    `SELECT COUNT(*) AS total FROM pets ${whereSql}`,
    params
  );

  // foto principal e tags pra cada pet
  const ids = linhas.map((p) => p.id);
  const fotosPorPet = await buscarFotosPrincipais(ids);
  const tagsPorPet = await buscarTagsPorPets(ids);

  const itens = linhas.map((p) => ({
    ...p,
    foto_principal: fotosPorPet[p.id] || null,
    tags: tagsPorPet[p.id] || [],
  }));

  return {
    itens,
    total: contagem[0].total,
    page: Number(page),
    limit: Number(limit),
    paginas: Math.ceil(contagem[0].total / Number(limit)),
  };
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query(`SELECT ${CAMPOS_PET} FROM pets WHERE id = ? LIMIT 1`, [id]);
  if (!linhas[0]) return null;

  const pet = linhas[0];
  const [fotos] = await pool.query(
    'SELECT id, foto_base64, mime_type, ordem, eh_principal FROM pet_fotos WHERE pet_id = ? ORDER BY eh_principal DESC, ordem ASC',
    [id]
  );
  const [vacinas] = await pool.query(
    'SELECT id, nome_vacina, data_aplicacao, proxima_dose, observacoes FROM pet_vacinas WHERE pet_id = ? ORDER BY data_aplicacao DESC',
    [id]
  );
  const [tags] = await pool.query('SELECT tag FROM pet_tags WHERE pet_id = ?', [id]);

  const fotosPrincipais = await buscarFotosPrincipais([id]);
  return {
    ...pet,
    foto_principal: fotosPrincipais[id] || null,
    fotos,
    vacinas,
    tags: tags.map((t) => t.tag),
  };
}

async function buscarFotosPrincipais(ids) {
  if (!ids.length) return {};
  const [linhas] = await pool.query(
    `SELECT pet_id, foto_base64, mime_type FROM pet_fotos
     WHERE pet_id IN (?) AND eh_principal = TRUE`,
    [ids]
  );
  const mapa = {};
  for (const l of linhas) {
    mapa[l.pet_id] = { foto_base64: l.foto_base64, mime_type: l.mime_type };
  }
  // fallback: se algum pet não tem principal, pega qualquer foto
  const semPrincipal = ids.filter((id) => !mapa[id]);
  if (semPrincipal.length) {
    const [outras] = await pool.query(
      `SELECT pet_id, foto_base64, mime_type FROM pet_fotos
       WHERE pet_id IN (?) ORDER BY ordem ASC`,
      [semPrincipal]
    );
    for (const o of outras) {
      if (!mapa[o.pet_id]) mapa[o.pet_id] = { foto_base64: o.foto_base64, mime_type: o.mime_type };
    }
  }
  return mapa;
}

async function buscarTagsPorPets(ids) {
  if (!ids.length) return {};
  const [linhas] = await pool.query(
    'SELECT pet_id, tag FROM pet_tags WHERE pet_id IN (?)',
    [ids]
  );
  const mapa = {};
  for (const l of linhas) {
    if (!mapa[l.pet_id]) mapa[l.pet_id] = [];
    mapa[l.pet_id].push(l.tag);
  }
  return mapa;
}

export async function criar(dados) {
  const [result] = await pool.query(
    `INSERT INTO pets (
      nome, especie, raca, sexo, idade_aprox_meses, porte, peso_kg, cor_pelagem,
      castrado, vermifugado, descricao, historia, status, cidade, estado, abrigo,
      data_resgate, microchip, bom_com_criancas, bom_com_outros_pets, bom_em_apartamento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dados.nome || null,
      dados.especie,
      dados.raca || 'SRD',
      dados.sexo,
      dados.idade_aprox_meses || null,
      dados.porte,
      dados.peso_kg || null,
      dados.cor_pelagem || null,
      !!dados.castrado,
      !!dados.vermifugado,
      dados.descricao || null,
      dados.historia || null,
      dados.status || 'disponivel',
      dados.cidade || null,
      dados.estado || null,
      dados.abrigo || null,
      dados.data_resgate || null,
      dados.microchip || null,
      dados.bom_com_criancas ?? null,
      dados.bom_com_outros_pets ?? null,
      dados.bom_em_apartamento ?? null,
    ]
  );
  return buscarPorId(result.insertId);
}

export async function atualizar(id, dados) {
  const campos = [
    'nome','especie','raca','sexo','idade_aprox_meses','porte','peso_kg','cor_pelagem',
    'castrado','vermifugado','descricao','historia','status','cidade','estado','abrigo',
    'data_resgate','microchip','bom_com_criancas','bom_com_outros_pets','bom_em_apartamento',
  ];
  const sets = [];
  const params = [];
  for (const c of campos) {
    if (c in dados) {
      sets.push(`${c} = ?`);
      params.push(dados[c]);
    }
  }
  if (!sets.length) return buscarPorId(id);
  params.push(id);
  await pool.query(`UPDATE pets SET ${sets.join(', ')} WHERE id = ?`, params);
  return buscarPorId(id);
}

export async function deletar(id) {
  const [r] = await pool.query('DELETE FROM pets WHERE id = ?', [id]);
  return r.affectedRows > 0;
}

// --- Fotos ---
export async function adicionarFoto(petId, { foto_base64, mime_type = 'image/jpeg', eh_principal = false }) {
  if (eh_principal) {
    await pool.query('UPDATE pet_fotos SET eh_principal = FALSE WHERE pet_id = ?', [petId]);
  }
  const [r] = await pool.query(
    'INSERT INTO pet_fotos (pet_id, foto_base64, mime_type, eh_principal) VALUES (?, ?, ?, ?)',
    [petId, foto_base64, mime_type, !!eh_principal]
  );
  return r.insertId;
}

export async function deletarFoto(petId, fotoId) {
  const [r] = await pool.query('DELETE FROM pet_fotos WHERE id = ? AND pet_id = ?', [fotoId, petId]);
  return r.affectedRows > 0;
}

// --- Vacinas ---
export async function adicionarVacina(petId, { nome_vacina, data_aplicacao, proxima_dose, observacoes }) {
  const [r] = await pool.query(
    'INSERT INTO pet_vacinas (pet_id, nome_vacina, data_aplicacao, proxima_dose, observacoes) VALUES (?, ?, ?, ?, ?)',
    [petId, nome_vacina, data_aplicacao, proxima_dose || null, observacoes || null]
  );
  return r.insertId;
}

export async function deletarVacina(petId, vacinaId) {
  const [r] = await pool.query('DELETE FROM pet_vacinas WHERE id = ? AND pet_id = ?', [vacinaId, petId]);
  return r.affectedRows > 0;
}

// --- Tags ---
export async function substituirTags(petId, tags = []) {
  await pool.query('DELETE FROM pet_tags WHERE pet_id = ?', [petId]);
  if (!tags.length) return;
  const valores = tags.map(() => '(?, ?)').join(', ');
  const params = tags.flatMap((t) => [petId, t]);
  await pool.query(`INSERT INTO pet_tags (pet_id, tag) VALUES ${valores}`, params);
}

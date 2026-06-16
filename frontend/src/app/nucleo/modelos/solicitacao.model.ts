export type StatusSolicitacao = 'pendente' | 'aprovada' | 'rejeitada' | 'concluida';

export interface Solicitacao {
  id: number;
  pet_id: number;
  usuario_id: number;
  mensagem: string;
  status: StatusSolicitacao;
  resposta_admin: string | null;
  criado_em: string;
  atualizado_em: string;
  // joinados
  pet_nome: string | null;
  pet_especie: string;
  pet_raca: string;
  usuario_nome: string;
  usuario_email: string;
  usuario_telefone?: string | null;
}

export interface NovaSolicitacao {
  pet_id: number;
  mensagem: string;
}

export type Especie = 'cachorro' | 'gato' | 'outro';
export type Sexo = 'macho' | 'femea';
export type Porte = 'pequeno' | 'medio' | 'grande';
export type StatusPet = 'disponivel' | 'em_processo' | 'adotado';

export interface FotoPet {
  id?: number;
  foto_base64: string;
  mime_type: string;
  ordem?: number;
  eh_principal?: boolean;
}

export interface VacinaPet {
  id?: number;
  nome_vacina: string;
  data_aplicacao: string;
  proxima_dose?: string | null;
  observacoes?: string | null;
}

export interface Pet {
  id: number;
  nome: string | null;
  especie: Especie;
  raca: string;
  sexo: Sexo;
  idade_aprox_meses: number | null;
  porte: Porte;
  peso_kg: number | null;
  cor_pelagem: string | null;
  castrado: boolean;
  vermifugado: boolean;
  descricao: string | null;
  historia: string | null;
  status: StatusPet;
  cidade: string | null;
  estado: string | null;
  abrigo: string | null;
  data_resgate: string | null;
  microchip: string | null;
  bom_com_criancas: boolean | null;
  bom_com_outros_pets: boolean | null;
  bom_em_apartamento: boolean | null;
  criado_em: string;
  atualizado_em: string;
  // populados em algumas queries
  foto_principal?: { foto_base64: string; mime_type: string } | null;
  tags?: string[];
  fotos?: FotoPet[];
  vacinas?: VacinaPet[];
}

export interface FiltrosPet {
  especie?: Especie;
  porte?: Porte;
  sexo?: Sexo;
  cidade?: string;
  estado?: string;
  status?: StatusPet;
  busca?: string;
  page?: number;
  limit?: number;
}

export interface ListagemPets {
  itens: Pet[];
  total: number;
  page: number;
  limit: number;
  paginas: number;
}

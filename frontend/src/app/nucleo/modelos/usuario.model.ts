export type Papel = 'adotante' | 'admin';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  cidade?: string | null;
  estado?: string | null;
  role: Papel;
  criado_em?: string;
}

export interface RespostaAuth {
  usuario: Usuario;
  token: string;
}

export interface DadosRegistro {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
}

export interface DadosLogin {
  email: string;
  senha: string;
}

export interface Disciplina {
  _id: string;
  nome: string;
  cargaHoraria: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Aluno {
  _id: string;
  nome: string;
  endereco: string;
  dataNascimento: string;
  cpf: string;
  matricula: string;
  telefone: string;
  email: string;
  curso: string;
  disciplinas: Disciplina[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

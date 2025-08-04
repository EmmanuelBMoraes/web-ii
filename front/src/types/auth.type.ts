export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials extends LoginCredentials {
  nome: string;
}

export interface Usuario {
  _id: string;
  nome: string;
  email: string;
}

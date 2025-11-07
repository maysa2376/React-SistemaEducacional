export interface Estudante {
  id: number;
  nome: string;
  email: string;
  curso_id?: number;
}

export interface Curso {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Turma {
  id: number;
  nome: string;
  curso_id: number;
}

export interface Matricula {
  id: number;
  estudante_id: number;
  turma_id: number;
}

export interface Nota {
  id: number;
  matricula_id: number;
  tipo: 'prova' | 'trabalho';
  valor: number;
}

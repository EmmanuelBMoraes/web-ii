import apiClient from "@/lib/apiClient";
import { type Aluno } from "@/types/models.type";

export type CreateAlunoData = Omit<
  Aluno,
  "_id" | "ativo" | "createdAt" | "updatedAt" | "disciplinas"
>;

export type UpdateAlunoData = Partial<CreateAlunoData>;

// --- FUNÇÕES DA API ---

/**
 * Busca todos os alunos ativos.
 */
export const getAllAlunos = async (): Promise<Aluno[]> => {
  const response = await apiClient.get("/alunos");
  return response.data.data || [];
};

/**
 * Cria um novo aluno.
 * @param data - Os dados do novo aluno.
 */
export const createAluno = async (data: CreateAlunoData): Promise<Aluno> => {
  const response = await apiClient.post("/alunos", data);
  return response.data.data;
};

/**
 * Atualiza um aluno existente.
 * @param id - O ID do aluno a ser atualizado.
 * @param data - Os novos dados do aluno.
 */
export const updateAluno = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateAlunoData;
}): Promise<Aluno> => {
  const response = await apiClient.put(`/alunos/${id}`, data);
  return response.data.data;
};

/**
 * Desativa (deleção lógica) um aluno.
 * @param id - O ID do aluno a ser desativado.
 */
export const deleteAluno = async (id: string): Promise<void> => {
  await apiClient.delete(`/alunos/${id}`);
};

import apiClient from "@/lib/apiClient";
import { type Disciplina } from "@/types/models.type";

type CreateDisciplinaData = Omit<
  Disciplina,
  "_id" | "ativo" | "createdAt" | "updatedAt"
>;
type UpdateDisciplinaData = Partial<CreateDisciplinaData>;

export const getAllDisciplinas = async (): Promise<Disciplina[]> => {
  const response = await apiClient.get("/disciplinas");
  return response.data.disciplinas || [];
};

export const createDisciplina = async (
  data: CreateDisciplinaData
): Promise<Disciplina> => {
  const response = await apiClient.post("/disciplinas", data);
  return response.data.data;
};

export const updateDisciplina = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateDisciplinaData;
}): Promise<Disciplina> => {
  const response = await apiClient.put(`/disciplinas/${id}`, data);
  return response.data.data;
};

export const deleteDisciplina = async (id: string): Promise<void> => {
  await apiClient.delete(`/disciplinas/${id}`);
};

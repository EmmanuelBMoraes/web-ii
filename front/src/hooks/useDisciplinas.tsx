import { useQuery } from "@tanstack/react-query";
import { getAllDisciplinas } from "@/api/disciplinaService";
import { type Disciplina } from "@/types/models.type";

const CACHE_KEY = "disciplinasCache";
const CACHE_DURATION = 1000 * 60 * 5;

export const useDisciplinas = () => {
  return useQuery<Disciplina[]>({
    queryKey: ["disciplinas"],
    queryFn: async () => {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }

      const freshData = await getAllDisciplinas();
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: freshData })
      );
      return freshData;
    },
    staleTime: CACHE_DURATION,
  });
};

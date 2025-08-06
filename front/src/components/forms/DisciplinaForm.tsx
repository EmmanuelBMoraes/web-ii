import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Usando o caminho padrão com '@/'
import { Input } from "@/components/ui/input";
import { type Disciplina } from "@/types/models.type"; // Recomendo renomear para models.ts

const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  cargaHoraria: z.coerce
    .number()
    .min(1, { message: "A carga horária deve ser maior que zero." }),
});

type DisciplinaFormValues = z.infer<typeof formSchema>;

interface DisciplinaFormProps {
  initialData?: Disciplina | null;
  onSubmit: (values: DisciplinaFormValues) => void;
  isSubmitting: boolean;
}

export const DisciplinaForm = ({
  initialData,
  onSubmit,
  isSubmitting,
}: DisciplinaFormProps) => {
  const form = useForm<DisciplinaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      cargaHoraria: initialData?.cargaHoraria || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Engenharia de Software" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cargaHoraria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carga Horária (em horas)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 60" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 /> : "Salvar"}
        </Button>
      </form>
    </Form>
  );
};

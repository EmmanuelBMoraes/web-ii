import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Aluno } from "@/types/models.type";
import { useDisciplinas } from "@/hooks/useDisciplinas";
import { MaskedInput } from "../shared/MaskedInput";

const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  cpf: z.string().min(11, { message: "O CPF deve ter 11 dígitos." }),
  matricula: z.string().min(1, { message: "A matrícula é obrigatória." }),
  curso: z.string().min(3, { message: "O curso é obrigatório." }),
  disciplinas: z.array(z.string()).optional(), // Campo para as disciplinas selecionadas
  endereco: z.string().min(5, { message: "O endereço é obrigatório." }),
  telefone: z.string().min(10, { message: "O telefone é obrigatório." }),
  dataNascimento: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "Data inválida.",
  }),
});

type AlunoFormValues = z.infer<typeof formSchema>;

interface AlunoFormProps {
  initialData?: Aluno | null;
  onSubmit: (values: AlunoFormValues) => void;
  isSubmitting: boolean;
}

export const AlunoForm = ({
  initialData,
  onSubmit,
  isSubmitting,
}: AlunoFormProps) => {
  const { data: disciplinas, isLoading: isLoadingDisciplinas } =
    useDisciplinas();

  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      cpf: initialData?.cpf || "",
      matricula: initialData?.matricula || "",
      curso: initialData?.curso || "",
      // Mapeia os objetos de disciplina para um array de nomes
      disciplinas: initialData?.disciplinas?.map((d) => d.nome) || [],
      endereco: initialData?.endereco || "",
      telefone: initialData?.telefone || "",
      dataNascimento: initialData
        ? new Date(initialData.dataNascimento).toISOString().split("T")[0]
        : "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* ... (campos nome, email, cpf, matricula) ... */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do aluno" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@dominio.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="000.000.000-00"
                  placeholder="000.000.000-00"
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="matricula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 20251001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- CAMPO CURSO (TEXTO NORMAL) --- */}
        <FormField
          control={form.control}
          name="curso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ciência da Computação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disciplinas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplinas Matriculadas</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between h-auto"
                    >
                      <div className="flex gap-1 flex-wrap">
                        {field.value && field.value.length > 0 ? (
                          field.value.map((disciplinaNome) => (
                            <Badge variant="secondary" key={disciplinaNome}>
                              {disciplinaNome}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            Selecione as disciplinas
                          </span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar disciplina..." />
                    <CommandEmpty>Nenhuma disciplina encontrada.</CommandEmpty>
                    <CommandList>
                      {isLoadingDisciplinas && (
                        <div className="p-2 text-center text-sm">
                          Carregando...
                        </div>
                      )}
                      {disciplinas?.map((disciplina) => (
                        <CommandItem
                          value={disciplina.nome}
                          key={disciplina._id}
                          onSelect={() => {
                            const currentDisciplinas = field.value || [];
                            const isSelected = currentDisciplinas.includes(
                              disciplina.nome
                            );
                            const newDisciplinas = isSelected
                              ? currentDisciplinas.filter(
                                  (d) => d !== disciplina.nome
                                )
                              : [...currentDisciplinas, disciplina.nome];
                            form.setValue("disciplinas", newDisciplinas);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (field.value || []).includes(disciplina.nome)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {disciplina.nome}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="(00) 00000-0000"
                  placeholder="(XX) 9XXXX-XXXX"
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Salvar"}
        </Button>
      </form>
    </Form>
  );
};

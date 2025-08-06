import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, PlusCircle } from "lucide-react";

// --- Services & Types ---
import {
  getAllAlunos,
  createAluno,
  updateAluno,
  deleteAluno,
} from "@/api/alunoService";
import { type Aluno } from "@/types/models.type";

// --- Components ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlunoForm } from "@/components/forms/AlunoForm";
import { Badge } from "@/components/ui/badge";

const AlunosListPage = () => {
  const queryClient = useQueryClient();

  // --- State Management for Modals ---
  const [modal, setModal] = useState({
    isOpen: false,
    data: null as Aluno | null,
  });
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    id: "",
    name: "",
  });

  // --- Data Fetching ---
  const {
    data: alunos,
    isLoading,
    isError,
  } = useQuery<Aluno[]>({
    queryKey: ["alunos"],
    queryFn: getAllAlunos,
  });

  // --- Data Mutations ---
  const invalidateAlunosQuery = () => {
    queryClient.invalidateQueries({ queryKey: ["alunos"] });
  };

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createAluno,
    onSuccess: () => {
      toast.success("Aluno criado com sucesso!");
      invalidateAlunosQuery();
      setModal({ isOpen: false, data: null });
    },
    onError: (err) => toast.error(`Falha ao criar aluno: ${err.message}`),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateAluno,
    onSuccess: () => {
      toast.success("Aluno atualizado com sucesso!");
      invalidateAlunosQuery();
      setModal({ isOpen: false, data: null });
    },
    onError: (err) => toast.error(`Falha ao atualizar aluno: ${err.message}`),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteAluno,
    onSuccess: () => {
      toast.success("Aluno desativado com sucesso!");
      invalidateAlunosQuery();
    },
    onError: (err) => toast.error(`Falha ao desativar aluno: ${err.message}`),
  });

  // --- Handlers ---
  const handleFormSubmit = (values: any) => {
    if (modal.data) {
      updateMutate({ id: modal.data._id, data: values });
    } else {
      createMutate(values);
    }
  };

  const handleDeleteConfirm = () => {
    deleteMutate(deleteAlert.id);
    setDeleteAlert({ isOpen: false, id: "", name: "" });
  };

  const TableSkeleton = () =>
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell colSpan={4}>
          <Skeleton className="h-8 w-full" />
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Alunos</h1>
        <Button
          onClick={() => setModal({ isOpen: true, data: null })}
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Aluno
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Disciplinas</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500">
                    Falha ao carregar os alunos.
                  </TableCell>
                </TableRow>
              ) : (
                alunos?.map((aluno) => (
                  <TableRow key={aluno._id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.email}</TableCell>
                    <TableCell>{aluno.cpf}</TableCell>
                    <TableCell>{aluno.matricula}</TableCell>
                    <TableCell>{aluno.curso}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {aluno.disciplinas
                          ?.map((disc) => disc?.nome)
                          .filter(Boolean)
                          .map((nome) => (
                            <Badge key={nome} variant="outline">
                              {nome}
                            </Badge>
                          )) || "Nenhuma"}
                      </div>
                    </TableCell>
                    <TableCell>{aluno.endereco}</TableCell>
                    <TableCell>{aluno.telefone}</TableCell>
                    <TableCell>
                      {new Date(aluno.dataNascimento).toLocaleDateString(
                        "pt-BR"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setModal({ isOpen: true, data: aluno })
                            }
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteAlert({
                                isOpen: true,
                                id: aluno._id,
                                name: aluno.nome,
                              })
                            }
                            className="text-red-600"
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Adicionar/Editar Aluno */}
      <Dialog
        open={modal.isOpen}
        onOpenChange={(isOpen) =>
          setModal({ isOpen, data: isOpen ? modal.data : null })
        }
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {modal.data ? "Editar Aluno" : "Adicionar Novo Aluno"}
            </DialogTitle>
          </DialogHeader>
          <AlunoForm
            initialData={modal.data}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Alerta de Confirmação de Exclusão */}
      <AlertDialog
        open={deleteAlert.isOpen}
        onOpenChange={(isOpen) => setDeleteAlert({ ...deleteAlert, isOpen })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá desativar o aluno "{deleteAlert.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlunosListPage;

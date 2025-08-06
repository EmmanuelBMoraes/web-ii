import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, PlusCircle } from "lucide-react";

// --- Services ---
import {
  getAllAlunos,
  createAluno,
  updateAluno,
  deleteAluno,
} from "@/api/alunoService";
import {
  getAllDisciplinas,
  createDisciplina,
  updateDisciplina,
  deleteDisciplina,
} from "@/api/disciplinaService";

// --- Types ---
import { type Aluno, type Disciplina } from "@/types/models.type";

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
import { DisciplinaForm } from "@/components/forms/DisciplinaForm";
import { AlunoForm } from "@/components/forms/AlunoForm";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const queryClient = useQueryClient();

  // --- State Management ---
  const [alunoModal, setAlunoModal] = useState({
    isOpen: false,
    data: null as Aluno | null,
  });
  const [disciplinaModal, setDisciplinaModal] = useState({
    isOpen: false,
    data: null as Disciplina | null,
  });
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    type: "",
    id: "",
    name: "",
  });

  // --- QUERIES ---
  const { data: alunos, isLoading: isLoadingAlunos } = useQuery<Aluno[]>({
    queryKey: ["alunos"],
    queryFn: getAllAlunos,
  });
  const { data: disciplinas, isLoading: isLoadingDisciplinas } = useQuery<
    Disciplina[]
  >({ queryKey: ["disciplinas"], queryFn: getAllDisciplinas });

  // --- MUTATIONS ---
  const { mutate: createAlunoMutate, isPending: isCreatingAluno } = useMutation(
    {
      mutationFn: createAluno,
      onSuccess: () => {
        toast.success("Aluno criado!");
        queryClient.invalidateQueries({ queryKey: ["alunos"] });
        setAlunoModal({ isOpen: false, data: null });
      },
      onError: (err) => toast.error(`Falha ao criar aluno: ${err.message}`),
    }
  );

  const { mutate: updateAlunoMutate, isPending: isUpdatingAluno } = useMutation(
    {
      mutationFn: updateAluno,
      onSuccess: () => {
        toast.success("Aluno atualizado!");
        queryClient.invalidateQueries({ queryKey: ["alunos"] });
        setAlunoModal({ isOpen: false, data: null });
      },
      onError: (err) => toast.error(`Falha ao atualizar aluno: ${err.message}`),
    }
  );

  const { mutate: deleteAlunoMutate } = useMutation({
    mutationFn: deleteAluno,
    onSuccess: () => {
      toast.success("Aluno desativado!");
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
    },
    onError: (err) => toast.error(`Falha ao desativar aluno: ${err.message}`),
  });

  const { mutate: createDisciplinaMutate, isPending: isCreatingDisciplina } =
    useMutation({
      mutationFn: createDisciplina,
      onSuccess: () => {
        toast.success("Disciplina criada!");
        queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
        setDisciplinaModal({ isOpen: false, data: null });
      },
      onError: (err) =>
        toast.error(`Falha ao criar disciplina: ${err.message}`),
    });

  const { mutate: updateDisciplinaMutate, isPending: isUpdatingDisciplina } =
    useMutation({
      mutationFn: updateDisciplina,
      onSuccess: () => {
        toast.success("Disciplina atualizada!");
        queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
        setDisciplinaModal({ isOpen: false, data: null });
      },
      onError: (err) =>
        toast.error(`Falha ao atualizar disciplina: ${err.message}`),
    });

  const { mutate: deleteDisciplinaMutate } = useMutation({
    mutationFn: deleteDisciplina,
    onSuccess: () => {
      toast.success("Disciplina desativada!");
      queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
    },
    onError: (err) =>
      toast.error(`Falha ao desativar disciplina: ${err.message}`),
  });

  // --- Handlers ---
  const handleAlunoSubmit = (values: any) => {
    alunoModal.data
      ? updateAlunoMutate({ id: alunoModal.data._id, data: values })
      : createAlunoMutate(values);
  };
  const handleDisciplinaSubmit = (values: any) => {
    disciplinaModal.data
      ? updateDisciplinaMutate({ id: disciplinaModal.data._id, data: values })
      : createDisciplinaMutate(values);
  };
  const handleDeleteConfirm = () => {
    if (deleteAlert.type === "aluno") deleteAlunoMutate(deleteAlert.id);
    if (deleteAlert.type === "disciplina")
      deleteDisciplinaMutate(deleteAlert.id);
    setDeleteAlert({ isOpen: false, type: "", id: "", name: "" });
  };

  const TableSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card de Alunos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alunos</CardTitle>
            <Button
              onClick={() => setAlunoModal({ isOpen: true, data: null })}
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Aluno
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingAlunos ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Disciplinas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunos?.map((aluno) => (
                    <TableRow key={aluno._id}>
                      <TableCell>{aluno.nome}</TableCell>
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
                                setAlunoModal({ isOpen: true, data: aluno })
                              }
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteAlert({
                                  isOpen: true,
                                  type: "aluno",
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
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Card de Disciplinas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Disciplinas</CardTitle>
            <Button
              onClick={() => setDisciplinaModal({ isOpen: true, data: null })}
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Disciplina
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingDisciplinas ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplinas?.map((disciplina) => (
                    <TableRow key={disciplina._id}>
                      <TableCell>{disciplina.nome}</TableCell>
                      <TableCell>{disciplina.cargaHoraria}h</TableCell>
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
                                setDisciplinaModal({
                                  isOpen: true,
                                  data: disciplina,
                                })
                              }
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteAlert({
                                  isOpen: true,
                                  type: "disciplina",
                                  id: disciplina._id,
                                  name: disciplina.nome,
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
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals e Alerts */}
      <Dialog
        open={alunoModal.isOpen}
        onOpenChange={(isOpen) =>
          setAlunoModal({ isOpen, data: isOpen ? alunoModal.data : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {alunoModal.data ? "Editar Aluno" : "Adicionar Novo Aluno"}
            </DialogTitle>
          </DialogHeader>
          <AlunoForm
            initialData={alunoModal.data}
            onSubmit={handleAlunoSubmit}
            isSubmitting={isCreatingAluno || isUpdatingAluno}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={disciplinaModal.isOpen}
        onOpenChange={(isOpen) =>
          setDisciplinaModal({
            isOpen,
            data: isOpen ? disciplinaModal.data : null,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {disciplinaModal.data
                ? "Editar Disciplina"
                : "Adicionar Nova Disciplina"}
            </DialogTitle>
          </DialogHeader>
          <DisciplinaForm
            initialData={disciplinaModal.data}
            onSubmit={handleDisciplinaSubmit}
            isSubmitting={isCreatingDisciplina || isUpdatingDisciplina}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteAlert.isOpen}
        onOpenChange={(isOpen) => setDeleteAlert({ ...deleteAlert, isOpen })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá desativar o item "{deleteAlert.name}".
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

export default DashboardPage;

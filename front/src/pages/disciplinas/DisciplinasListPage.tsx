// src/pages/disciplinas/DisciplinasListPage.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, PlusCircle } from "lucide-react";

// --- Services & Types ---
import {
  getAllDisciplinas,
  createDisciplina,
  updateDisciplina,
  deleteDisciplina,
} from "@/api/disciplinaService";
import { type Disciplina } from "@/types/models.type";

// --- Components ---
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const DisciplinasListPage = () => {
  const queryClient = useQueryClient();

  // --- State Management for Modals ---
  const [modal, setModal] = useState({
    isOpen: false,
    data: null as Disciplina | null,
  });
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    id: "",
    name: "",
  });

  // --- Data Fetching ---
  const {
    data: disciplinas,
    isLoading,
    isError,
  } = useQuery<Disciplina[]>({
    queryKey: ["disciplinas"],
    queryFn: getAllDisciplinas,
  });

  // --- Data Mutations ---
  const invalidateDisciplinasQuery = () => {
    queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
  };

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createDisciplina,
    onSuccess: () => {
      toast.success("Disciplina criada com sucesso!");
      invalidateDisciplinasQuery();
      setModal({ isOpen: false, data: null });
    },
    onError: (err) => toast.error(`Falha ao criar disciplina: ${err.message}`),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateDisciplina,
    onSuccess: () => {
      toast.success("Disciplina atualizada com sucesso!");
      invalidateDisciplinasQuery();
      setModal({ isOpen: false, data: null });
    },
    onError: (err) =>
      toast.error(`Falha ao atualizar disciplina: ${err.message}`),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteDisciplina,
    onSuccess: () => {
      toast.success("Disciplina desativada com sucesso!");
      invalidateDisciplinasQuery();
    },
    onError: (err) =>
      toast.error(`Falha ao desativar disciplina: ${err.message}`),
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
        <TableCell colSpan={3}>
          <Skeleton className="h-8 w-full" />
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Disciplinas</h1>
        <Button
          onClick={() => setModal({ isOpen: true, data: null })}
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Disciplina
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-red-500">
                    Falha ao carregar as disciplinas.
                  </TableCell>
                </TableRow>
              ) : (
                disciplinas?.map((disciplina) => (
                  <TableRow key={disciplina._id}>
                    <TableCell className="font-medium">
                      {disciplina.nome}
                    </TableCell>
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
                              setModal({ isOpen: true, data: disciplina })
                            }
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteAlert({
                                isOpen: true,
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Adicionar/Editar Disciplina */}
      <Dialog
        open={modal.isOpen}
        onOpenChange={(isOpen: boolean) =>
          setModal({ isOpen, data: isOpen ? modal.data : null })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {modal.data ? "Editar Disciplina" : "Adicionar Nova Disciplina"}
            </DialogTitle>
          </DialogHeader>
          <DisciplinaForm
            initialData={modal.data}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Alerta de Confirmação de Exclusão */}
      <AlertDialog
        open={deleteAlert.isOpen}
        onOpenChange={(isOpen: boolean) =>
          setDeleteAlert({ ...deleteAlert, isOpen })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá desativar a disciplina "{deleteAlert.name}".
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

export default DisciplinasListPage;

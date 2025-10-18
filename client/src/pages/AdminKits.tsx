import { AdminLayout } from "@/components/AdminLayout";
import { KitForm } from "@/components/KitForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Kit, InsertKit } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
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

export default function AdminKits() {
  const [showForm, setShowForm] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | undefined>();
  const [deleteKit, setDeleteKit] = useState<Kit | undefined>();
  const { toast } = useToast();

  const { data: kits = [], isLoading } = useQuery<Kit[]>({
    queryKey: ['/api/kits'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertKit) => apiRequest('POST', '/api/kits', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kits'] });
      toast({ title: "Kit criado com sucesso!" });
      setShowForm(false);
    },
    onError: () => {
      toast({
        title: "Erro ao criar kit",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertKit & { id: string }) =>
      apiRequest('PUT', `/api/kits/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kits'] });
      toast({ title: "Kit atualizado com sucesso!" });
      setShowForm(false);
      setEditingKit(undefined);
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar kit",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/kits/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kits'] });
      toast({ title: "Kit excluído com sucesso!" });
      setDeleteKit(undefined);
    },
    onError: () => {
      toast({
        title: "Erro ao excluir kit",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertKit) => {
    if (editingKit) {
      updateMutation.mutate({ ...data, id: editingKit.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (kit: Kit) => {
    setEditingKit(kit);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingKit(undefined);
  };

  const confirmDelete = () => {
    if (deleteKit) {
      deleteMutation.mutate(deleteKit.id);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold" data-testid="text-admin-title">
              Gerenciar Kits
            </h1>
            <p className="text-muted-foreground mt-1">
              Adicione, edite ou remova kits/conjuntos
            </p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2"
              data-testid="button-add-kit"
            >
              <Plus className="w-4 h-4" />
              Novo Kit
            </Button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingKit ? "Editar Kit" : "Novo Kit"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KitForm
                kit={editingKit}
                onSubmit={handleSubmit}
                onCancel={handleCancelForm}
                isPending={createMutation.isPending || updateMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : kits.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground" data-testid="text-no-kits">
                Nenhum kit cadastrado. Clique em "Novo Kit" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kits.map(kit => (
              <Card key={kit.id} className="overflow-hidden">
                <div className="relative aspect-[3/4] bg-muted">
                  <div className="grid grid-cols-2 gap-0.5 h-full">
                    {kit.imageUrls.slice(0, 4).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`${kit.name} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ))}
                  </div>
                  {kit.isFeatured && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Destaque
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium line-clamp-1" data-testid={`text-kit-name-${kit.id}`}>
                      {kit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {kit.description}
                    </p>
                    <p className="text-lg font-bold text-primary mt-2">
                      R$ {kit.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {kit.imageUrls.length} {kit.imageUrls.length === 1 ? 'imagem' : 'imagens'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(kit)}
                      className="flex-1 gap-2"
                      data-testid={`button-edit-${kit.id}`}
                    >
                      <Pencil className="w-3 h-3" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteKit(kit)}
                      className="flex-1 gap-2"
                      data-testid={`button-delete-${kit.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteKit} onOpenChange={() => setDeleteKit(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteKit?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

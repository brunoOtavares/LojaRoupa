import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertKitSchema, type Kit, type InsertKit, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface KitFormProps {
  kit?: Kit;
  onSubmit: (data: InsertKit) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function KitForm({ kit, onSubmit, onCancel, isPending }: KitFormProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>(kit?.productIds || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(kit?.imageUrl || "");
  const [uploading, setUploading] = useState(false);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const form = useForm<InsertKit>({
    resolver: zodResolver(insertKitSchema),
    defaultValues: {
      name: kit?.name || "",
      description: kit?.description || "",
      price: kit?.price || 0,
      imageUrl: kit?.imageUrl || "",
      productIds: kit?.productIds || [],
      isFeatured: kit?.isFeatured || false,
    },
  });

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const totalPrice = products
        .filter(p => selectedProducts.includes(p.id))
        .reduce((sum, p) => sum + p.price, 0);
      
      if (!kit) {
        form.setValue('price', totalPrice);
      }
    }
  }, [selectedProducts, products, kit, form]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Marca como "pending upload" para passar na validação
      form.setValue("imageUrl", "pending-upload", { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      form.setValue('productIds', updated);
      return updated;
    });
  };

  const handleSubmit = async (data: InsertKit) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Selecione produtos",
        description: "Você precisa selecionar pelo menos um produto para o kit",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = data.imageUrl;

    if (imageFile) {
      setUploading(true);
      try {
        // Create FormData to send file to server
        const formData = new FormData();
        formData.append("file", imageFile);

        // Upload via server (avoids CORS issues)
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${await (await import("@/lib/firebase")).auth.currentUser?.getIdToken()}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const uploadResult = await response.json();
        imageUrl = uploadResult.imageUrl;
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Erro no upload",
          description: error instanceof Error ? error.message : "Não foi possível fazer upload da imagem",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (!imageUrl) {
      toast({
        title: "Imagem obrigatória",
        description: "Você precisa adicionar uma foto do kit",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...data,
      imageUrl,
      productIds: selectedProducts,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Kit</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Kit Executivo - Camisa + Calça"
                  data-testid="input-kit-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva o kit..."
                  rows={3}
                  data-testid="input-kit-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Label>Produtos do Kit</Label>
          <p className="text-sm text-muted-foreground">
            Selecione os produtos que fazem parte deste kit
          </p>
          
          {products.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhum produto cadastrado. Cadastre produtos primeiro na aba "Produtos".
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto border rounded-lg p-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover-elevate transition-all cursor-pointer"
                  onClick={() => handleProductToggle(product.id)}
                  data-testid={`checkbox-product-${product.id}`}
                >
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleProductToggle(product.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-sm font-bold text-primary mt-1">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedProducts.length > 0 && (
            <p className="text-sm text-primary font-medium">
              {selectedProducts.length} {selectedProducts.length === 1 ? 'produto selecionado' : 'produtos selecionados'}
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço do Kit (R$)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  data-testid="input-kit-price"
                />
              </FormControl>
              <FormDescription>
                {selectedProducts.length > 0 && (
                  <span className="text-xs">
                    Sugestão: R$ {products
                      .filter(p => selectedProducts.includes(p.id))
                      .reduce((sum, p) => sum + p.price, 0)
                      .toFixed(2)} (soma dos produtos)
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Foto do Kit Montado</FormLabel>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover-elevate transition-all">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  data-testid="button-remove-image"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  data-testid="input-kit-image"
                />
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Clique para escolher uma foto do kit montado
                </p>
              </label>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="checkbox-featured"
                />
              </FormControl>
              <FormLabel className="!mt-0 cursor-pointer">
                Marcar como destaque
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending || uploading}
            className="flex-1"
            data-testid="button-cancel"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending || uploading || selectedProducts.length === 0}
            className="flex-1"
            data-testid="button-submit"
          >
            {uploading ? "Enviando..." : isPending ? "Salvando..." : kit ? "Atualizar Kit" : "Salvar Kit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

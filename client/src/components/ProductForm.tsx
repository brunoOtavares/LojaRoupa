import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: InsertProduct) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isPending }: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || "");
  const [imageId, setImageId] = useState<string | undefined>(product?.imageId);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      imageId: product.imageId,
      type: product.type,
      isFeatured: product.isFeatured,
    } : {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      imageId: undefined,
      type: "individual",
      isFeatured: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Marca como "pending upload" para passar na validação
      form.setValue("imageUrl", "pending-upload", { shouldValidate: true });
      // Reset imageId when a new image is selected
      form.setValue("imageId", undefined);
      setImageId(undefined);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<{ url: string, id: string }> => {
    if (!imageFile) {
      const currentUrl = form.getValues("imageUrl");
      // Se não há arquivo novo e a URL atual é válida (edição), retorna
      if (currentUrl && (currentUrl.startsWith("https://i.ibb.co/") || currentUrl.startsWith("/objects/"))) {
        const currentId = form.getValues("imageId");
        return { url: currentUrl, id: currentId || "" };
      }
      // Se chegou aqui sem arquivo, erro
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem",
        variant: "destructive",
      });
      throw new Error("No image file");
    }

    setUploading(true);
    try {
      // Get ready for upload from backend
      const { auth } = await import("@/lib/firebase");
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("User not authenticated. Please log in again.");
      }
      
      const token = await currentUser.getIdToken();
      
      if (!token) {
        throw new Error("Failed to get authentication token. Please try logging in again.");
      }
      
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error("Failed to prepare for upload");
      }

      const { success } = await response.json();

      if (!success) {
        throw new Error("Server not ready for upload");
      }

      // Create FormData to upload the file
      const formData = new FormData();
      formData.append('file', imageFile);

      // Upload file to backend using FormData
      const uploadResponse = await fetch("/api/upload-content", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        if (uploadResponse.status === 401) {
          throw new Error("Authentication failed during upload. Please log in again.");
        }
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
      }

      const result = await uploadResponse.json();
      return { url: result.imageUrl, id: result.imageId };
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (data: InsertProduct) => {
    try {
      let imageUrl = data.imageUrl;
      let imageId = data.imageId;
      
      // Only upload if we have a new file
      if (imageFile) {
        const uploadResult = await uploadImage();
        imageUrl = uploadResult.url;
        imageId = uploadResult.id;
        setImageId(uploadResult.id);
      }
      
      onSubmit({ ...data, imageUrl, imageId });
    } catch (error) {
      // Error already handled in uploadImage
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
        if (errors.imageUrl) {
          toast({
            title: "Imagem obrigatória",
            description: "Por favor, faça upload de uma imagem do produto",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de validação",
            description: "Verifique todos os campos do formulário",
            variant: "destructive",
          });
        }
      })} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Camisa Social" data-testid="input-product-name" />
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
                  placeholder="Descreva o produto..."
                  rows={3}
                  data-testid="input-product-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  data-testid="input-product-price"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Imagem do Produto <span className="text-destructive">*</span></FormLabel>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center hover-elevate transition-all ${
            form.formState.errors.imageUrl ? 'border-destructive' : 'border-border'
          }`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="product-image"
              data-testid="input-product-image"
            />
            <label htmlFor="product-image" className="cursor-pointer">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setImageFile(null);
                      setImagePreview("");
                      setImageId(undefined);
                      form.setValue("imageUrl", "");
                      form.setValue("imageId", undefined);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique para fazer upload da imagem
                  </p>
                </div>
              )}
            </label>
          </div>
          {form.formState.errors.imageUrl && (
            <p className="text-sm text-destructive">
              {form.formState.errors.imageUrl.message}
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <FormLabel>Produto em Destaque</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Exibir este produto na seção de destaques
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-product-featured"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isPending || uploading}
            className="flex-1"
            data-testid="button-submit-product"
          >
            {uploading ? "Fazendo upload..." : isPending ? "Salvando..." : product ? "Atualizar" : "Criar Produto"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending || uploading}
            data-testid="button-cancel-product"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}

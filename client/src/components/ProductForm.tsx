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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: InsertProduct) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isPending }: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      type: product.type,
      isFeatured: product.isFeatured,
    } : {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      const currentUrl = form.getValues("imageUrl");
      // Se não há arquivo novo e a URL atual é válida (edição), retorna
      if (currentUrl && currentUrl.startsWith("http")) {
        return currentUrl;
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
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      return url;
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
      const imageUrl = await uploadImage();
      onSubmit({ ...data, imageUrl });
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
                      form.setValue("imageUrl", "");
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

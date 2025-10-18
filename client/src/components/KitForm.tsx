import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertKitSchema, type InsertKit, type Kit } from "@shared/schema";
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

interface KitFormProps {
  kit?: Kit;
  onSubmit: (data: InsertKit) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function KitForm({ kit, onSubmit, onCancel, isPending }: KitFormProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(kit?.imageUrls || []);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertKit>({
    resolver: zodResolver(insertKitSchema),
    defaultValues: kit ? {
      name: kit.name,
      description: kit.description,
      price: kit.price,
      imageUrls: kit.imageUrls,
      isFeatured: kit.isFeatured,
    } : {
      name: "",
      description: "",
      price: 0,
      imageUrls: [],
      isFeatured: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const currentUrls = form.getValues("imageUrls");
    form.setValue("imageUrls", currentUrls.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) {
      return form.getValues("imageUrls");
    }

    setUploading(true);
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const timestamp = Date.now();
        const fileName = `kits/${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      });

      const newUrls = await Promise.all(uploadPromises);
      const existingUrls = form.getValues("imageUrls");
      return [...existingUrls, ...newUrls];
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload das imagens",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (data: InsertKit) => {
    try {
      const imageUrls = await uploadImages();
      onSubmit({ ...data, imageUrls });
    } catch (error) {
      // Error already handled in uploadImages
    }
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
                <Input {...field} placeholder="Ex: Conjunto Verão" data-testid="input-kit-name" />
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
                  data-testid="input-kit-price"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Imagens do Kit (Múltiplas)</FormLabel>
          
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover-elevate transition-all">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="kit-images"
              data-testid="input-kit-images"
            />
            <label htmlFor="kit-images" className="cursor-pointer">
              <div className="space-y-2">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique para adicionar imagens
                </p>
                <p className="text-xs text-muted-foreground">
                  Você pode selecionar múltiplas imagens
                </p>
              </div>
            </label>
          </div>
        </div>

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <FormLabel>Kit em Destaque</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Exibir este kit na seção de destaques
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-kit-featured"
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
            data-testid="button-submit-kit"
          >
            {uploading ? "Fazendo upload..." : isPending ? "Salvando..." : kit ? "Atualizar" : "Criar Kit"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending || uploading}
            data-testid="button-cancel-kit"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}

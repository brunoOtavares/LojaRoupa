import { z } from "zod";

// Product Schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().min(0, "Preço deve ser maior ou igual a zero"),
  imageUrl: z.string().refine(
    (val) => val.startsWith("/objects/") || val.startsWith("https://i.ibb.co/"),
    { message: "URL de imagem inválida" }
  ),
  imageId: z.string().optional(), // Store the ImgBB image ID for deletion
  type: z.enum(["individual", "kit"]).default("individual"),
  isFeatured: z.boolean().default(false),
  createdAt: z.number(),
});

export const insertProductSchema = productSchema.omit({ id: true, createdAt: true }).extend({
  imageUrl: z.string().min(1, "Imagem do produto é obrigatória").refine(
    (val) => val === "pending-upload" || val.startsWith("/objects/") || val.startsWith("https://i.ibb.co/"),
    { message: "Por favor, selecione uma imagem do produto" }
  ),
  imageId: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Kit Schema (conjunto de produtos com foto do kit montado)
export const kitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().min(0, "Preço deve ser maior ou igual a zero"),
  imageUrl: z.string().refine(
    (val) => val.startsWith("/objects/") || val.startsWith("https://i.ibb.co/"),
    { message: "URL de imagem inválida" }
  ),
  imageId: z.string().optional(), // Store the ImgBB image ID for deletion
  productIds: z.array(z.string()).min(1, "Selecione pelo menos um produto"),
  isFeatured: z.boolean().default(false),
  createdAt: z.number(),
});

export const insertKitSchema = kitSchema.omit({ id: true, createdAt: true }).extend({
  imageUrl: z.string().min(1, "Imagem do kit é obrigatória").refine(
    (val) => val === "pending-upload" || val.startsWith("/objects/") || val.startsWith("https://i.ibb.co/"),
    { message: "Por favor, selecione uma imagem do kit" }
  ),
  imageId: z.string().optional(),
});

export type Kit = z.infer<typeof kitSchema>;
export type InsertKit = z.infer<typeof insertKitSchema>;

// Store contact info
export interface StoreContact {
  whatsapp: string;
  instagram: string;
  address: string;
}

// Admin user (for Firebase Auth)
export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

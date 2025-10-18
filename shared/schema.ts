import { z } from "zod";

// Product Schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().min(0, "Preço deve ser maior ou igual a zero"),
  imageUrl: z.string().url("URL de imagem inválida"),
  type: z.enum(["individual", "kit"]).default("individual"),
  isFeatured: z.boolean().default(false),
  createdAt: z.number(),
});

export const insertProductSchema = productSchema.omit({ id: true, createdAt: true }).extend({
  imageUrl: z.string().min(1, "Imagem do produto é obrigatória"),
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Kit Schema (conjunto de produtos com foto do kit montado)
export const kitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().min(0, "Preço deve ser maior ou igual a zero"),
  imageUrl: z.string().url("URL de imagem inválida"),
  productIds: z.array(z.string()).min(1, "Selecione pelo menos um produto"),
  isFeatured: z.boolean().default(false),
  createdAt: z.number(),
});

export const insertKitSchema = kitSchema.omit({ id: true, createdAt: true });

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

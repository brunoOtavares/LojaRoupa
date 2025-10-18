import type { Product, Kit } from "@shared/schema";

export function generateWhatsAppLink(item: Product | Kit, phoneNumber: string): string {
  const isKit = 'imageUrls' in item;
  const itemType = isKit ? "kit" : "produto";
  
  const message = `Olá! Estou interessado(a) no ${itemType}:\n${item.name}\nPreço: R$ ${item.price.toFixed(2)}\n\nGostaria de saber mais sobre a disponibilidade.`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // Remove non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export const STORE_WHATSAPP = "5511999999999"; // Placeholder - will be configurable

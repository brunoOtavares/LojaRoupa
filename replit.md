# Loja de Roupas - Vitrine Moderna

## Overview
Site completo de vitrine de loja de roupas com design moderno e minimalista. Permite que clientes vejam produtos e kits, e entrem em contato via WhatsApp. Inclui painel administrativo completo para gerenciar produtos.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Framer Motion
- **Backend**: Express.js, Firebase (Firestore, Storage, Authentication)
- **Routing**: Wouter
- **State Management**: TanStack Query

## Features

### Vitrine Pública
- Hero section com imagem de destaque
- Listagem de todos os produtos e kits
- Filtros por tipo (Todos/Individuais/Kits)
- Seção de itens em destaque
- Cards de produtos com imagem, nome, descrição e preço
- Botão WhatsApp em cada produto gerando mensagem automática
- Página de contato com WhatsApp, Instagram e endereço físico
- Design totalmente responsivo

### Painel Administrativo
- Login com Google (Firebase Auth)
- Gerenciamento de produtos individuais (CRUD completo)
- Gerenciamento de kits/conjuntos (CRUD completo)
- Upload de imagens para Firebase Storage
- Múltiplas imagens para kits
- Marcar produtos/kits como destaque
- Interface intuitiva com preview de imagens

## Project Structure
```
client/
  src/
    components/
      - Header.tsx (navegação principal)
      - Hero.tsx (seção hero da home)
      - ProductCard.tsx (card de produto/kit)
      - ProductGrid.tsx (grid de produtos com filtros)
      - FeaturedSection.tsx (seção de destaques)
      - AdminLayout.tsx (layout do painel admin)
      - ProductForm.tsx (formulário de produto)
      - KitForm.tsx (formulário de kit)
    pages/
      - Home.tsx (página inicial)
      - Featured.tsx (página de destaques)
      - Contact.tsx (página de contato)
      - AdminLogin.tsx (login do admin)
      - AdminProducts.tsx (gerenciamento de produtos)
      - AdminKits.tsx (gerenciamento de kits)
    lib/
      - firebase.ts (configuração Firebase client)
      - whatsapp.ts (utilitários WhatsApp)
      - queryClient.ts (configuração TanStack Query)

server/
  - routes.ts (API endpoints com Firebase Admin)

shared/
  - schema.ts (schemas Zod e tipos TypeScript)
```

## Firebase Collections

### products
- id: string (auto-generated)
- name: string
- description: string
- price: number
- imageUrl: string
- type: "individual" | "kit"
- isFeatured: boolean
- createdAt: number

### kits
- id: string (auto-generated)
- name: string
- description: string
- price: number
- imageUrls: string[]
- isFeatured: boolean
- createdAt: number

## Environment Variables
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_API_KEY

## WhatsApp Integration
Ao clicar em "Ver no WhatsApp", o usuário é redirecionado com mensagem pré-formatada:
```
Olá! Estou interessado(a) no produto/kit:
[Nome do Produto]
Preço: R$ [Preço]

Gostaria de saber mais sobre a disponibilidade.
```

## Design Guidelines
Seguindo design_guidelines.md:
- Cores terracota/coral para accent
- Tipografia Inter em todos os pesos
- Espaçamento consistente (4, 6, 8, 12, 16, 24)
- Cards com aspect ratio 3:4
- Hover effects sutis com elevação
- Botão WhatsApp com cor oficial (#25D366)
- Loading states com skeleton screens
- Responsive design mobile-first

## Recent Changes
- 2025-01-18: Implementação completa do MVP
  - Frontend com todos os componentes
  - Backend Firebase com CRUD completo
  - Sistema de upload de imagens
  - Autenticação com Google
  - Integração WhatsApp

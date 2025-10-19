# Loja de Roupas - Vitrine Moderna

## Overview
Site completo de vitrine de loja de roupas com design moderno e minimalista. Permite que clientes vejam produtos e kits, e entrem em contato via WhatsApp. Inclui painel administrativo completo para gerenciar produtos.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Framer Motion
- **Backend**: Express.js, Firebase (Firestore, Authentication), Replit Object Storage
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
- Login com Email/Senha (Firebase Auth)
- Gerenciamento de produtos individuais (CRUD completo)
- Gerenciamento de kits/conjuntos (CRUD completo)
- Upload de imagens para Replit Object Storage
- Foto única do kit montado + seleção de produtos
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
  - routes.ts (API endpoints com Firebase Admin + Object Storage)
  - objectStorage.ts (Serviço Replit Object Storage)

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
- imageUrl: string (foto do kit montado)
- productIds: string[] (IDs dos produtos que compõem o kit)
- isFeatured: boolean
- createdAt: number

## Environment Variables (Secrets)
- VITE_FIREBASE_PROJECT_ID=michel-multimarcas
- VITE_FIREBASE_APP_ID=1:918302799335:web:0c3c9361afe367a9583942
- VITE_FIREBASE_API_KEY=AIzaSyBnEdEiyfvlHUnYsU3PcSWjuwgvznlobPU
- FIREBASE_SERVICE_ACCOUNT_KEY (JSON completo com credenciais admin)
- SESSION_SECRET (gerado automaticamente)
- DEFAULT_OBJECT_STORAGE_BUCKET_ID (bucket Replit Object Storage)
- PUBLIC_OBJECT_SEARCH_PATHS (caminhos públicos para assets)
- PRIVATE_OBJECT_DIR (diretório privado para uploads)

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
- 2025-10-18: Upload de imagens migrado para Firebase Storage (server-side)
  - Implementado POST /api/upload com multer para receber arquivos
  - Upload server-side para Firebase Storage evita problemas de CORS
  - Limite de upload: 50MB por arquivo
  - URLs de imagem agora são do Firebase Storage (https://storage.googleapis.com)
  - Schemas atualizados para validar URLs completas (.url())
  - Removidas referências ao Replit Object Storage
  
- 2025-01-18: Implementação e configuração completa do MVP
  - Frontend com todos os componentes (Header, Hero, ProductGrid, etc)
  - Backend Firebase Admin SDK com Service Account
  - APIs protegidas com autenticação Firebase
  - Autenticação alterada de Google para Email/Senha
  - Sistema de Kits reformulado para selecionar produtos individuais
  - Kits agora têm uma foto do conjunto montado + produtos selecionados
  - Integração WhatsApp com mensagens automáticas
  - Validação de formulários com Zod (z.coerce.number para preços)
  - Domínio Replit autorizado no Firebase Console
  - Redirecionamento após login para aba Kits

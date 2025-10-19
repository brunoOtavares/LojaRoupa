# StyleVault - Guia de Configuração e Instalação

Este guia irá ajudá-lo a clonar, configurar e executar o projeto StyleVault em sua máquina local ou para部署 (deploy) em produção.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- [Git](https://git-scm.com/)
- Conta no [Firebase](https://firebase.google.com/)
- Conta no [Vercel](https://vercel.com/) (opcional, para deploy em produção)

## 🚀 Passo 1: Clonando o Repositório

1. Abra o terminal ou prompt de comando
2. Navegue até a pasta onde deseja clonar o projeto
3. Execute o seguinte comando:

```bash
git clone [URL-DO-REPOSITORIO]
cd StyleVault
```

## 🔧 Passo 2: Configuração do Firebase

O projeto utiliza o Firebase para autenticação e banco de dados. Siga estes passos para configurar:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. No painel do projeto, siga os passos abaixo:

### 3.1 Configurar Authentication

1. No menu lateral, vá para "Authentication"
2. Clique em "Começar" ou "Get started"
3. Na aba "Método de login", habilite:
   - **Email/Senha** (para login do admin)
4. Na aba "Usuários", adicione um usuário administrador:
   - Email: seu-email-admin@exemplo.com
   - Senha: uma senha segura

### 3.2 Configurar Firestore Database

1. No menu lateral, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar em modo de teste" (para desenvolvimento) ou "Iniciar em modo bloqueado" (para produção)
4. Selecione um local para os dados (recomendado: `southamerica-east1`)

### 3.3 Obter Chaves de Configuração

1. No menu lateral, vá para "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role para baixo até "Seus aplicativos"
3. Se não houver um aplicativo web, clique em "Web" para adicionar
4. Dê um nome ao aplicativo (ex: "StyleVault")
5. Copie as chaves de configuração do Firebase

## 🔑 Passo 3: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env` com base no exemplo:

```bash
cp .env.production.example .env
```

2. Abra o arquivo `.env` e substitua os valores com suas chaves:

```env
# Configuração do Firebase
VITE_FIREBASE_API_KEY=sua-chave-api-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-id-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=sua-app-id

# Configuração do WhatsApp (opcional)
VITE_STORE_WHATSAPP=5511999999999
```

**Importante**: Substitua todos os valores que começam com `sua-` pelos valores reais do seu projeto Firebase.

## 📦 Passo 4: Instalar Dependências

No terminal, na pasta raiz do projeto, execute:

```bash
npm install
```

## 🗄️ Passo 5: Configurar Banco de Dados

O projeto usa Drizzle ORM com PostgreSQL. Você tem duas opções:

### Opção A: Usar PostgreSQL Local

1. Instale o PostgreSQL em sua máquina
2. Crie um banco de dados:
   ```sql
   CREATE DATABASE stylevault;
   ```
3. Configure a conexão no arquivo `drizzle.config.ts`

### Opção B: Usar Vercel Postgres (Recomendado)

1. No painel do Vercel, crie um novo projeto
2. Vá para "Storage" e crie um novo banco de dados PostgreSQL
3. Copie a string de conexão e adicione às variáveis de ambiente

## 🏃‍♂️ Passo 6: Executar o Projeto Localmente

1. No terminal, execute o comando de desenvolvimento:

```bash
npm run dev
```

2. Abra seu navegador e acesse `http://localhost:5173`

3. Para acessar o painel administrativo:
   - Vá para `http://localhost:5173/admin/login`
   - Use o email e senha que configurou no Firebase Authentication

## 🗂️ Estrutura do Projeto

```
StyleVault/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── lib/            # Bibliotecas e utilitários
│   │   └── index.css       # Estilos globais
│   └── public/             # Arquivos estáticos
├── server/                 # Backend (Node.js + Express)
│   ├── routes.ts           # Rotas da API
│   ├── storage.ts          # Configuração de armazenamento
│   └── index.ts            # Ponto de entrada do servidor
├── shared/                 # Código compartilhado
│   └── schema.ts           # Schema do banco de dados
├── api/                    # API para deploy serverless
├── drizzle.config.ts       # Configuração do Drizzle ORM
├── package.json            # Dependências e scripts
├── vite.config.ts          # Configuração do Vite
├── tailwind.config.ts      # Configuração do Tailwind CSS
└── README_SETUP.md         # Este arquivo
```

## 🎨 Personalização

### Alterar Cores e Tema

As cores do tema estão definidas em `client/src/index.css`. As principais variáveis são:

- `--primary`: Cor dourada principal
- `--background`: Cor de fundo (preto)
- `--foreground`: Cor do texto (branco)
- `--card`: Cor dos cards

### Alterar Logo

1. Substitua o arquivo `client/public/logoheader.png`
2. Mantenha as dimensões recomendadas: 200x200px

### Configurar WhatsApp

No arquivo `.env`, altere a variável:
```env
VITE_STORE_WHATSAPP=5511999999999
```
(Substitua pelo seu número de WhatsApp com código do país)

## 🚀 Deploy em Produção

### Deploy no Vercel

1. Crie uma conta no [Vercel](https://vercel.com/)
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente no painel do Vercel
4. Faça o deploy

### Variáveis de Ambiente de Produção

No Vercel, adicione as seguintes variáveis de ambiente:
- Todas as variáveis do Firebase (VITE_FIREBASE_*)
- DATABASE_URL (se usando Vercel Postgres)
- VITE_STORE_WHATSAPP

## 🐛 Solução de Problemas

### Problema: "Firebase não inicializa"

**Solução**: Verifique se as chaves do Firebase no arquivo `.env` estão corretas.

### Problema: "Erro de permissão no Firestore"

**Solução**: 
1. Vá ao Console do Firebase > Firestore > Regras
2. Para desenvolvimento, use:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Problema: "Erro de CORS"

**Solução**: Verifique se as variáveis de ambiente do servidor estão configuradas corretamente.

## 📞 Suporte

Se você encontrar algum problema não documentado aqui, por favor:

1. Verifique os logs do console do navegador
2. Verifique os logs do terminal
3. Confirme se todas as variáveis de ambiente estão configuradas
4. Certifique-se de que o Firebase está properly configurado

---

## 📝 Licença

Este projeto é propriedade de StyleVault. Todos os direitos reservados.
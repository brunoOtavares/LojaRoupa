# 🚀 Setup Rápido - StyleVault

Guia simplificado para configurar o projeto rapidamente.

## 1️⃣ Clonar o Projeto

```bash
git clone [URL-DO-REPOSITORIO]
cd StyleVault
```

## 2️⃣ Instalar Dependências

```bash
npm install
```

## 3️⃣ Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication com Email/Senha
3. Crie um banco de dados Firestore
4. Copie as chaves de configuração

## 4️⃣ Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas chaves do Firebase:

```env
VITE_FIREBASE_API_KEY=sua-chave-api
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-id-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=sua-app-id
VITE_STORE_WHATSAPP=5511999999999
```

## 5️⃣ Executar o Projeto

```bash
npm run dev
```

Acesse:
- Site: http://localhost:5173
- Admin: http://localhost:5173/admin/login

## 📱 Acesso Admin

Use o email e senha que cadastrou no Firebase Authentication.

---

## ⚠️ Problemas Comuns

**Firebase não inicializa?**
Verifique se as chaves no `.env` estão corretas.

**Erro de permissão no Firestore?**
Configure as regras do Firestore para permitir acesso com autenticação.

**Inputs não aparecem?**
Limpe o cache do navegador (Ctrl+F5).

---

Para instruções detalhadas, veja o arquivo [README_SETUP.md](./README_SETUP.md)
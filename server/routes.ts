import type { Express } from "express";
import { createServer, type Server } from "http";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { insertProductSchema, insertKitSchema, type Product, type Kit } from "@shared/schema";
import multer from "multer";
import { randomUUID } from "crypto";

// Initialize Firebase Admin (server-side)
if (getApps().length === 0) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    // Use service account credentials
    const serviceAccount = JSON.parse(serviceAccountKey);
    initializeApp({
      credential: cert(serviceAccount),
      projectId: "michel-multimarcas",
      storageBucket: "michel-multimarcas.appspot.com",
    });
  } else {
    // Fallback to minimal config
    initializeApp({
      projectId: "michel-multimarcas",
      storageBucket: "michel-multimarcas.appspot.com",
    });
  }
}

const db = getFirestore();
const adminAuth = getAuth();
const storage = getStorage().bucket();

// Configure multer for file uploads (memory storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware to verify Firebase ID token
async function verifyAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Products Routes
  app.get("/api/products", async (req, res) => {
    try {
      const snapshot = await db.collection("products").get();
      const products: Product[] = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", verifyAuth, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const docRef = await db.collection("products").add({
        ...data,
        createdAt: Date.now(),
      });
      const doc = await docRef.get();
      const product: Product = { id: doc.id, ...doc.data() } as Product;
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", verifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertProductSchema.parse(req.body);
      await db.collection("products").doc(id).update(data);
      const doc = await db.collection("products").doc(id).get();
      const product: Product = { id: doc.id, ...doc.data() } as Product;
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", verifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("products").doc(id).delete();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Kits Routes
  app.get("/api/kits", async (req, res) => {
    try {
      const snapshot = await db.collection("kits").get();
      const kits: Kit[] = [];
      snapshot.forEach(doc => {
        kits.push({ id: doc.id, ...doc.data() } as Kit);
      });
      res.json(kits);
    } catch (error) {
      console.error("Error fetching kits:", error);
      res.status(500).json({ error: "Failed to fetch kits" });
    }
  });

  app.post("/api/kits", verifyAuth, async (req, res) => {
    try {
      const data = insertKitSchema.parse(req.body);
      const docRef = await db.collection("kits").add({
        ...data,
        createdAt: Date.now(),
      });
      const doc = await docRef.get();
      const kit: Kit = { id: doc.id, ...doc.data() } as Kit;
      res.status(201).json(kit);
    } catch (error) {
      console.error("Error creating kit:", error);
      res.status(400).json({ error: "Failed to create kit" });
    }
  });

  app.put("/api/kits/:id", verifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertKitSchema.parse(req.body);
      await db.collection("kits").doc(id).update(data);
      const doc = await db.collection("kits").doc(id).get();
      const kit: Kit = { id: doc.id, ...doc.data() } as Kit;
      res.json(kit);
    } catch (error) {
      console.error("Error updating kit:", error);
      res.status(400).json({ error: "Failed to update kit" });
    }
  });

  app.delete("/api/kits/:id", verifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("kits").doc(id).delete();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting kit:", error);
      res.status(500).json({ error: "Failed to delete kit" });
    }
  });

  // Firebase Storage Upload Route (server-side upload to avoid CORS)
  app.post("/api/upload", verifyAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.file;
      const fileName = `uploads/${randomUUID()}_${file.originalname}`;
      const fileRef = storage.file(fileName);

      // Upload file to Firebase Storage
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Make file public
      await fileRef.makePublic();

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${storage.name}/${fileName}`;

      res.json({ imageUrl: publicUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import multer from "multer";
import fs from "fs";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { insertProductSchema, insertKitSchema, type Product, type Kit } from "@shared/schema";
import { ImgBBStorageService } from "./imgbbStorage";

// Initialize Firebase Admin (server-side)
if (getApps().length === 0) {
  try {
    // Try to use service account file first
    const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      console.log("Found serviceAccountKey.json file, using it for Firebase Admin initialization");
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      initializeApp({
        credential: cert(serviceAccount),
        projectId: "michel-multimarcas",
      });
      console.log("Firebase Admin initialized with service account file");
    } else {
      // Fallback to environment variable
      console.log("serviceAccountKey.json not found, checking environment variable...");
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      if (serviceAccountKey) {
        console.log("Found FIREBASE_SERVICE_ACCOUNT_KEY, attempting to parse...");
        try {
          // Use service account credentials
          const serviceAccount = JSON.parse(serviceAccountKey);
          console.log("Successfully parsed service account key");
          initializeApp({
            credential: cert(serviceAccount),
            projectId: "michel-multimarcas",
          });
          console.log("Firebase Admin initialized with service account from env");
        } catch (parseError) {
          console.error("Failed to parse service account JSON:", parseError);
          
          // Try to fix common JSON parsing issues with newlines in private key
          const fixedKey = serviceAccountKey.replace(/\\n/g, '\n');
          console.log("Attempting to parse with fixed newlines...");
          const serviceAccount = JSON.parse(fixedKey);
          console.log("Successfully parsed service account key after fixing newlines");
          initializeApp({
            credential: cert(serviceAccount),
            projectId: "michel-multimarcas",
          });
          console.log("Firebase Admin initialized with service account from env (fixed newlines)");
        }
      } else {
        // Fallback to minimal config
        console.warn("No Firebase service account key found in environment variables");
        console.log("Available environment variables:", Object.keys(process.env).filter(key => key.includes('FIREBASE')));
        initializeApp({
          projectId: "michel-multimarcas",
        });
      }
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    // Fallback to minimal config
    initializeApp({
      projectId: "michel-multimarcas",
    });
  }
}

const db = getFirestore();
const adminAuth = getAuth();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

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
      
      // First, get the product to retrieve the image ID
      const productDoc = await db.collection("products").doc(id).get();
      if (!productDoc.exists) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const product = { id: productDoc.id, ...productDoc.data() } as Product;
      
      // Delete the image from ImgBB if we have an image ID
      if (product.imageId) {
        try {
          const imgbbService = new ImgBBStorageService();
          await imgbbService.deleteImage(product.imageId);
          console.log("Successfully deleted image from ImgBB with ID:", product.imageId);
        } catch (imgError) {
          console.error("Failed to delete image from ImgBB:", imgError);
          // Continue with product deletion even if image deletion fails
        }
      }
      
      // Delete the product from the database
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
      
      // First, get the kit to retrieve the image ID
      const kitDoc = await db.collection("kits").doc(id).get();
      if (!kitDoc.exists) {
        return res.status(404).json({ error: "Kit not found" });
      }
      
      const kit = { id: kitDoc.id, ...kitDoc.data() } as Kit;
      
      // Delete the image from ImgBB if we have an image ID
      if (kit.imageId) {
        try {
          const imgbbService = new ImgBBStorageService();
          await imgbbService.deleteImage(kit.imageId);
          console.log("Successfully deleted image from ImgBB with ID:", kit.imageId);
        } catch (imgError) {
          console.error("Failed to delete image from ImgBB:", imgError);
          // Continue with kit deletion even if image deletion fails
        }
      }
      
      // Delete the kit from the database
      await db.collection("kits").doc(id).delete();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting kit:", error);
      res.status(500).json({ error: "Failed to delete kit" });
    }
  });

  // ImgBB Storage Routes
  // Get ready for upload (protected - requires authentication)
  app.post("/api/upload", verifyAuth, async (req, res) => {
    try {
      // For ImgBB, we don't need to pre-generate a path
      // Just return success to indicate the client can proceed with upload
      res.json({ success: true, message: "Ready for upload" });
    } catch (error) {
      console.error("Error preparing for upload:", error);
      res.status(500).json({ error: "Failed to prepare for upload" });
    }
  });

  // Upload file content (protected - requires authentication)
  app.post("/api/upload-content", verifyAuth, upload.single('file'), async (req, res) => {
    try {
      const imgbbService = new ImgBBStorageService();
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "Missing file" });
      }
      
      // Upload to ImgBB
      const uploadResult = await imgbbService.uploadImage(file.buffer, file.originalname);
      
      res.json({ success: true, imageUrl: uploadResult.url, imageId: uploadResult.id });
    } catch (error) {
      console.error("Error uploading to ImgBB:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Serve uploaded images (public - no authentication required)
  // Note: With ImgBB, images are served directly from ImgBB's CDN
  // This route is kept for backward compatibility but will redirect to ImgBB URLs
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      // For ImgBB, we don't serve images locally
      // This route is kept for backward compatibility
      res.status(404).json({ error: "Image not found locally. Images are hosted on ImgBB." });
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

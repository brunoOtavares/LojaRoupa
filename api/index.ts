import { config } from "dotenv";
config();

import express from "express";
import { createServer } from "http";
import path from "path";
import multer from "multer";
import fs from "fs";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Firebase initialization
let firebaseInitialized = false;
let firebaseError: Error | null = null;

if (getApps().length === 0) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      console.log("Found FIREBASE_SERVICE_ACCOUNT_KEY, attempting to parse...");
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        console.log("Successfully parsed service account key");
        initializeApp({
          credential: cert(serviceAccount),
          projectId: "layout-loja"
        });
        firebaseInitialized = true;
        console.log("Firebase Admin initialized with service account from env");
      } catch (parseError) {
        console.error("Failed to parse service account JSON:", parseError);
        const fixedKey = serviceAccountKey.replace(/\\n/g, "\n");
        console.log("Attempting to parse with fixed newlines...");
        try {
          const serviceAccount = JSON.parse(fixedKey);
          console.log("Successfully parsed service account key after fixing newlines");
          initializeApp({
            credential: cert(serviceAccount),
            projectId: "layout-loja"
          });
          firebaseInitialized = true;
          console.log("Firebase Admin initialized with service account from env (fixed newlines)");
        } catch (secondParseError) {
          firebaseError = new Error("Failed to parse service account key JSON");
          console.error("Second attempt to parse service account failed:", secondParseError);
        }
      }
    } else {
      // Try to load from local file for development
      try {
        const serviceAccount = require("./serviceAccountKey.json");
        console.log("Found local serviceAccountKey.json file");
        initializeApp({
          credential: cert(serviceAccount),
          projectId: "layout-loja"
        });
        firebaseInitialized = true;
        console.log("Firebase Admin initialized with local service account file");
      } catch (fileError) {
        console.warn("No local serviceAccountKey.json file found");
        console.warn("No Firebase service account key found in environment variables");
        console.error("CRITICAL: Firebase Admin cannot be initialized without proper credentials.");
        console.error("Please either:");
        console.error("1. Add FIREBASE_SERVICE_ACCOUNT_KEY to your .env file");
        console.error("2. Create a serviceAccountKey.json file in the api/ directory");
        console.error("3. Download the service account key from Firebase Console");
        
        firebaseError = new Error("Firebase Admin not properly initialized - missing service account credentials");
        
        // Initialize without credentials for basic functionality
        initializeApp({
          projectId: "layout-loja"
        });
        console.log("Firebase Admin initialized with project ID only - LIMITED FUNCTIONALITY");
      }
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    firebaseError = error as Error;
    
    // Initialize without credentials for basic functionality
    initializeApp({
      projectId: "layout-loja"
    });
    console.log("Firebase Admin initialized with project ID only as fallback - LIMITED FUNCTIONALITY");
  }
}

const db = getFirestore();
const adminAuth = getAuth();
const upload = multer({ storage: multer.memoryStorage() });

// ImgBB Storage Service
class ImgBBStorageService {
  apiKey: string;
  
  constructor() {
    this.apiKey = process.env.IMGBB_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("IMGBB_API_KEY not set. Image storage not configured.");
    }
  }

  async uploadImage(imageBuffer: Buffer, fileName: string) {
    const formData = new FormData();
    const base64Image = imageBuffer.toString("base64");
    formData.append("image", base64Image);
    formData.append("key", this.apiKey);
    
    try {
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ImgBB upload failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`ImgBB API error: ${result.error?.message || "Unknown error"}`);
      }
      
      return {
        url: result.data.url,
        id: result.data.id
      };
    } catch (error) {
      console.error("Error uploading to ImgBB:", error);
      throw error;
    }
  }

  async deleteImage(imageId: string) {
    try {
      if (!imageId) {
        console.log("No image ID provided, skipping deletion");
        return true;
      }
      
      const formData = new FormData();
      formData.append("key", this.apiKey);
      formData.append("id", imageId);
      
      const response = await fetch("https://api.imgbb.com/1/delete", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ImgBB delete failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`ImgBB API error: ${result.error?.message || "Unknown error"}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting from ImgBB:", error);
      throw error;
    }
  }

  getImageUrl(url: string) {
    return url;
  }
}

// Auth middleware
async function verifyAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const idToken = authHeader.split("Bearer ")[1];
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Create Express app
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any;
  
  const originalResJson = res.json;
  res.json = function(bodyJson: any) {
    capturedJsonResponse = bodyJson;
    return originalResJson.call(res, bodyJson);
  };
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });
  
  next();
});

// API Routes
app.get("/api/products", async (req, res) => {
  try {
    // Check if Firebase is properly initialized
    if (!db) {
      console.error("Firestore database not initialized");
      return res.status(500).json({
        error: "Database not initialized",
        details: "Firebase Admin SDK failed to initialize properly"
      });
    }
    
    // Check if Firebase was initialized with proper credentials
    if (!firebaseInitialized || firebaseError) {
      console.error("Firebase not properly initialized with credentials");
      return res.status(500).json({
        error: "Firebase authentication error",
        details: "Firebase Admin SDK is not properly configured with service account credentials",
        solution: "Please add FIREBASE_SERVICE_ACCOUNT_KEY to your environment variables or create a serviceAccountKey.json file"
      });
    }
    
    const snapshot = await db.collection("products").get();
    const products: any[] = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Provide more specific error information
    let errorMessage = "Failed to fetch products";
    let errorDetails = "";
    
    if (error instanceof Error) {
      if (error.message.includes("permission-denied")) {
        errorMessage = "Permission denied accessing Firestore";
        errorDetails = "Check Firebase security rules or service account permissions";
      } else if (error.message.includes("unavailable") || error.message.includes("timeout")) {
        errorMessage = "Firebase connection timed out";
        errorDetails = "Please try again in a few moments";
      } else if (error.message.includes("7 PERMISSION_DENIED")) {
        errorMessage = "Firebase authentication failed";
        errorDetails = "The service account does not have permission to access Firestore";
      }
    }
    
    res.status(500).json({
      error: errorMessage,
      details: errorDetails || "Check server logs for more information"
    });
  }
});

app.post("/api/products", verifyAuth, async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("products").add({
      ...data,
      createdAt: Date.now()
    });
    const doc = await docRef.get();
    const product = { id: doc.id, ...doc.data() };
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection("products").doc(id).update(data);
    const doc = await db.collection("products").doc(id).get();
    const product = { id: doc.id, ...doc.data() };
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection("products").doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const product: any = { id: productDoc.id, ...productDoc.data() };
    
    if (product.imageId) {
      try {
        const imgbbService = new ImgBBStorageService();
        await imgbbService.deleteImage(product.imageId);
        console.log("Successfully deleted image from ImgBB with ID:", product.imageId);
      } catch (imgError) {
        console.error("Failed to delete image from ImgBB:", imgError);
      }
    }
    
    await db.collection("products").doc(id).delete();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.get("/api/kits", async (req, res) => {
  try {
    const snapshot = await db.collection("kits").get();
    const kits: any[] = [];
    snapshot.forEach((doc) => {
      kits.push({ id: doc.id, ...doc.data() });
    });
    res.json(kits);
  } catch (error) {
    console.error("Error fetching kits:", error);
    res.status(500).json({ error: "Failed to fetch kits" });
  }
});

app.post("/api/kits", verifyAuth, async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("kits").add({
      ...data,
      createdAt: Date.now()
    });
    const doc = await docRef.get();
    const kit = { id: doc.id, ...doc.data() };
    res.status(201).json(kit);
  } catch (error) {
    console.error("Error creating kit:", error);
    res.status(400).json({ error: "Failed to create kit" });
  }
});

app.put("/api/kits/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection("kits").doc(id).update(data);
    const doc = await db.collection("kits").doc(id).get();
    const kit = { id: doc.id, ...doc.data() };
    res.json(kit);
  } catch (error) {
    console.error("Error updating kit:", error);
    res.status(400).json({ error: "Failed to update kit" });
  }
});

app.delete("/api/kits/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const kitDoc = await db.collection("kits").doc(id).get();
    
    if (!kitDoc.exists) {
      return res.status(404).json({ error: "Kit not found" });
    }
    
    const kit: any = { id: kitDoc.id, ...kitDoc.data() };
    
    if (kit.imageId) {
      try {
        const imgbbService = new ImgBBStorageService();
        await imgbbService.deleteImage(kit.imageId);
        console.log("Successfully deleted image from ImgBB with ID:", kit.imageId);
      } catch (imgError) {
        console.error("Failed to delete image from ImgBB:", imgError);
      }
    }
    
    await db.collection("kits").doc(id).delete();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting kit:", error);
    res.status(500).json({ error: "Failed to delete kit" });
  }
});

app.post("/api/upload", verifyAuth, async (req, res) => {
  try {
    res.json({ success: true, message: "Ready for upload" });
  } catch (error) {
    console.error("Error preparing for upload:", error);
    res.status(500).json({ error: "Failed to prepare for upload" });
  }
});

app.post("/api/upload-content", verifyAuth, upload.single("file"), async (req, res) => {
  try {
    const imgbbService = new ImgBBStorageService();
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: "Missing file" });
    }
    
    const uploadResult = await imgbbService.uploadImage(file.buffer, file.originalname);
    res.json({ success: true, imageUrl: uploadResult.url, imageId: uploadResult.id });
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.get("/objects/:objectPath(*)", async (req, res) => {
  try {
    res.status(404).json({ error: "Image not found locally. Images are hosted on ImgBB." });
  } catch (error) {
    console.error("Error serving object:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel
export default app;
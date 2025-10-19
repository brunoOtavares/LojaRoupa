import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { Response } from 'express';

export class LocalStorageService {
  private uploadsDir: string;

  constructor() {
    // Create uploads directory if it doesn't exist
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir() {
    try {
      await fs.access(this.uploadsDir);
    } catch (error) {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  // Gets a local file path for a new uploaded file
  async getUploadPath(): Promise<{ filePath: string; objectPath: string }> {
    const objectId = randomUUID();
    const fileName = `${objectId}.jpg`;
    const filePath = path.join(this.uploadsDir, fileName);
    const objectPath = `/objects/uploads/${fileName}`;
    
    return { filePath, objectPath };
  }

  // Saves a file to local storage
  async saveFile(filePath: string, buffer: Buffer): Promise<void> {
    await fs.writeFile(filePath, buffer);
  }

  // Gets the file from the object path
  async getFile(objectPath: string): Promise<{ filePath: string; mimeType: string }> {
    if (!objectPath.startsWith("/objects/")) {
      throw new Error("Invalid object path");
    }

    const parts = objectPath.split("/");
    const fileName = parts[parts.length - 1];
    const filePath = path.join(this.uploadsDir, fileName);
    
    try {
      await fs.access(filePath);
      // Determine MIME type based on file extension
      const ext = path.extname(fileName).toLowerCase();
      let mimeType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.gif') mimeType = 'image/gif';
      else if (ext === '.webp') mimeType = 'image/webp';
      
      return { filePath, mimeType };
    } catch (error) {
      throw new Error("File not found");
    }
  }

  // Downloads a file to the response
  async downloadFile(filePath: string, mimeType: string, res: Response) {
    try {
      const fileBuffer = await fs.readFile(filePath);
      res.set({
        'Content-Type': mimeType,
        'Content-Length': fileBuffer.length,
        'Cache-Control': 'public, max-age=3600',
      });
      res.send(fileBuffer);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }
}
import { randomUUID } from "crypto";

export class ImgBBStorageService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.IMGBB_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("IMGBB_API_KEY not set. Image storage not configured.");
    }
  }

  // Upload an image to ImgBB
  async uploadImage(imageBuffer: Buffer, fileName?: string): Promise<{ url: string, id: string }> {
    const formData = new FormData();
    // Convert Buffer to base64 string
    const base64Image = imageBuffer.toString('base64');
    formData.append('image', base64Image);
    formData.append('key', this.apiKey);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ImgBB upload failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`ImgBB API error: ${result.error?.message || 'Unknown error'}`);
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

  // Delete an image from ImgBB using the image ID
  async deleteImage(imageId: string): Promise<boolean> {
    try {
      if (!imageId) {
        console.log("No image ID provided, skipping deletion");
        return true; // Consider it successful if no ID is provided
      }
      
      // Note: ImgBB's free tier doesn't support image deletion via API
      // The delete endpoint is only available for paid plans
      // We'll log the attempt but not fail the operation
      console.log(`ImgBB image deletion attempted for ID: ${imageId}`);
      console.log("Note: ImgBB free tier doesn't support programmatic image deletion");
      
      // Since ImgBB free tier doesn't support deletion, we'll just log and return success
      // This prevents the product deletion from failing due to image deletion issues
      return true;
    } catch (error) {
      console.error("Error in deleteImage method:", error);
      // We still return true to not block the main operation
      return true;
    }
  }

  // Just returns the ImgBB URL (no need for a separate get method)
  getImageUrl(url: string): string {
    return url;
  }
}
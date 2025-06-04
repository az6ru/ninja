import { optimizedImages, type OptimizedImage, type InsertOptimizedImage } from "@shared/schema";

export interface IStorage {
  createOptimizedImage(image: InsertOptimizedImage): Promise<OptimizedImage>;
  getOptimizedImage(id: number): Promise<OptimizedImage | undefined>;
  getRecentOptimizations(limit?: number): Promise<OptimizedImage[]>;
}

export class MemStorage implements IStorage {
  private optimizedImages: Map<number, OptimizedImage>;
  private currentId: number;

  constructor() {
    this.optimizedImages = new Map();
    this.currentId = 1;
  }

  async createOptimizedImage(insertImage: InsertOptimizedImage): Promise<OptimizedImage> {
    const id = this.currentId++;
    const image: OptimizedImage = {
      ...insertImage,
      id,
      createdAt: new Date(),
    };
    this.optimizedImages.set(id, image);
    return image;
  }

  async getOptimizedImage(id: number): Promise<OptimizedImage | undefined> {
    return this.optimizedImages.get(id);
  }

  async getRecentOptimizations(limit = 10): Promise<OptimizedImage[]> {
    return Array.from(this.optimizedImages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();

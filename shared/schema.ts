import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const optimizedImages = pgTable("optimized_images", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull(),
  originalSize: integer("original_size").notNull(),
  optimizedSize: integer("optimized_size").notNull(),
  format: text("format").notNull(),
  quality: integer("quality").notNull(),
  compressionRatio: integer("compression_ratio").notNull(),
  processingTime: integer("processing_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOptimizedImageSchema = createInsertSchema(optimizedImages).omit({
  id: true,
  createdAt: true,
});

export type InsertOptimizedImage = z.infer<typeof insertOptimizedImageSchema>;
export type OptimizedImage = typeof optimizedImages.$inferSelect;

// Client-side interfaces for file processing
export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  originalSize: number;
  optimizedSize?: number;
  compressionRatio?: number;
  processingTime?: number;
  error?: string;
  optimizedBlob?: Blob;
}

export interface OptimizationSettings {
  format: 'keep' | 'jpeg' | 'png' | 'webp' | 'avif';
  quality: number;
}

export interface OptimizationResult {
  success: boolean;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  processingTime: number;
  buffer?: Buffer;
  error?: string;
}

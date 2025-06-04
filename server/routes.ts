import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import sharp from "sharp";
import JSZip from "jszip";
import { z } from "zod";
import type { OptimizationResult, OptimizationSettings } from "@shared/schema";
import type { FileFilterCallback } from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла. Разрешены только JPEG, PNG, WebP и AVIF.'));
    }
  },
});

const optimizationSettingsSchema = z.object({
  format: z.enum(['keep', 'jpeg', 'png', 'webp', 'avif']),
  quality: z.number().min(10).max(100),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Single image optimization endpoint
  app.post('/api/optimize', upload.single('image'), async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.Multer.File | undefined;
      if (!file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const settings = optimizationSettingsSchema.parse(JSON.parse(req.body.settings || '{}'));
      const startTime = Date.now();
      
      const result = await optimizeImage(file.buffer, file.mimetype, settings);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      // Store optimization record
      await storage.createOptimizedImage({
        originalName: file.originalname,
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        format: settings.format === 'keep' ? getFormatFromMimetype(file.mimetype) : settings.format,
        quality: settings.quality,
        compressionRatio: result.compressionRatio,
        processingTime: result.processingTime,
      });

      res.json({
        success: true,
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        compressionRatio: result.compressionRatio,
        processingTime: result.processingTime,
        optimizedImage: result.buffer?.toString('base64'),
      });

    } catch (error) {
      console.error('Optimization error:', error);
      res.status(500).json({ error: 'Failed to optimize image' });
    }
  });

  // Batch image optimization endpoint
  app.post('/api/optimize-batch', upload.array('images', 10), async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No image files provided' });
      }

      const settings = optimizationSettingsSchema.parse(JSON.parse(req.body.settings || '{}'));
      
      const results = await Promise.all(
        files.map(async (file) => {
          const result = await optimizeImage(file.buffer, file.mimetype, settings);
          
          if (result.success) {
            await storage.createOptimizedImage({
              originalName: file.originalname,
              originalSize: result.originalSize,
              optimizedSize: result.optimizedSize,
              format: settings.format === 'keep' ? getFormatFromMimetype(file.mimetype) : settings.format,
              quality: settings.quality,
              compressionRatio: result.compressionRatio,
              processingTime: result.processingTime,
            });
          }

          return {
            filename: file.originalname,
            success: result.success,
            originalSize: result.originalSize,
            optimizedSize: result.optimizedSize,
            compressionRatio: result.compressionRatio,
            processingTime: result.processingTime,
            optimizedImage: result.buffer?.toString('base64'),
            error: result.error,
          };
        })
      );

      res.json({ results });

    } catch (error) {
      console.error('Batch optimization error:', error);
      res.status(500).json({ error: 'Failed to optimize images' });
    }
  });

  // Download optimized images as ZIP (теперь через FormData)
  app.post('/api/download-zip', upload.array('files'), async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Нет файлов для архивации' });
      }

      const zip = new JSZip();
      files.forEach((file: Express.Multer.File) => {
        zip.file(file.originalname, file.buffer);
      });

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="optimized-images.zip"');
      res.send(zipBuffer);
    } catch (error) {
      console.error('ZIP creation error:', error);
      res.status(500).json({ error: 'Не удалось создать ZIP файл' });
    }
  });

  // Get optimization statistics
  app.get('/api/stats', async (req, res) => {
    try {
      const recentOptimizations = await storage.getRecentOptimizations(100);
      
      const stats = {
        totalImages: recentOptimizations.length,
        totalSavings: recentOptimizations.reduce((sum, img) => sum + (img.originalSize - img.optimizedSize), 0),
        averageReduction: recentOptimizations.length > 0 
          ? Math.round(recentOptimizations.reduce((sum, img) => sum + img.compressionRatio, 0) / recentOptimizations.length)
          : 0,
        averageProcessingTime: recentOptimizations.length > 0
          ? Math.round(recentOptimizations.reduce((sum, img) => sum + img.processingTime, 0) / recentOptimizations.length)
          : 0,
      };

      res.json(stats);
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function optimizeImage(
  buffer: Buffer,
  mimetype: string,
  settings: OptimizationSettings
): Promise<OptimizationResult> {
  try {
    const startTime = Date.now();
    const originalSize = buffer.length;
    
    let sharpInstance = sharp(buffer);
    
    // Apply format conversion if needed
    if (settings.format !== 'keep') {
      switch (settings.format) {
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality: settings.quality });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality: settings.quality });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: settings.quality });
          break;
        case 'avif':
          sharpInstance = sharpInstance.avif({ quality: settings.quality });
          break;
      }
    } else {
      // Keep original format but apply compression
      const format = getFormatFromMimetype(mimetype);
      switch (format) {
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality: settings.quality });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality: settings.quality });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: settings.quality });
          break;
      }
    }
    
    const optimizedBuffer = await sharpInstance.toBuffer();
    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = Math.round(((originalSize - optimizedSize) / originalSize) * 100);
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      originalSize,
      optimizedSize,
      compressionRatio,
      processingTime,
      buffer: optimizedBuffer,
    };
  } catch (error) {
    console.error('Image optimization error:', error);
    return {
      success: false,
      originalSize: buffer.length,
      optimizedSize: 0,
      compressionRatio: 0,
      processingTime: 0,
      error: error instanceof Error ? error.message : 'Unknown optimization error',
    };
  }
}

function getFormatFromMimetype(mimetype: string): string {
  switch (mimetype) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpeg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    default:
      return 'jpeg';
  }
}

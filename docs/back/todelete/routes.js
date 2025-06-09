// API роуты для Vercel
import { createServer } from 'http';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { storage } from '../server/storage.js';

// Настройка Express
const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));

// Настройка multer для загрузки файлов
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
});

// Настройка обработчиков API
app.post('/api/optimize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const { format, quality } = JSON.parse(req.body.settings || '{}');
    
    let sharpInstance = sharp(req.file.buffer);
    if (format !== 'keep') {
      switch (format) {
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality: Number(quality) });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality: Number(quality) });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: Number(quality) });
          break;
        case 'avif':
          sharpInstance = sharpInstance.avif({ quality: Number(quality) });
          break;
      }
    }
    
    const optimizedBuffer = await sharpInstance.toBuffer();
    const originalSize = req.file.buffer.length;
    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = Math.round(((originalSize - optimizedSize) / originalSize) * 100);

    res.json({
      success: true,
      originalSize,
      optimizedSize,
      compressionRatio,
      optimizedImage: optimizedBuffer.toString('base64'),
    });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize image' });
  }
});

// Обработка для serverless функций Vercel
export default function handler(req, res) {
  return app(req, res);
} 
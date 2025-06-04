// API endpoint для оптимизации изображений на Vercel
import multer from 'multer';
import sharp from 'sharp';

// Настройка multer для обработки multipart/form-data
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB
});

// Middleware для multer в serverless функциях
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false, // Отключаем стандартный парсер, т.к. используем multer
  },
};

export default async function handler(req, res) {
  // Проверяем метод запроса
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Применяем multer middleware
    await runMiddleware(req, res, upload.single('image'));
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    let settings = { format: 'keep', quality: 85 };
    try {
      if (req.body.settings) {
        settings = JSON.parse(req.body.settings);
      }
    } catch (e) {
      console.error('Error parsing settings:', e);
    }
    
    const { format, quality } = settings;
    
    // Оптимизация изображения
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
    } else {
      // Определяем формат из mimetype
      const mimeFormat = req.file.mimetype.split('/')[1];
      switch (mimeFormat) {
        case 'jpeg':
        case 'jpg':
          sharpInstance = sharpInstance.jpeg({ quality: Number(quality) });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality: Number(quality) });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: Number(quality) });
          break;
      }
    }
    
    const optimizedBuffer = await sharpInstance.toBuffer();
    const originalSize = req.file.buffer.length;
    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = Math.round(((originalSize - optimizedSize) / originalSize) * 100);
    
    res.status(200).json({
      success: true,
      originalSize,
      optimizedSize,
      compressionRatio,
      optimizedImage: optimizedBuffer.toString('base64'),
    });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize image: ' + error.message });
  }
} 
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
  console.log('API: optimize called, method:', req.method);
  
  // Добавляем заголовки CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Обработка OPTIONS запроса (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Проверяем метод запроса
  if (req.method !== 'POST') {
    console.log('API: optimize - wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('API: optimize - trying to process request');
    
    // Применяем multer middleware
    await runMiddleware(req, res, upload.single('image'));
    
    console.log('API: optimize - file uploaded:', req.file ? 'yes' : 'no');
    
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
    
    console.log('API: optimize - settings:', JSON.stringify(settings));
    
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
    
    console.log('API: optimize - processing image');
    
    const optimizedBuffer = await sharpInstance.toBuffer();
    const originalSize = req.file.buffer.length;
    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = Math.round(((originalSize - optimizedSize) / originalSize) * 100);
    
    console.log(`API: optimize - image processed, compression ratio: ${compressionRatio}%`);
    
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
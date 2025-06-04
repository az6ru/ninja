// API endpoint для скачивания ZIP архива на Vercel
import multer from 'multer';
import JSZip from 'jszip';

// Настройка multer для обработки multipart/form-data
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
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
  console.log('API: download-zip called, method:', req.method);
  
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
    console.log('API: download-zip - wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('API: download-zip - trying to process request');
    
    // Применяем multer middleware
    await runMiddleware(req, res, upload.array('files'));
    
    const files = req.files;
    console.log('API: download-zip - files uploaded:', files ? files.length : 0);
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Нет файлов для архивации' });
    }

    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.originalname, file.buffer);
      console.log('API: download-zip - added file to zip:', file.originalname);
    });

    console.log('API: download-zip - generating zip file');
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    console.log('API: download-zip - zip generated, size:', zipBuffer.length);
    
    // Устанавливаем заголовки для скачивания
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="optimized-images.zip"');
    res.setHeader('Content-Length', zipBuffer.length);
    
    // Отправляем ZIP архив
    res.status(200).send(zipBuffer);
    console.log('API: download-zip - zip file sent');
  } catch (error) {
    console.error('ZIP creation error:', error);
    res.status(500).json({ error: 'Не удалось создать ZIP файл: ' + error.message });
  }
} 
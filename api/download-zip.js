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
  // Проверяем метод запроса
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Применяем multer middleware
    await runMiddleware(req, res, upload.array('files'));
    
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Нет файлов для архивации' });
    }

    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.originalname, file.buffer);
    });

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Устанавливаем заголовки для скачивания
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="optimized-images.zip"');
    res.setHeader('Content-Length', zipBuffer.length);
    
    // Отправляем ZIP архив
    res.status(200).send(zipBuffer);
  } catch (error) {
    console.error('ZIP creation error:', error);
    res.status(500).json({ error: 'Не удалось создать ZIP файл: ' + error.message });
  }
} 
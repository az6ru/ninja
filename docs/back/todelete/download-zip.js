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

// Функция транслитерации ru → en
function transliterate(str) {
  const map = {
    А:'A',Б:'B',В:'V',Г:'G',Д:'D',Е:'E',Ё:'E',Ж:'Zh',З:'Z',И:'I',Й:'Y',К:'K',Л:'L',М:'M',Н:'N',О:'O',П:'P',Р:'R',С:'S',Т:'T',У:'U',Ф:'F',Х:'Kh',Ц:'Ts',Ч:'Ch',Ш:'Sh',Щ:'Shch',Ъ:'',Ы:'Y',Ь:'',Э:'E',Ю:'Yu',Я:'Ya',
    а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'
  };
  return str.split('').map(char => map[char] || char).join('');
}

export const config = {
  api: {
    bodyParser: false, // Отключаем стандартный парсер, т.к. используем multer
  },
};

export default async function handler(req, res) {
  console.log('=== ZIP HANDLER STARTED ===');
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
      // Попытка перекодировать имя файла из latin1 в utf8
      const origName = file.originalname;
      const utf8Name = Buffer.from(origName, 'latin1').toString('utf8');
      console.log('ORIGINAL NAME:', origName);
      console.log('UTF8 NAME:', utf8Name);
      const safeName = transliterate(utf8Name);
      zip.file(safeName, file.buffer, { binary: true, utf8: true });
      console.log('API: download-zip - added file to zip:', safeName);
    });
    // Добавляем README.txt с адресом сайта
    zip.file('README.txt', 'Файлы оптимизированы на https://imageninja.ru/', { utf8: true });

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
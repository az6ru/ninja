// API endpoint для получения статистики оптимизации на Vercel
export default async function handler(req, res) {
  console.log('API: stats called, method:', req.method);
  
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
  if (req.method !== 'GET') {
    console.log('API: stats - wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('API: stats - generating statistics');
    
    // В serverless окружении нет доступа к базе данных, 
    // поэтому возвращаем заглушку со статистикой
    const stats = {
      totalImages: 1000,
      totalSavings: 5000000000, // 5GB в байтах
      averageReduction: 75, // 75%
      averageProcessingTime: 800, // 800ms
    };
    
    console.log('API: stats - returning statistics:', JSON.stringify(stats));
    res.status(200).json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics: ' + error.message });
  }
} 
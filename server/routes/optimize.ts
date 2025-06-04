import express from 'express';
import multer from 'multer';
import sharp from 'sharp';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

router.post('/', upload.single('image'), async (req, res) => {
  const { format, quality } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const filePath = req.file.path;

  let transformer = sharp(filePath);
  if (format === 'jpeg') {
    transformer = transformer.jpeg({ quality: Number(quality) });
  } else if (format === 'webp') {
    transformer = transformer.webp({ quality: Number(quality) });
  } else if (format === 'png') {
    transformer = transformer.png({ quality: Number(quality) });
  }

  const buffer = await transformer.toBuffer();
  res.set('Content-Type', `image/${format}`);
  res.send(buffer);
});

export default router; 
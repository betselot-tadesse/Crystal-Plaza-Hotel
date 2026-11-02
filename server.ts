import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { fetchAgodaLivePrices, AGODA_CONFIG, buildAgodaBookingUrl } from './server/agodaService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads and local images directories exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const localImagesDir = path.join(process.cwd(), 'public', 'images', 'hotel');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(localImagesDir)) {
  fs.mkdirSync(localImagesDir, { recursive: true });
}

// Configure Multer for direct file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const cleanOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${cleanOriginal}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max per image
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed'));
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ limit: '30mb', extended: true }));

  // Static routes for direct file hosting
  app.use('/uploads', express.static(uploadsDir));
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

  // DIRECT IMAGE UPLOAD ENDPOINT (Single or Multiple)
  app.post('/api/upload', (req: Request, res: Response) => {
    upload.array('images', 12)(req, res, (err) => {
      if (err) {
        console.error('Image upload error:', err);
        return res.status(400).json({ success: false, error: err.message });
      }

      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, error: 'No image file was provided' });
      }

      const uploadedList = files.map((f) => ({
        filename: f.filename,
        originalName: f.originalname,
        url: `/uploads/${f.filename}`,
        size: f.size,
        mimetype: f.mimetype,
        uploadedAt: new Date().toISOString()
      }));

      return res.json({
        success: true,
        message: `Successfully uploaded ${uploadedList.length} image(s)`,
        files: uploadedList,
        primaryUrl: uploadedList[0].url
      });
    });
  });

  // BASE64 UPLOAD ENDPOINT (Fallback for clipboard paste or dataURL)
  app.post('/api/upload/base64', (req: Request, res: Response) => {
    try {
      const { name, data } = req.body;
      if (!data || typeof data !== 'string') {
        return res.status(400).json({ success: false, error: 'No image data provided' });
      }

      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = '.jpg';

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes('png')) extension = '.png';
        else if (mime.includes('webp')) extension = '.webp';
        else if (mime.includes('gif')) extension = '.gif';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(data, 'base64');
      }

      const cleanName = (name || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${Date.now()}-${cleanName}${extension}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);

      return res.json({
        success: true,
        filename,
        url: `/uploads/${filename}`,
        size: buffer.length,
        uploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Base64 upload error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // LIST ALL STORED IMAGES
  app.get('/api/images', (_req: Request, res: Response) => {
    try {
      if (!fs.existsSync(uploadsDir)) {
        return res.json({ images: [] });
      }

      const files = fs.readdirSync(uploadsDir);
      const images = files
        .filter((f) => !f.startsWith('.') && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
        .map((filename) => {
          const filePath = path.join(uploadsDir, filename);
          const stat = fs.statSync(filePath);
          return {
            filename,
            url: `/uploads/${filename}`,
            size: stat.size,
            uploadedAt: stat.mtime.toISOString(),
            formattedSize: (stat.size / 1024).toFixed(1) + ' KB'
          };
        })
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      return res.json({ images });
    } catch (err: any) {
      console.error('List images error:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // DELETE STORED IMAGE
  app.delete('/api/images/:filename', (req: Request, res: Response) => {
    try {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(uploadsDir, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ success: true, message: `Deleted ${filename}` });
      }
      return res.status(404).json({ success: false, error: 'Image not found' });
    } catch (err: any) {
      console.error('Delete image error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Agoda Live Pricing API Endpoint
  // Strictly proxies and manages Agoda authorized communication server-side
  app.get('/api/agoda/prices', async (req: Request, res: Response) => {
    try {
      const checkIn = typeof req.query.checkIn === 'string' ? req.query.checkIn : undefined;
      const checkOut = typeof req.query.checkOut === 'string' ? req.query.checkOut : undefined;
      const guests = typeof req.query.guests === 'string' ? parseInt(req.query.guests, 10) : undefined;

      const result = await fetchAgodaLivePrices({ checkIn, checkOut, guests });
      res.json(result);
    } catch (error: any) {
      console.error('Failed to handle /api/agoda/prices:', error);
      res.status(500).json({
        configured: false,
        livePricingAvailable: false,
        message: 'Prices and availability are updated on Agoda.',
        disclaimer: "Prices are subject to Agoda's current availability, taxes, fees, promotions and booking conditions.",
        fallbackBookingUrl: buildAgodaBookingUrl(),
        rooms: {}
      });
    }
  });

  // Safe public status check (NEVER exposes API keys or secrets)
  app.get('/api/agoda/status', (req: Request, res: Response) => {
    res.json({
      bookingUrl: AGODA_CONFIG.BOOKING_URL,
      isConfigured: Boolean(AGODA_CONFIG.API_ENDPOINT && AGODA_CONFIG.API_KEY && AGODA_CONFIG.PROPERTY_ID),
      propertyIdConfigured: Boolean(AGODA_CONFIG.PROPERTY_ID),
      partnerApiConfigured: Boolean(AGODA_CONFIG.API_ENDPOINT)
    });
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Crystal Plaza Hotel Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

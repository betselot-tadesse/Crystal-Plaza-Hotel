import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { fetchAgodaLivePrices, AGODA_CONFIG, buildAgodaBookingUrl } from './server/agodaService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      server: { middlewareMode: true },
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

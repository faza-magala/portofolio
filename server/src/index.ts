import { serve } from '@hono/node-server';
import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT) || 3001;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Portfolio CMS API is running at http://localhost:${info.port}`);
  }
);

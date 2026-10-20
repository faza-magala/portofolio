import { handle } from 'hono/vercel';
import { app } from '../server/src/app';

export const config = {
  runtime: 'nodejs',
};

export default handle(app);

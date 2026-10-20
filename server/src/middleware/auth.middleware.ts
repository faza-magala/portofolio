import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { authRepository } from '../repositories/auth.repository';

export interface AuthContextVariables {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  rawToken: string;
}

export async function requireAuth(c: Context, next: Next) {
  // Extract token from HttpOnly cookie or Authorization Bearer header
  const cookieToken = getCookie(c, 'portfolio_session');
  const authHeader = c.req.header('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const token = cookieToken || bearerToken;

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized: Session missing' }, 401);
  }

  const session = await authRepository.findSession(token);
  if (!session) {
    return c.json({ success: false, error: 'Unauthorized: Invalid or expired session' }, 401);
  }

  c.set('user', session.user);
  c.set('rawToken', token);

  await next();
}

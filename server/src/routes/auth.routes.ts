import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { authRepository } from '../repositories/auth.repository';
import { verifyPassword, hashPassword, generateToken } from '../utils/crypto';
import { loginSchema, changePasswordSchema } from '../../../shared/src/schemas';
import { requireAuth, type AuthContextVariables } from '../middleware/auth.middleware';
import { rateLimiter } from '../middleware/rateLimit.middleware';

export const authRoutes = new Hono<{ Variables: AuthContextVariables }>();

// Login route (rate limited to 5 attempts per 15 minutes)
authRoutes.post('/login', rateLimiter({ maxRequests: 10, windowMs: 15 * 60 * 1000 }), async (c) => {
  try {
    const body = await c.req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return c.json({ success: false, error: 'Validation failed', details: result.error.flatten() }, 400);
    }

    const { email, password } = result.data;
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      // Simulate verification to prevent timing attack on user existence
      await verifyPassword('dummy', '00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000');
      return c.json({ success: false, error: 'Invalid email or password' }, 401);
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return c.json({ success: false, error: 'Invalid email or password' }, 401);
    }

    // Generate secure session token (30 days validity)
    const rawToken = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const ipAddress = c.req.header('x-forwarded-for') || c.req.header('x-real-ip');
    const userAgent = c.req.header('user-agent');

    await authRepository.createSession(user.id, rawToken, expiresAt, ipAddress, userAgent);
    await authRepository.createAuditLog(user.id, 'AUTH_LOGIN', `Logged in from ${ipAddress || 'unknown'}`);

    // Set secure HttpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    setCookie(c, 'portfolio_session', rawToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'Lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return c.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: rawToken, // Provided for optional Authorization header usage
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return c.json({ success: false, error: 'Internal server error', details: message }, 500);
  }
});

// Logout route
authRoutes.post('/logout', async (c) => {
  const token = c.req.header('portfolio_session') || c.req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    await authRepository.deleteSession(token);
  }

  deleteCookie(c, 'portfolio_session', { path: '/' });
  return c.json({ success: true, message: 'Logged out successfully' });
});

// Get session info
authRoutes.get('/session', requireAuth, async (c) => {
  const user = c.get('user');
  return c.json({
    success: true,
    user,
  });
});

// Change password
authRoutes.post('/change-password', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return c.json({ success: false, error: 'Validation failed', details: result.error.flatten() }, 400);
    }

    const { currentPassword, newPassword } = result.data;
    const dbUser = await authRepository.findUserById(user.id);
    if (!dbUser) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    const isMatch = await verifyPassword(currentPassword, dbUser.passwordHash);
    if (!isMatch) {
      return c.json({ success: false, error: 'Current password incorrect' }, 400);
    }

    const newHash = await hashPassword(newPassword);
    await authRepository.updateUserPassword(user.id, newHash);
    await authRepository.createAuditLog(user.id, 'AUTH_CHANGE_PASSWORD');

    return c.json({ success: true, message: 'Password changed successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ success: false, error: 'Failed to change password', details: message }, 500);
  }
});

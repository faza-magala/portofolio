import { db, schema } from '../db';
import { eq, and, gt } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { hashPassword } from '../utils/crypto';
import { hashToken } from '../utils/crypto';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).get();
  }

  async findUserById(id: string) {
    return db.select().from(schema.users).where(eq(schema.users.id, id)).get();
  }

  // Create a new user with hashed password
  async createUser(params: { username: string; email: string; password: string; role?: string }) {
    const { username, email, password, role = 'user' } = params;
    const id = randomUUID();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    await db
      .insert(schema.users)
      .values({
        id,
        username,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing();
    return db.select().from(schema.users).where(eq(schema.users.id, id)).get();
  }



  async createSession(userId: string, rawToken: string, expiresAtMs: number, ipAddress?: string, userAgent?: string) {
    const hashed = hashToken(rawToken);
    await db.insert(schema.sessions).values({
      id: hashed,
      userId,
      expiresAt: expiresAtMs,
      ipAddress,
      userAgent,
    });
    return hashed;
  }

  async findSession(rawToken: string) {
    const hashed = hashToken(rawToken);
    const now = Date.now();
    const session = await db
      .select({
        sessionId: schema.sessions.id,
        userId: schema.sessions.userId,
        expiresAt: schema.sessions.expiresAt,
        user: {
          id: schema.users.id,
          username: schema.users.username,
          email: schema.users.email,
          role: schema.users.role,
        },
      })
      .from(schema.sessions)
      .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
      .where(and(eq(schema.sessions.id, hashed), gt(schema.sessions.expiresAt, now)))
      .get();

    return session;
  }

  async deleteSession(rawToken: string) {
    const hashed = hashToken(rawToken);
    await db.delete(schema.sessions).where(eq(schema.sessions.id, hashed));
  }

  async updateUserPassword(userId: string, newPasswordHash: string) {
    await db.update(schema.users).set({
      passwordHash: newPasswordHash,
      updatedAt: new Date().toISOString(),
    }).where(eq(schema.users.id, userId));
  }

  async createAuditLog(userId: string | null, action: string, details?: string) {
    await db.insert(schema.auditLogs).values({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: userId || 'anonymous',
      action,
      details,
    });
  }
}

export const authRepository = new AuthRepository();

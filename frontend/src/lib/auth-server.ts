import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    return user;
  } catch {
    return null;
  }
}

export function requireAuth(user: AuthUser | null): Response | null {
  if (!user) {
    return Response.json({ error: 'Не авторизован' }, { status: 401 });
  }
  return null;
}

export function requireAdmin(user: AuthUser | null): Response | null {
  const authError = requireAuth(user);
  if (authError) return authError;
  if (user!.role !== 'ADMIN') {
    return Response.json({ error: 'Нет доступа' }, { status: 403 });
  }
  return null;
}

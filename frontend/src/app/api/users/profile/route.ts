import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const profile = await prisma.user.findUnique({
      where: { id: user!.id },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        subscription: { include: { plan: true } }
      }
    });

    if (!profile) {
      return Response.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return Response.json(profile);
  } catch (error) {
    console.error('GetProfile error:', error);
    return Response.json({ error: 'Ошибка при получении профиля' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const { fullName, phone, avatarUrl } = await request.json();

    const updated = await prisma.user.update({
      where: { id: user!.id },
      data: { fullName, phone, avatarUrl },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        updatedAt: true
      }
    });

    return Response.json(updated);
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return Response.json({ error: 'Ошибка при обновлении профиля' }, { status: 500 });
  }
}

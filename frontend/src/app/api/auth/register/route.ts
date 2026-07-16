import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password, fullName } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: 'Пароль должен быть минимум 6 символов' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [email ? { email } : null, phone ? { phone } : null].filter(Boolean) as any
      }
    });

    if (existingUser) {
      return Response.json({ error: 'Пользователь уже существует' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, phone, passwordHash, fullName },
      select: { id: true, email: true, phone: true, fullName: true, role: true, createdAt: true }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return Response.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return Response.json({ error: 'Ошибка при регистрации' }, { status: 500 });
  }
}

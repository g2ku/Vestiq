import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const clothing = await prisma.clothing.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return Response.json(clothing);
  } catch (error) {
    console.error('GetAllClothing error:', error);
    return Response.json({ error: 'Ошибка при получении каталога' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    const { name, description, category, subcategory, brand, size, color, imageUrl, condition, dailyPrice } = await request.json();

    if (!name || !category || !size || !dailyPrice) {
      return Response.json({ error: 'Заполните обязательные поля' }, { status: 400 });
    }

    const clothing = await prisma.clothing.create({
      data: {
        name,
        description,
        category,
        subcategory,
        brand,
        size,
        color,
        imageUrl,
        condition: condition || 'EXCELLENT',
        dailyPrice
      }
    });

    return Response.json(clothing, { status: 201 });
  } catch (error) {
    console.error('CreateClothing error:', error);
    return Response.json({ error: 'Ошибка при создании одежды' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clothing = await prisma.clothing.findUnique({ where: { id } });

    if (!clothing) {
      return Response.json({ error: 'Вещь не найдена' }, { status: 404 });
    }

    return Response.json(clothing);
  } catch (error) {
    console.error('GetClothingById error:', error);
    return Response.json({ error: 'Ошибка при получении вещи' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    const { id } = await params;
    const updateData = await request.json();

    const clothing = await prisma.clothing.update({
      where: { id },
      data: updateData
    });

    return Response.json(clothing);
  } catch (error) {
    console.error('UpdateClothing error:', error);
    return Response.json({ error: 'Ошибка при обновлении одежды' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    const { id } = await params;
    await prisma.clothing.delete({ where: { id } });

    return Response.json({ message: 'Одежда удалена' });
  } catch (error) {
    console.error('DeleteClothing error:', error);
    return Response.json({ error: 'Ошибка при удалении одежды' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const { id } = await params;

    const rental = await prisma.rentalOrder.findFirst({
      where: {
        id,
        userId: user!.id,
        status: 'PENDING'
      },
      include: { items: true }
    });

    if (!rental) {
      return Response.json({ error: 'Аренда не найдена или уже активна' }, { status: 404 });
    }

    await prisma.rentalOrder.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    for (const item of rental.items) {
      await prisma.clothing.update({
        where: { id: item.clothingId },
        data: {
          quantity: { increment: 1 },
          isAvailable: true
        }
      });
    }

    return Response.json({ message: 'Аренда отменена' });
  } catch (error) {
    console.error('CancelRental error:', error);
    return Response.json({ error: 'Ошибка при отмене' }, { status: 500 });
  }
}

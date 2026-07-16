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
    const { condition } = await request.json();

    const rental = await prisma.rentalOrder.findFirst({
      where: {
        id,
        userId: user!.id,
        status: { in: ['PENDING', 'ACTIVE'] }
      },
      include: { items: true }
    });

    if (!rental) {
      return Response.json({ error: 'Аренда не найдена' }, { status: 404 });
    }

    await prisma.rentalOrder.update({
      where: { id },
      data: { status: 'RETURNED' }
    });

    for (const item of rental.items) {
      await prisma.rentalItem.update({
        where: { id: item.id },
        data: {
          returnDate: new Date(),
          conditionAtReturn: condition || 'EXCELLENT'
        }
      });

      await prisma.clothing.update({
        where: { id: item.clothingId },
        data: {
          quantity: { increment: 1 },
          isAvailable: true
        }
      });
    }

    return Response.json({ message: 'Аренда завершена' });
  } catch (error) {
    console.error('ReturnRental error:', error);
    return Response.json({ error: 'Ошибка при возврате' }, { status: 500 });
  }
}

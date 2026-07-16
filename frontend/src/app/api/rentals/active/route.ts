import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const rentals = await prisma.rentalOrder.findMany({
      where: {
        userId: user!.id,
        status: { in: ['PENDING', 'ACTIVE'] }
      },
      include: {
        items: { include: { clothing: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json(rentals);
  } catch (error) {
    console.error('GetActiveRentals error:', error);
    return Response.json({ error: 'Ошибка при получении активных аренд' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const subscription = await prisma.userSubscription.findFirst({
      where: { userId: user!.id, status: 'ACTIVE' }
    });

    if (!subscription) {
      return Response.json({ error: 'Активная подписка не найдена' }, { status: 404 });
    }

    const activeRentals = await prisma.rentalOrder.count({
      where: {
        userId: user!.id,
        status: { in: ['PENDING', 'ACTIVE'] }
      }
    });

    if (activeRentals > 0) {
      return Response.json({ error: 'Невозможно отменить подписку с активными арендами' }, { status: 400 });
    }

    const updated = await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED' },
      include: { plan: true }
    });

    return Response.json({
      ...updated,
      plan: {
        ...updated.plan,
        features: JSON.parse(updated.plan.features)
      }
    });
  } catch (error) {
    console.error('CancelSubscription error:', error);
    return Response.json({ error: 'Ошибка при отмене подписки' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user!.id,
        status: 'ACTIVE'
      },
      include: {
        plan: true,
        rentals: {
          where: { status: { in: ['PENDING', 'ACTIVE'] } },
          include: {
            items: { include: { clothing: true } }
          }
        }
      }
    });

    if (!subscription) {
      return Response.json(null);
    }

    return Response.json({
      ...subscription,
      plan: {
        ...subscription.plan,
        features: JSON.parse(subscription.plan.features)
      }
    });
  } catch (error) {
    console.error('GetCurrentSubscription error:', error);
    return Response.json({ error: 'Ошибка при получении подписки' }, { status: 500 });
  }
}

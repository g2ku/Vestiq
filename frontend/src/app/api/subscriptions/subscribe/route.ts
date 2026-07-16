import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const { planId } = await request.json();

    if (!planId) {
      return Response.json({ error: 'Выберите план подписки' }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return Response.json({ error: 'План не найден' }, { status: 404 });
    }

    const existingSubscription = await prisma.userSubscription.findFirst({
      where: { userId: user!.id, status: 'ACTIVE' }
    });

    if (existingSubscription) {
      return Response.json({ error: 'У вас уже есть активная подписка' }, { status: 400 });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: user!.id,
        planId,
        endDate
      },
      include: { plan: true }
    });

    return Response.json({
      ...subscription,
      plan: {
        ...subscription.plan,
        features: JSON.parse(subscription.plan.features)
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Subscribe error:', error);
    return Response.json({ error: 'Ошибка при оформлении подписки' }, { status: 500 });
  }
}

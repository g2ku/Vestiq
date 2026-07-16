import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const rentals = await prisma.rentalOrder.findMany({
      where: { userId: user!.id },
      include: {
        items: { include: { clothing: true } },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json(rentals);
  } catch (error) {
    console.error('GetMyRentals error:', error);
    return Response.json({ error: 'Ошибка при получении аренд' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const { clothingIds, startDate, endDate } = await request.json();

    if (!clothingIds || !Array.isArray(clothingIds) || clothingIds.length === 0) {
      return Response.json({ error: 'Выберите хотя бы одну вещь' }, { status: 400 });
    }
    if (!startDate || !endDate) {
      return Response.json({ error: 'Укажите даты начала и окончания' }, { status: 400 });
    }

    const subscription = await prisma.userSubscription.findFirst({
      where: { userId: user!.id, status: 'ACTIVE' },
      include: { plan: true }
    });

    if (!subscription) {
      return Response.json({ error: 'У вас нет активной подписки' }, { status: 400 });
    }

    const activeRentalsCount = await prisma.rentalItem.count({
      where: {
        order: { userId: user!.id, status: { in: ['PENDING', 'ACTIVE'] } }
      }
    });

    if (activeRentalsCount + clothingIds.length > subscription.plan.maxItems) {
      return Response.json({
        error: `Вы можете арендовать максимум ${subscription.plan.maxItems} вещей`
      }, { status: 400 });
    }

    const clothingItems = await prisma.clothing.findMany({
      where: {
        id: { in: clothingIds },
        isAvailable: true,
        quantity: { gt: 0 }
      }
    });

    if (clothingItems.length !== clothingIds.length) {
      return Response.json({ error: 'Некоторые вещи недоступны или закончились на складе' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = clothingItems.reduce((sum, item) => sum + item.dailyPrice * days, 0);

    const rental = await prisma.rentalOrder.create({
      data: {
        userId: user!.id,
        subscriptionId: subscription.id,
        startDate: start,
        endDate: end,
        totalPrice,
        status: 'PENDING',
        items: {
          create: clothingIds.map((clothingId: string) => ({ clothingId }))
        }
      },
      include: {
        items: { include: { clothing: true } }
      }
    });

    for (const clothingId of clothingIds) {
      const item = clothingItems.find(c => c.id === clothingId);
      if (!item) continue;
      const newQuantity = item.quantity - 1;
      await prisma.clothing.update({
        where: { id: clothingId },
        data: { quantity: newQuantity, isAvailable: newQuantity > 0 }
      });
    }

    return Response.json(rental, { status: 201 });
  } catch (error) {
    console.error('CreateRental error:', error);
    return Response.json({ error: 'Ошибка при создании аренды' }, { status: 500 });
  }
}

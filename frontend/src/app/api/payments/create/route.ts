import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const { orderId, paymentMethod } = await request.json();

    if (!orderId) {
      return Response.json({ error: 'Укажите ID заказа' }, { status: 400 });
    }
    if (!paymentMethod || !['kaspi', 'halyk', 'card'].includes(paymentMethod)) {
      return Response.json({ error: 'Некорректный способ оплаты' }, { status: 400 });
    }

    const order = await prisma.rentalOrder.findFirst({
      where: {
        id: orderId,
        userId: user!.id,
        status: 'PENDING'
      }
    });

    if (!order) {
      return Response.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    const existingPayment = await prisma.payment.findFirst({ where: { orderId } });
    if (existingPayment) {
      return Response.json({ error: 'Платеж уже создан' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user!.id,
        orderId,
        amount: order.totalPrice,
        paymentMethod,
        status: 'PENDING'
      }
    });

    const paymentUrl = `https://pay.kaspi.kz/${payment.id}`;

    return Response.json({ payment, paymentUrl, message: 'Перейдите по ссылке для оплаты' }, { status: 201 });
  } catch (error) {
    console.error('CreatePayment error:', error);
    return Response.json({ error: 'Ошибка при создании платежа' }, { status: 500 });
  }
}

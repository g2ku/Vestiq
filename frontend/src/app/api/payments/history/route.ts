import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const payments = await prisma.payment.findMany({
      where: { userId: user!.id },
      include: {
        order: {
          include: {
            items: { include: { clothing: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json(payments);
  } catch (error) {
    console.error('GetPaymentHistory error:', error);
    return Response.json({ error: 'Ошибка при получении истории платежей' }, { status: 500 });
  }
}

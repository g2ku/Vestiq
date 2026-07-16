import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { transactionId, status, orderId } = await request.json();

    await prisma.payment.update({
      where: { orderId },
      data: {
        status: status === 'success' ? 'COMPLETED' : 'FAILED',
        transactionId
      }
    });

    if (status === 'success') {
      await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status: 'ACTIVE' }
      });
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Webhook error' }, { status: 500 });
  }
}

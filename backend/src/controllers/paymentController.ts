import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';

export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentMethod } = req.body;

    // Find the order
    const order = await prisma.rentalOrder.findFirst({
      where: {
        id: orderId,
        userId: req.user!.id,
        status: 'PENDING'
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId }
    });

    if (existingPayment) {
      return res.status(400).json({ error: 'Платеж уже создан' });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.id,
        orderId,
        amount: order.totalPrice,
        paymentMethod,
        status: 'PENDING'
      }
    });

    // In real app, integrate with Kaspi/Halyk API here
    // For now, simulate payment link generation
    const paymentUrl = `https://pay.kaspi.kz/${payment.id}`;

    res.status(201).json({
      payment,
      paymentUrl,
      message: 'Перейдите по ссылке для оплаты'
    });
  } catch (error) {
    console.error('CreatePayment error:', error);
    res.status(500).json({ error: 'Ошибка при создании платежа' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { transactionId, status, orderId } = req.body;

    // Verify webhook signature in production!
    
    // Update payment status
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: status === 'success' ? 'COMPLETED' : 'FAILED',
        transactionId
      }
    });

    // If payment successful, activate the rental
    if (status === 'success') {
      await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status: 'ACTIVE' }
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook error' });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      include: {
        order: {
          include: {
            items: {
              include: { clothing: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (error) {
    console.error('GetPaymentHistory error:', error);
    res.status(500).json({ error: 'Ошибка при получении истории платежей' });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' }
    });

    // Parse features JSON string to array
    const parsedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features)
    }));

    res.json(parsedPlans);
  } catch (error) {
    console.error('GetPlans error:', error);
    res.status(500).json({ error: 'Ошибка при получении планов' });
  }
};

export const getCurrentSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: req.user!.id,
        status: 'ACTIVE'
      },
      include: {
        plan: true,
        rentals: {
          where: { status: { in: ['PENDING', 'ACTIVE'] } },
          include: {
            items: {
              include: { clothing: true }
            }
          }
        }
      }
    });

    if (!subscription) {
      return res.json(null);
    }

    // Parse features JSON string to array
    const parsedSubscription = {
      ...subscription,
      plan: {
        ...subscription.plan,
        features: JSON.parse(subscription.plan.features)
      }
    };

    res.json(parsedSubscription);
  } catch (error) {
    console.error('GetCurrentSubscription error:', error);
    res.status(500).json({ error: 'Ошибка при получении подписки' });
  }
};

export const subscribe = async (req: AuthRequest, res: Response) => {
  try {
    const { planId } = req.body;

    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return res.status(404).json({ error: 'План не найден' });
    }

    // Check if user already has active subscription
    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId: req.user!.id,
        status: 'ACTIVE'
      }
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'У вас уже есть активная подписка' });
    }

    // Calculate end date (30 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Create subscription
    const subscription = await prisma.userSubscription.create({
      data: {
        userId: req.user!.id,
        planId,
        endDate
      },
      include: {
        plan: true
      }
    });

    // Parse features JSON string to array
    const parsedSubscription = {
      ...subscription,
      plan: {
        ...subscription.plan,
        features: JSON.parse(subscription.plan.features)
      }
    };

    res.status(201).json(parsedSubscription);
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Ошибка при оформлении подписки' });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: req.user!.id,
        status: 'ACTIVE'
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Активная подписка не найдена' });
    }

    // Check if there are active rentals
    const activeRentals = await prisma.rentalOrder.count({
      where: {
        userId: req.user!.id,
        status: { in: ['PENDING', 'ACTIVE'] }
      }
    });

    if (activeRentals > 0) {
      return res.status(400).json({ 
        error: 'Невозможно отменить подписку с активными арендами' 
      });
    }

    // Cancel subscription
    const updatedSubscription = await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED' },
      include: { plan: true }
    });

    // Parse features JSON string to array
    const parsedSubscription = {
      ...updatedSubscription,
      plan: {
        ...updatedSubscription.plan,
        features: JSON.parse(updatedSubscription.plan.features)
      }
    };

    res.json(parsedSubscription);
  } catch (error) {
    console.error('CancelSubscription error:', error);
    res.status(500).json({ error: 'Ошибка при отмене подписки' });
  }
};

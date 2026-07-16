import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';

export const getMyRentals = async (req: AuthRequest, res: Response) => {
  try {
    const rentals = await prisma.rentalOrder.findMany({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: { clothing: true }
        },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(rentals);
  } catch (error) {
    console.error('GetMyRentals error:', error);
    res.status(500).json({ error: 'Ошибка при получении аренд' });
  }
};

export const getActiveRentals = async (req: AuthRequest, res: Response) => {
  try {
    const rentals = await prisma.rentalOrder.findMany({
      where: {
        userId: req.user!.id,
        status: { in: ['PENDING', 'ACTIVE'] }
      },
      include: {
        items: {
          include: { clothing: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(rentals);
  } catch (error) {
    console.error('GetActiveRentals error:', error);
    res.status(500).json({ error: 'Ошибка при получении активных аренд' });
  }
};

export const createRental = async (req: AuthRequest, res: Response) => {
  try {
    const { clothingIds, startDate, endDate } = req.body;

    // Check if user has active subscription
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: req.user!.id,
        status: 'ACTIVE'
      },
      include: { plan: true }
    });

    if (!subscription) {
      return res.status(400).json({ error: 'У вас нет активной подписки' });
    }

    // Check how many items user currently has on rent
    const activeRentalsCount = await prisma.rentalItem.count({
      where: {
        order: {
          userId: req.user!.id,
          status: { in: ['PENDING', 'ACTIVE'] }
        }
      }
    });

    if (activeRentalsCount + clothingIds.length > subscription.plan.maxItems) {
      return res.status(400).json({ 
        error: `Вы можете арендовать максимум ${subscription.plan.maxItems} вещей` 
      });
    }

    // Check if all clothing items are available and have stock
    const clothingItems = await prisma.clothing.findMany({
      where: {
        id: { in: clothingIds },
        isAvailable: true,
        quantity: { gt: 0 }
      }
    });

    if (clothingItems.length !== clothingIds.length) {
      return res.status(400).json({ error: 'Некоторые вещи недоступны или закончились на складе' });
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = clothingItems.reduce((sum, item) => sum + item.dailyPrice * days, 0);

    // Create rental order with items
    const rental = await prisma.rentalOrder.create({
      data: {
        userId: req.user!.id,
        subscriptionId: subscription.id,
        startDate: start,
        endDate: end,
        totalPrice,
        status: 'PENDING',
        items: {
          create: clothingIds.map((clothingId: string) => ({
            clothingId
          }))
        }
      },
      include: {
        items: {
          include: { clothing: true }
        }
      }
    });

    // Decrement quantity for each rented item
    for (const clothingId of clothingIds) {
      const item = clothingItems.find(c => c.id === clothingId);
      if (!item) continue;

      const newQuantity = item.quantity - 1;
      await prisma.clothing.update({
        where: { id: clothingId },
        data: {
          quantity: newQuantity,
          isAvailable: newQuantity > 0
        }
      });
    }

    res.status(201).json(rental);
  } catch (error) {
    console.error('CreateRental error:', error);
    res.status(500).json({ error: 'Ошибка при создании аренды' });
  }
};

export const returnRental = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { condition } = req.body;

    // Find rental
    const rental = await prisma.rentalOrder.findFirst({
      where: {
        id,
        userId: req.user!.id,
        status: { in: ['PENDING', 'ACTIVE'] }
      },
      include: { items: true }
    });

    if (!rental) {
      return res.status(404).json({ error: 'Аренда не найдена' });
    }

    // Update rental status
    await prisma.rentalOrder.update({
      where: { id },
      data: { status: 'RETURNED' }
    });

    // Update items and restore clothing quantity
    for (const item of rental.items) {
      await prisma.rentalItem.update({
        where: { id: item.id },
        data: {
          returnDate: new Date(),
          conditionAtReturn: condition || 'EXCELLENT'
        }
      });

      // Restore quantity and ensure availability
      await prisma.clothing.update({
        where: { id: item.clothingId },
        data: {
          quantity: { increment: 1 },
          isAvailable: true
        }
      });
    }

    res.json({ message: 'Аренда завершена' });
  } catch (error) {
    console.error('ReturnRental error:', error);
    res.status(500).json({ error: 'Ошибка при возврате' });
  }
};

export const cancelRental = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Find rental
    const rental = await prisma.rentalOrder.findFirst({
      where: {
        id,
        userId: req.user!.id,
        status: 'PENDING'
      },
      include: { items: true }
    });

    if (!rental) {
      return res.status(404).json({ error: 'Аренда не найдена или уже активна' });
    }

    // Update rental status
    await prisma.rentalOrder.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // Restore clothing quantity
    const clothingIds = rental.items.map(item => item.clothingId);
    for (const clothingId of clothingIds) {
      await prisma.clothing.update({
        where: { id: clothingId },
        data: {
          quantity: { increment: 1 },
          isAvailable: true
        }
      });
    }

    res.json({ message: 'Аренда отменена' });
  } catch (error) {
    console.error('CancelRental error:', error);
    res.status(500).json({ error: 'Ошибка при отмене' });
  }
};

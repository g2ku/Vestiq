import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        subscription: {
          include: { plan: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phone, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        fullName,
        phone,
        avatarUrl
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        createdAt: true,
        subscription: {
          include: { plan: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};

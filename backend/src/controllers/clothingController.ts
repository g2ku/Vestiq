import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';

export const getAllClothing = async (req: Request, res: Response) => {
  try {
    const { category, size, brand, color, available } = req.query;

    const where: any = {};

    if (category) where.category = category as string;
    if (size) where.size = size as string;
    if (brand) where.brand = { contains: brand as string, mode: 'insensitive' };
    if (color) where.color = color as string;
    if (available !== undefined) where.isAvailable = available === 'true';

    const clothing = await prisma.clothing.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(clothing);
  } catch (error) {
    console.error('GetAllClothing error:', error);
    res.status(500).json({ error: 'Ошибка при получении каталога' });
  }
};

export const getClothingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const clothing = await prisma.clothing.findUnique({
      where: { id }
    });

    if (!clothing) {
      return res.status(404).json({ error: 'Вещь не найдена' });
    }

    res.json(clothing);
  } catch (error) {
    console.error('GetClothingById error:', error);
    res.status(500).json({ error: 'Ошибка при получении вещи' });
  }
};

export const createClothing = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category, subcategory, brand, size, color, imageUrl, condition, dailyPrice } = req.body;

    const clothing = await prisma.clothing.create({
      data: {
        name,
        description,
        category,
        subcategory,
        brand,
        size,
        color,
        imageUrl,
        condition: condition || 'EXCELLENT',
        dailyPrice
      }
    });

    res.status(201).json(clothing);
  } catch (error) {
    console.error('CreateClothing error:', error);
    res.status(500).json({ error: 'Ошибка при создании одежды' });
  }
};

export const updateClothing = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const clothing = await prisma.clothing.update({
      where: { id },
      data: updateData
    });

    res.json(clothing);
  } catch (error) {
    console.error('UpdateClothing error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении одежды' });
  }
};

export const deleteClothing = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.clothing.delete({
      where: { id }
    });

    res.json({ message: 'Одежда удалена' });
  } catch (error) {
    console.error('DeleteClothing error:', error);
    res.status(500).json({ error: 'Ошибка при удалении одежды' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.clothing.findMany({
      select: { category: true },
      distinct: ['category']
    });

    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('GetCategories error:', error);
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
};

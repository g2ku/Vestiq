import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.clothing.findMany({
      select: { category: true },
      distinct: ['category']
    });

    return Response.json(categories.map(c => c.category));
  } catch (error) {
    console.error('GetCategories error:', error);
    return Response.json({ error: 'Ошибка при получении категорий' }, { status: 500 });
  }
}

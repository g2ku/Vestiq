import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' }
    });

    const parsedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features)
    }));

    return Response.json(parsedPlans);
  } catch (error) {
    console.error('GetPlans error:', error);
    return Response.json({ error: 'Ошибка при получении планов' }, { status: 500 });
  }
}

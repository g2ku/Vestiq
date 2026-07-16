import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.payment.deleteMany();
  await prisma.rentalItem.deleteMany();
  await prisma.rentalOrder.deleteMany();
  await prisma.userSubscription.deleteMany();
  await prisma.clothing.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.user.deleteMany();

  // === ТАРИФНЫЕ ПЛАНЫ ===
  await prisma.subscriptionPlan.create({
    data: {
      name: 'Basic',
      description: 'Для тех, кто хочет попробовать. Базовые вещи на каждый день.',
      priceMonthly: 15000,
      maxItems: 2,
      rentalDays: 7,
      features: JSON.stringify([
        '2 вещи одновременно',
        'Аренда на 7 дней',
        'Каталог повседневной одежды',
        'Бесплатная доставка по Алматы',
        'Базовая чистка включена'
      ])
    }
  });

  await prisma.subscriptionPlan.create({
    data: {
      name: 'Premium',
      description: 'Для активных пользователей. Эксклюзивные бренды и детские товары.',
      priceMonthly: 35000,
      maxItems: 5,
      rentalDays: 14,
      features: JSON.stringify([
        '5 вещей одновременно',
        'Аренда на 14 дней',
        'Полный каталог + эксклюзивные бренды',
        'Детские товары и украшения',
        'Бесплатная доставка по Казахстану',
        'Приоритетная поддержка 24/7'
      ])
    }
  });

  await prisma.subscriptionPlan.create({
    data: {
      name: 'VIP',
      description: 'Без ограничений. Премиум, детское, украшения + туристический пакет.',
      priceMonthly: 65000,
      maxItems: 10,
      rentalDays: 30,
      features: JSON.stringify([
        '10 вещей одновременно',
        'Аренда на 30 дней',
        'Все категории без ограничений',
        'Персональный стилист',
        'Эксклюзивные дизайнерские вещи',
        'Туристические готовые комплекты',
        'Бесплатная доставка по всему Казахстану',
        'Страхование вещей включено'
      ])
    }
  });

  console.log('✅ Plans created');

  // === ОДЕЖДА ===
  const clothing = [
    { name: 'Классическая белая рубашка', description: 'Элегантная белая рубашка из 100% египетского хлопка с воротником на пуговицах. Идеальна для деловых встреч и официальных мероприятий. Плотность ткани 120 г/м² — не просвечивает, легко гладится.', komplekt: 'Рубашка + запасные пуговицы + чехол для хранения', category: 'Одежда', subcategory: 'Рубашки', brand: 'ZARA', size: 'M', color: 'Белый', condition: 'EXCELLENT', dailyPrice: 2000, deposit: 8000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop' },
    { name: 'Рубашка оверсайз в клетку', description: 'Свободная рубашка в мелкую клетку из мягского хлопка. Спущен плечи создаёт расслабленный street-style образ. Два нагрудных кармана с клапанами.', komplekt: 'Рубашка + фирменная бирка', category: 'Одежда', subcategory: 'Рубашки', brand: 'H&M', size: 'L', color: 'Синий/Белый', condition: 'EXCELLENT', dailyPrice: 1800, deposit: 6000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=500&fit=crop' },
    { name: 'Рубашка с пастернаком', description: 'Элегантная рубашка из тонкого хлопка с растительным принтом. Узкий воротник-стойка, скрытая застёжка. Подходит для тех, кто ценит уникальные детали.', komplekt: 'Рубашка + фирменная бирка', category: 'Одежда', subcategory: 'Рубашки', brand: 'Massimo Dutti', size: 'M', color: 'Белый', condition: 'NEW', dailyPrice: 2800, deposit: 9000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop' },
    { name: 'Базовая футболка oversize', description: 'Хлопковая футболка свободного кроя плотностью 180 г/м². Округлый вырез, усиленные швы на плечах. Универсальная вещь для повседневного образа.', komplekt: 'Футболка + фирменная упаковка', category: 'Одежда', subcategory: 'Футболки', brand: 'Bershka', size: 'M', color: 'Черный', condition: 'NEW', dailyPrice: 1200, deposit: 4000, quantity: 8, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop' },
    { name: 'Поло с вышивкой', description: 'Классическое поло из пике с фирменной вышивкой на груди. Двухслойный воротник, три пуговицы. Подходит для гольфа, прогулок и неформальных встреч.', komplekt: 'Поло + фирменный чехол', category: 'Одежда', subcategory: 'Футболки', brand: 'Lacoste', size: 'M', color: 'Тёмно-зелёный', condition: 'EXCELLENT', dailyPrice: 3000, deposit: 10000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1625910513413-5fc424f25883?w=400&h=500&fit=crop' },
    { name: 'Футболка с логотипом', description: 'Базовая футболка из мягкого хлопка с минималистичным логотипом на груди. Прямой крой, средняя плотность. Идеально сочетается с джинсами и кроссовками.', komplekt: 'Футболка + фирменная упаковка', category: 'Одежда', subcategory: 'Футболки', brand: 'Nike', size: 'L', color: 'Белый', condition: 'NEW', dailyPrice: 1500, deposit: 5000, quantity: 6, imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop' },
    { name: 'Кашемировый свитер', description: 'Мягкий свитер из 100% монгольского кашемира. Ребёканный воротник, манжеты и низ. Тепло при весе всего 200 г. Роскошная текстура и ощущение.', komplekt: 'Свитер + фирменная кашемировая щётка + чехол для хранения', category: 'Одежда', subcategory: 'Свитеры', brand: 'Massimo Dutti', size: 'M', color: 'Серый меланж', condition: 'EXCELLENT', dailyPrice: 4500, deposit: 15000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop' },
    { name: 'Водолазка тонкая', description: 'Тонкая водолазка из итальянской вискозы с добавлением эластана. Облегающий силуэт, высокий ворот. Идеальна как базовый слой под пиджак или пальто.', komplekt: 'Водолазка + фирменная упаковка', category: 'Одежда', subcategory: 'Свитеры', brand: 'Reserved', size: 'S', color: 'Чёрный', condition: 'NEW', dailyPrice: 1800, deposit: 5000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a41?w=400&h=500&fit=crop' },
    { name: 'Кожаная куртка', description: 'Куртка из натуральной овечьей кожи с бархатной подкладкой. Классический мото-крой, молнии YKK. Настоящая кожа — чем старше, тем красивее.', komplekt: 'Куртка + фирменный чехол + карта ухода за кожей', category: 'Одежда', subcategory: 'Куртки', brand: 'Mango', size: 'M', color: 'Черный', condition: 'EXCELLENT', dailyPrice: 5000, deposit: 20000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop' },
    { name: 'Деним куртка oversized', description: 'Классическая джинсовая куртка оверсайз из тёмного денима. Потёртости, нашивки на рукавах. Свободный крой — можно надеть поверх свитера.', komplekt: 'Куртка + фирменная бирка', category: 'Одежда', subcategory: 'Куртки', brand: "Levi's", size: 'L', color: 'Светлый деним', condition: 'EXCELLENT', dailyPrice: 3500, deposit: 12000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop' },
    { name: 'Куртка-пуховик', description: 'Лёгкая куртка на синтепоне с водоотталкивающей пропиткой. Капюшон с фурнитурой, два боковых кармана на молнии. Тепло при весе 400 г.', komplekt: 'Куртка + компрессионный чехол для упаковки', category: 'Одежда', subcategory: 'Куртки', brand: 'ZARA', size: 'M', color: 'Хаки', condition: 'NEW', dailyPrice: 3000, deposit: 10000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd270b3?w=400&h=500&fit=crop' },
    { name: 'Шерстяное пальто', description: 'Тёплое пальто из шерстяной смеси с вискозной подкладкой. Однобортная застёжка, отложной воротник. Длина до середины бедра — элегантный силуэт.', komplekt: 'Пальто + фирменная бирка + чехол для хранения', category: 'Одежда', subcategory: 'Пальто', brand: 'Sandro', size: 'M', color: 'Бежевый', condition: 'EXCELLENT', dailyPrice: 6000, deposit: 25000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop' },
    { name: 'Блуза с бантом', description: 'Элегантная блуза из мягкого крепа с завязкой на шее. Рукава-фонарики, манжеты на пуговицах. Идеальна для офиса и вечернего выхода.', komplekt: 'Блуза + фирменная упаковка', category: 'Одежда', subcategory: 'Блузы', brand: 'ZARA', size: 'S', color: 'Кремовый', condition: 'NEW', dailyPrice: 2200, deposit: 7000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop' },
    { name: 'Шёлковая блуза', description: 'Блуза из 100% натурального шёлка морского шёлка. Плоские швы, пуговицы из перламутра. Шелковистая текстура и благородный блеск.', komplekt: 'Блуза + шёлковый чехол для хранения', category: 'Одежда', subcategory: 'Блузы', brand: 'Massimo Dutti', size: 'S', color: 'Розовый', condition: 'NEW', dailyPrice: 3500, deposit: 12000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=500&fit=crop' },
    { name: 'Черные джинсы slim fit', description: 'Стильные черные джинсы прямого кроя из тянущегося денима. Пропитка сохраняет цвет до 50 стирок. Удобная посадка, карманы на молнии.', komplekt: 'Джинсы + фирменная бирка', category: 'Одежда', subcategory: 'Джинсы', brand: 'H&M', size: 'M', color: 'Черный', condition: 'EXCELLENT', dailyPrice: 1500, deposit: 5000, quantity: 6, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop' },
    { name: 'Классические брюки', description: 'Элегантные брюки прямого кроя из шерстяной смеси. Стрелки, скрытая застёжка, петли для ремня. Подходят под пиджак и рубашку.', komplekt: 'Брюки + фирменная бирка', category: 'Одежда', subcategory: 'Брюки', brand: 'Massimo Dutti', size: 'L', color: 'Серый', condition: 'EXCELLENT', dailyPrice: 2500, deposit: 8000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop' },
    { name: 'Джинсы boyfriend', description: 'Свободные джинсы с потёртостями и разорванным подолом. Высокая посадка, прямой крой от бедра. Идеальный кэжуал-стиль.', komplekt: 'Джинсы + фирменная бирка', category: 'Одежда', subcategory: 'Джинсы', brand: 'Bershka', size: 'S', color: 'Светлый деним', condition: 'EXCELLENT', dailyPrice: 1800, deposit: 5000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=500&fit=crop' },
    { name: 'Шорты из льна', description: 'Лёгкие льняные шорты с завышенной талией. Два боковых и один задний карман. Лён дышит в жару и выглядит дорого.', komplekt: 'Шорты + фирменная упаковка', category: 'Одежда', subcategory: 'Шорты', brand: 'ZARA', size: 'M', color: 'Песочный', condition: 'NEW', dailyPrice: 1500, deposit: 4000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop' },
    { name: 'Юбка миди', description: 'Плиссированная юбка миди из струящейся ткани. Эластичный пояс, красиво колышется при ходьбе. Универсальная длина — от каблуков до кроссовок.', komplekt: 'Юбка + фирменная упаковка', category: 'Одежда', subcategory: 'Юбки', brand: 'Mango', size: 'S', color: 'Тёмно-синий', condition: 'EXCELLENT', dailyPrice: 2000, deposit: 6000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop' },
    { name: 'Карго штаны', description: 'Штаны карго с нашивками и объёмными карманами на бёдрах. Хлопковый камуфляж, свободный крой. Стиль милитари для городских прогулок.', komplekt: 'Штаны + фирменная бирка', category: 'Одежда', subcategory: 'Штаны', brand: 'H&M', size: 'L', color: 'Хаки', condition: 'NEW', dailyPrice: 2000, deposit: 6000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop' },
    { name: 'Брюки wide leg', description: 'Широкие брюки с высокой посадкой из мягкой ткани. Прямой крой от бедра, застёжка на кнопку. Создают вытянутый силуэт и ощущение свободы.', komplekt: 'Брюки + фирменная упаковка', category: 'Одежда', subcategory: 'Брюки', brand: 'Reserved', size: 'M', color: 'Кремовый', condition: 'NEW', dailyPrice: 2200, deposit: 7000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop' },
    { name: 'Спортивные штаны', description: 'Удобные штаны с лампасами из мягкого трикотажа. Эластичный пояс с кулиской, манжеты на щиколотках. Для тренировок и городского стиля.', komplekt: 'Штаны + фирменная упаковка', category: 'Одежда', subcategory: 'Штаны', brand: 'Nike', size: 'L', color: 'Чёрный', condition: 'NEW', dailyPrice: 2000, deposit: 6000, quantity: 7, imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=500&fit=crop' },
    { name: 'Вечернее платье', description: 'Роскошное платье для особых случаев из атласа. V-образный вырез, рельефная талия, шлейф. Вставки из кружева на рукавах.', komplekt: 'Платье + чехол для хранения + антистатическая салфетка', category: 'Одежда', subcategory: 'Платья', brand: 'Massimo Dutti', size: 'S', color: 'Красный', condition: 'NEW', dailyPrice: 5000, deposit: 20000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop' },
    { name: 'Летний сарафан', description: 'Лёгкий сарафан из натуральных тканей с floral-принтом. Тонкие бретели, свободный крой. Идеален для жаркого лета и пляжных вечеринок.', komplekt: 'Сарафан + фирменная упаковка', category: 'Одежда', subcategory: 'Платья', brand: 'Bershka', size: 'S', color: 'Голубой', condition: 'EXCELLENT', dailyPrice: 2500, deposit: 7000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop' },
    { name: 'Платье-рубашка', description: 'Платье оверсайз с поясом из лёгкого хлопка. Воротник-стойка, рукава до локтя, кнопки по всей длине. Носите расстёгнутым как тунито.', komplekt: 'Платье + тканевый пояс', category: 'Одежда', subcategory: 'Платья', brand: 'ZARA', size: 'M', color: 'Белый', condition: 'EXCELLENT', dailyPrice: 2800, deposit: 8000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop' },
    { name: 'Коктейльное платье', description: 'Элегантное платье до колена из струящейся ткани. Асимметричный подол, один рукав. Идеально для коктейля, свадьбы, дня рождения.', komplekt: 'Платье + чехол для хранения', category: 'Одежда', subcategory: 'Платья', brand: 'Mango', size: 'S', color: 'Изумрудный', condition: 'NEW', dailyPrice: 4000, deposit: 15000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop' },
    { name: 'Платье-макси', description: 'Длинное платье в пол из лёгкого шифона. Многорядная юбка, глубокий вырез, тонкий пояс. Создаёт воздушный и романтичный образ.', komplekt: 'Платье + чехол для хранения', category: 'Одежда', subcategory: 'Платья', brand: 'Sandro', size: 'M', color: 'Бордовый', condition: 'EXCELLENT', dailyPrice: 5500, deposit: 22000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&h=500&fit=crop' },
    { name: 'Свитшот-платье', description: 'Удобное платье из тонкого трикотажа прямого кроя. Рукава до локтя, round-neck. Минимализм для тех, кто ценит комфорт.', komplekt: 'Платье + фирменная упаковка', category: 'Одежда', subcategory: 'Платья', brand: 'H&M', size: 'M', color: 'Серый', condition: 'NEW', dailyPrice: 1800, deposit: 5000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop' },
    { name: 'Кожаная сумка', description: 'Стильная кожаная сумка из натуральной кожи. Внутри одно отделение и карман на молнии. Ремешок с регулировкой длины — носите на плече или кросс-боди.', komplekt: 'Сумка + фирменный чехол + пыльник', category: 'Аксессуары', subcategory: 'Сумки', brand: 'Coach', size: 'M', color: 'Коричневый', condition: 'EXCELLENT', dailyPrice: 4000, deposit: 15000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop' },
    { name: 'Шёлковый шарф', description: 'Изысканный шёлковый шарф ручной работы. Яркий геометрический принт, лёгкая ткань. Универсальный аксент для шеи, волос или сумки.', komplekt: 'Шарф + фирменная коробка', category: 'Аксессуары', subcategory: 'Шарфы', brand: 'Escada', size: 'M', color: 'Бордовый', condition: 'NEW', dailyPrice: 2000, deposit: 8000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop' },
    { name: 'Солнцезащитные очки', description: 'Авиаторы с зеркальными линзами классической формы. Металлическая оправа золотистого цвета. Защита UV400, линзы категории 3.', komplekt: 'Очки + фирменный чехол + салфетка из микрофибры', category: 'Аксессуары', subcategory: 'Очки', brand: 'Ray-Ban', size: 'M', color: 'Золотой', condition: 'EXCELLENT', dailyPrice: 2500, deposit: 10000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop' },
    { name: 'Кожаный ремень', description: 'Классический ремень из натуральной кожи ручной выделки. Пряжка из матового никеля. Ширина 3.5 см — подходит для джинсов и брюк.', komplekt: 'Ремень + фирменная коробка', category: 'Аксессуары', subcategory: 'Ремни', brand: 'Massimo Dutti', size: 'M', color: 'Тёмно-коричневый', condition: 'EXCELLENT', dailyPrice: 1500, deposit: 5000, quantity: 6, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop' },
    { name: 'Берет из шерсти', description: 'Классический французский берет из итальянской шерсти. Мягкая форма, подкладка из хлопка. Универсальный размер подходит большинству.', komplekt: 'Берет + фирменная упаковка', category: 'Аксессуары', subcategory: 'Головные уборы', brand: 'Sandro', size: 'M', color: 'Чёрный', condition: 'NEW', dailyPrice: 1200, deposit: 4000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=500&fit=crop' },
    { name: 'Клатч из бархата', description: 'Элегантный бархатный клатч с золотистой цепочкой. Внутри одно отделение и карман. Идеален для вечера — вмещает телефон, помаду, ключи.', komplekt: 'Клатч + съёмная цепочка + фирменный чехол', category: 'Аксессуары', subcategory: 'Сумки', brand: 'Mango', size: 'S', color: 'Изумрудный', condition: 'NEW', dailyPrice: 2500, deposit: 8000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=500&fit=crop' },
    { name: 'Часы классические', description: 'Минималистичные часы с кожаным ремешком и стальным корпусом. Японский механизм, стекло сапфировое. Водозащита 3 ATM.', komplekt: 'Часы + фирменная коробка + запасной ремешок', category: 'Аксессуары', subcategory: 'Часы', brand: 'Daniel Wellington', size: 'M', color: 'Серебристый', condition: 'EXCELLENT', dailyPrice: 3000, deposit: 20000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop' },
    { name: 'Брошка-заколка', description: 'Декоративная брошка с кристаллами Swarovski в серебряной оправе. Идеальна для пальто, шарфов или как акцент на шляпе.', komplekt: 'Брошка + фирменная коробка', category: 'Аксессуары', subcategory: 'Брошки', brand: 'Swarovski', size: 'S', color: 'Серебристый', condition: 'NEW', dailyPrice: 1800, deposit: 12000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop' },
    { name: 'Коляска Chicco Bravo', description: 'Прогулочная коляска с регулируемой спинкой (4 положения). Подножка регулируется, капюшон с окном. Складывается одной рукой, весит 7 кг.', komplekt: 'Коляска + дождевик + корзина для покупок', category: 'Детские товары', subcategory: 'Коляски', brand: 'Chicco', size: 'M', color: 'Серый', condition: 'EXCELLENT', dailyPrice: 5000, deposit: 40000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&h=500&fit=crop' },
    { name: 'Автокресло Cybex', description: 'Автокресло группы 0+/1 (от рождения до 18 кг). Поворот на 360°, 5 положений наклона. Внутренние ремни безопасности, боковая защита.', komplekt: 'Автокресло + адаптер для коляски', category: 'Детские товары', subcategory: 'Автокресла', brand: 'Cybex', size: 'M', color: 'Чёрный', condition: 'NEW', dailyPrice: 4000, deposit: 35000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop' },
    { name: 'Детская кроватка IKEA', description: 'Раскладная кроватка со встроенной полкой для белья. Три уровня высоты дна, колёсики для мобильности. Складывается за 30 секунд.', komplekt: 'Кроватка + матрас + бортик', category: 'Детские товары', subcategory: 'Кроватки', brand: 'IKEA', size: 'L', color: 'Белый', condition: 'EXCELLENT', dailyPrice: 3000, deposit: 25000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=500&fit=crop' },
    { name: 'Детский стульчик для кормления', description: 'Регулируемая высота (7 положений), откидная спинка. Съёмный поднос и чехол для стирки. Выдерживает до 15 кг.', komplekt: 'Стульчик + поднос + чехол', category: 'Детские товары', subcategory: 'Стульчики', brand: 'Peg Perego', size: 'M', color: 'Красный', condition: 'EXCELLENT', dailyPrice: 2500, deposit: 15000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=400&h=500&fit=crop' },
    { name: 'Качели Fisher-Price', description: 'Электрические качели с 6 мелодиями и плавным покачиванием. Съёмное сиденье, 3 положения качания, таймер на 15/30 минут.', komplekt: 'Качели + музыкальная карусель с игрушками', category: 'Детские товары', subcategory: 'Качели', brand: 'Fisher-Price', size: 'S', color: 'Серый/Розовый', condition: 'NEW', dailyPrice: 2000, deposit: 12000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop' },
    { name: 'Ванночка с подставкой', description: 'Складная ванночка с экраном от сквозняка. Внутренний термометр, мягкая вставка-матрасик. Дренажное отверстие для удобного слива.', komplekt: 'Ванночка + термометр + мягкая вставка', category: 'Детские товары', subcategory: 'Ванны', brand: 'Shnuggle', size: 'M', color: 'Белый', condition: 'NEW', dailyPrice: 1500, deposit: 8000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=500&fit=crop' },
    { name: 'Слинг-шарф', description: 'Эргономичный слинг с кольцами для ношения детей от 3,5 до 15 кг. Хлопковая ткань, регулируемая длина. 4 положения ношения.', komplekt: 'Слинг + инструкция по ношению', category: 'Детские товары', subcategory: 'Слинги', brand: 'Ergobaby', size: 'M', color: 'Серый', condition: 'EXCELLENT', dailyPrice: 1500, deposit: 6000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1590073844006-333797384063?w=400&h=500&fit=crop' },
    { name: 'Детский горшок 3-в-1', description: 'Горшок с переходником для детей от 18 месяцев до 4 лет. Мягкое сиденье, антискользящие ножки. Складные ножки для хранения.', komplekt: 'Горшок + переходник + стульчик', category: 'Детские товары', subcategory: 'Горшки', brand: 'BabyBjörn', size: 'S', color: 'Белый', condition: 'NEW', dailyPrice: 800, deposit: 3000, quantity: 6, imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop' },
    { name: 'Золотые серьги-кольца', description: 'Серьги-гвоздики из белого золота 585 пробы. Гладкая полированная поверхность, застёжка- push-back. Универсальный аксессуар на каждый день.', komplekt: 'Серьги + фирменная коробка Pandora', category: 'Украшения', subcategory: 'Серьги', brand: 'Pandora', size: 'S', color: 'Белое золото', condition: 'NEW', dailyPrice: 3000, deposit: 25000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop' },
    { name: 'Серебряная цепочка', description: 'Цепочка из серебра 925 пробы с родиевым покрытием. Длина 45 см, замок-карабин. Классическое плетение «панцирная цепь».', komplekt: 'Цепочка + фирменная коробка Swarovski', category: 'Украшения', subcategory: 'Цепочки', brand: 'Swarovski', size: 'S', color: 'Серебро', condition: 'NEW', dailyPrice: 2000, deposit: 15000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop' },
    { name: 'Кольцо с бриллиантом', description: 'Кольцо из белого золота 750 пробы с бриллиантом 0,3 карата. Огранка «круг», чистота VS1, цвет G. Классическая оправа.', komplekt: 'Кольцо + сертификат + фирменная коробка Tiffany', category: 'Украшения', subcategory: 'Кольца', brand: 'Tiffany & Co', size: 'S', color: 'Белое золото', condition: 'NEW', dailyPrice: 8000, deposit: 80000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop' },
    { name: 'Браслет-бэнгл', description: 'Золотой браслет-бэнгл из жёлтого золота 750 пробы. Ширина 3 мм, полированная поверхность. Классический дизайн — можно носить по одному или стопкой.', komplekt: 'Браслет + фирменная коробка Cartier', category: 'Украшения', subcategory: 'Браслеты', brand: 'Cartier', size: 'S', color: 'Золото', condition: 'NEW', dailyPrice: 6000, deposit: 50000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop' },
    { name: 'Жемчужное ожерелье', description: 'Ожерелье из натурального пресноводного жемчуга диаметром 6-7 мм. Нитка на шёлковом шнуре, застёжка-тогл. Каждая жемчужина уникальна.', komplekt: 'Ожерелье + фирменная коробка Mikimoto', category: 'Украшения', subcategory: 'Ожерелья', brand: 'Mikimoto', size: 'S', color: 'Белый', condition: 'NEW', dailyPrice: 5000, deposit: 40000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=500&fit=crop' },
    { name: 'Запонки серебряные', description: 'Серебряные запонки 925 пробы с матовым покрытием. Квадратная форма, застёжка-кнопка. Подходят для рубашек с двойными манжетами.', komplekt: 'Запонки + фирменная коробка Montblanc', category: 'Украшения', subcategory: 'Запонки', brand: 'Montblanc', size: 'S', color: 'Серебро', condition: 'NEW', dailyPrice: 2000, deposit: 10000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=500&fit=crop' },
    { name: 'Подвеска-медальон', description: 'Золотой медальон из жёлтого золота 750 пробы. Круглая форма, гравировка, застёжка-пружина. Можно открыть и положить фото.', komplekt: 'Подвеска + фирменная коробка Chopard', category: 'Украшения', subcategory: 'Подвески', brand: 'Chopard', size: 'S', color: 'Золото', condition: 'NEW', dailyPrice: 4000, deposit: 30000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop' },
    { name: 'Серьги-пусеты с рубинами', description: 'Серьги-пусеты из белого золота с синтетическими рубинами. Классическая огранка, застёжка- push-back. Яркий акцент для вечернего образа.', komplekt: 'Серьги + фирменная коробка Swarovski', category: 'Украшения', subcategory: 'Серьги', brand: 'Swarovski', size: 'S', color: 'Золото', condition: 'NEW', dailyPrice: 2500, deposit: 18000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=400&h=500&fit=crop' },
    { name: 'Комплект Деловой Алматы', description: 'Готовый образ для деловой встречи или конференции. Серый пиджак, белая рубашка и тёмные брюки — классическое сочетание для бизнеса.', komplekt: 'Пиджак + рубашка + брюки + запонки + чехлы для каждого предмета', category: 'Туристические', subcategory: 'Деловые комплекты', brand: 'Massimo Dutti', size: 'M', color: 'Серый', condition: 'NEW', dailyPrice: 6000, deposit: 25000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop' },
    { name: 'Комплект Вечерний выход', description: 'Всё для роскошного вечера: чёрное платье, шёлковый шарф и элегантная сумка. Идеален для ужина, театра или светского мероприятия.', komplekt: 'Платье + шарф + сумка-клатч + чехлы для хранения', category: 'Туристические', subcategory: 'Вечерние комплекты', brand: 'Mango', size: 'S', color: 'Чёрный', condition: 'NEW', dailyPrice: 7000, deposit: 30000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop' },
    { name: 'Комплект Горный курорт', description: 'Тёплый комплект для зимнего отдыха в горах. Шерстяное пальто, кашемировый шарф и кожаные перчатки — тепло и стильно на лыжне.', komplekt: 'Пальто + шарф + перчатки + фирменные чехлы', category: 'Туристические', subcategory: 'Зимние комплекты', brand: 'Sandro', size: 'M', color: 'Бежевый', condition: 'NEW', dailyPrice: 5500, deposit: 20000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=500&fit=crop' },
    { name: 'Комплект Детский выход', description: 'Всё необходимое для прогулки с малышом: прогулочная коляска, автокресло и большая сумка для вещей. Одна заявка — весь комплект.', komplekt: 'Коляска + автокресло + сумка для мамы + дождевик', category: 'Туристические', subcategory: 'Детские комплекты', brand: 'Chicco', size: 'L', color: 'Серый', condition: 'NEW', dailyPrice: 8000, deposit: 50000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop' },
    { name: 'Комплект Аксессуары VIP', description: 'Премиальный набор аксессуаров для делового человека: швейцарские часы, кожаный ремень и портфель ручной работы Montblanc.', komplekt: 'Часы + ремень + портфель + фирменные коробки + чехлы', category: 'Туристические', subcategory: 'Премиум комплекты', brand: 'Montblanc', size: 'M', color: 'Чёрный', condition: 'NEW', dailyPrice: 9000, deposit: 60000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop' },
  ];

  for (const item of clothing) {
    await prisma.clothing.create({ data: item as any });
  }

  console.log(`✅ Created ${clothing.length} items across all categories`);

  // === ПОЛЬЗОВАТЕЛИ ===
  const adminHash = await bcrypt.hash('admin123', 10);
  const testHash = await bcrypt.hash('test123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@vestiq.kz',
      fullName: 'Администратор Vestiq',
      phone: '+77001234567',
      passwordHash: adminHash,
      role: 'ADMIN'
    }
  });

  await prisma.user.create({
    data: {
      email: 'test@vestiq.kz',
      fullName: 'Айдар Сатпаев',
      phone: '+77009876543',
      passwordHash: testHash,
      role: 'USER'
    }
  });

  console.log('✅ Users created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# Vestiq - Сервис аренды одежды по подписке

## Быстрый старт

### Предварительные требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

### 1. Настройка базы данных

```bash
# Создайте базу данных в PostgreSQL
createdb vestiq
```

### 2. Запуск Backend

```bash
cd backend

# Установите зависимости
npm install

# Скопируйте .env файл (уже создан)
# Отредактируйте DATABASE_URL если нужно

# Сгенерируйте Prisma клиент
npm run db:generate

# Примените миграции
npm run db:push

# Заполните базу тестовыми данными
npm run db:seed

# Запустите сервер
npm run dev
```

Сервер запустится на http://localhost:3001

### 3. Запуск Frontend

```bash
cd frontend

# Установите зависимости
npm install

# Запустите development сервер
npm run dev
```

Frontend запустится на http://localhost:3000

## Тестовые данные

### Администратор
- Email: admin@vestiq.kz
- Пароль: admin123

### Тестовый пользователь
- Email: test@vestiq.kz
- Пароль: test123

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Clothing
- `GET /api/clothing` - Каталог (с фильтрами)
- `GET /api/clothing/:id` - Детали вещи
- `GET /api/clothing/categories` - Категории

### Subscriptions
- `GET /api/subscriptions/plans` - Тарифные планы
- `POST /api/subscriptions/subscribe` - Оформить подписку
- `POST /api/subscriptions/cancel` - Отменить подписку
- `GET /api/subscriptions/current` - Текущая подписка

### Rentals
- `GET /api/rentals` - Мои аренды
- `GET /api/rentals/active` - Активные аренды
- `POST /api/rentals` - Создать аренду
- `PUT /api/rentals/:id/return` - Вернуть вещи
- `PUT /api/rentals/:id/cancel` - Отменить аренду

### Payments
- `POST /api/payments/create` - Создать платеж
- `GET /api/payments/history` - История платежей
- `POST /api/payments/webhook` - Webhook от плат. системы

## Тарифные планы

| План | Цена/мес | Вещей | Дней аренды |
|------|----------|-------|------------|
| Basic | 15,000₸ | 2 | 7 |
| Premium | 35,000₸ | 5 | 14 |
| VIP | 65,000₸ | 10 | 30 |

## Структура проекта

```
vestiq/
├── backend/           # Node.js + Express API
│   ├── prisma/        # Миграции и сиды
│   └── src/           # Исходный код
├── frontend/          # Next.js приложение
│   └── src/           # Исходный код
└── README.md
```

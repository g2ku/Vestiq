import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, refreshToken } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов'),
  body('phone').optional().isMobilePhone('kk-KZ').withMessage('Некорректный номер телефона'),
  body('fullName').optional().trim().isLength({ min: 2 }).withMessage('Имя должно быть минимум 2 символа')
];

const loginValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Введите пароль')
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getMe);
router.post('/refresh', authenticate, refreshToken);

export default router;

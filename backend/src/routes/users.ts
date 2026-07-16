import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validation rules
const updateProfileValidation = [
  body('fullName').optional().trim().isLength({ min: 2 }).withMessage('Имя должно быть минимум 2 символа'),
  body('phone').optional().isMobilePhone('kk-KZ').withMessage('Некорректный номер телефона')
];

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, validate, updateProfile);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllUsers);

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllClothing,
  getClothingById,
  createClothing,
  updateClothing,
  deleteClothing,
  getCategories
} from '../controllers/clothingController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validation rules
const clothingValidation = [
  body('name').trim().notEmpty().withMessage('Введите название'),
  body('category').trim().notEmpty().withMessage('Выберите категорию'),
  body('size').trim().notEmpty().withMessage('Выберите размер'),
  body('dailyPrice').isInt({ min: 1 }).withMessage('Цена должна быть положительным числом')
];

// Public routes
router.get('/', getAllClothing);
router.get('/categories', getCategories);
router.get('/:id', getClothingById);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), clothingValidation, validate, createClothing);
router.put('/:id', authenticate, authorize('ADMIN'), updateClothing);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteClothing);

export default router;
